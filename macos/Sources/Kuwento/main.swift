import AppKit
import WebKit
import AVFoundation
import UserNotifications
import UniformTypeIdentifiers

// This app displays the same authenticated server record. It stores no second learner database.
final class CompanionDelegate: NSObject, NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler, WKDownloadDelegate, UNUserNotificationCenterDelegate {
    var window: NSWindow!
    var web: WKWebView!
    var status: NSStatusItem!
    var recorder: AVAudioRecorder?
    var recordingURL: URL?
    var latestReminderSignature = ""
    let defaultOrigin = "https://kuwento-language-companion.copperplume66.chatgpt.site"
    var origin: URL { URL(string: UserDefaults.standard.string(forKey: "CompanionOrigin") ?? defaultOrigin)! }

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory)
        UNUserNotificationCenter.current().delegate = self
        let config = WKWebViewConfiguration()
        config.websiteDataStore = .default()
        config.mediaTypesRequiringUserActionForPlayback = [.audio, .video]
        config.userContentController.add(self, name: "kuwento")
        web = WKWebView(frame: .zero, configuration: config)
        web.navigationDelegate = self
        web.uiDelegate = self
        web.allowsBackForwardNavigationGestures = true
        window = NSWindow(contentRect: NSRect(x:0,y:0,width:1180,height:820), styleMask:[.titled,.closable,.miniaturizable,.resizable],backing:.buffered,defer:false)
        window.title = "Kuwento · Your language, lived"
        window.minSize = NSSize(width:420,height:600)
        window.contentView = web
        window.center()
        window.isReleasedWhenClosed = false
        status = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        status.button?.image = NSImage(systemSymbolName: "text.bubble", accessibilityDescription:"Kuwento language companion")
        updateMenu()
        web.load(URLRequest(url:origin))
        showCompanion()
    }
    func item(_ title:String, _ action:Selector, _ key:String="") -> NSMenuItem { let i=NSMenuItem(title:title,action:action,keyEquivalent:key);i.target=self;return i }
    func updateMenu() {
        let menu=NSMenu()
        menu.addItem(item("Open my learning companion",#selector(showCompanion),"o"))
        menu.addItem(item("Continue teaching in ChatGPT",#selector(openChatGPT)))
        menu.addItem(.separator())
        menu.addItem(item(recorder == nil ? "Record a spoken response…" : "Stop & save spoken response…",#selector(toggleRecording),"r"))
        menu.addItem(item("Allow optional reminder notifications…",#selector(allowNotifications)))
        menu.addItem(item("Pause reminders on this Mac",#selector(pauseReminders)))
        menu.addItem(.separator())
        menu.addItem(item("Open companion in browser",#selector(openBrowser)))
        menu.addItem(item("Companion server…",#selector(changeServer)))
        menu.addItem(item("Reload current learner record",#selector(reload),"l"))
        menu.addItem(.separator())
        menu.addItem(item("Quit Kuwento",#selector(quit),"q"))
        status.menu=menu
        status.button?.image=NSImage(systemSymbolName:recorder == nil ? "text.bubble" : "mic.fill",accessibilityDescription:recorder == nil ? "Kuwento" : "Recording audio")
    }
    @objc func showCompanion() {window.makeKeyAndOrderFront(nil);NSApp.activate(ignoringOtherApps:true)}
    @objc func openChatGPT() {NSWorkspace.shared.open(URL(string:"https://chatgpt.com")!)}
    @objc func openBrowser() {NSWorkspace.shared.open(origin)}
    @objc func reload() {web.reload()}
    @objc func quit() {recorder?.stop();if let u=recordingURL{try? FileManager.default.removeItem(at:u)};NSApp.terminate(nil)}
    func alert(_ title:String,_ message:String) {let a=NSAlert();a.messageText=title;a.informativeText=message;a.addButton(withTitle:"OK");showCompanion();a.runModal()}
    @objc func changeServer() {
        let a=NSAlert();a.messageText="Companion server";a.informativeText="Use your hosted HTTPS origin, or localhost for development. Learner progress stays on the selected server; changing servers does not copy it."
        a.addButton(withTitle:"Open server");a.addButton(withTitle:"Cancel")
        let field=NSTextField(string:origin.absoluteString);field.frame=NSRect(x:0,y:0,width:440,height:26);a.accessoryView=field
        showCompanion();guard a.runModal() == .alertFirstButtonReturn else{return}
        guard let u=URL(string:field.stringValue),let host=u.host,(u.scheme=="https" || (u.scheme=="http" && ["localhost","127.0.0.1"].contains(host))),u.user==nil,u.password==nil else{alert("Invalid server","Use an HTTPS URL, or a local development server.");return}
        UserDefaults.standard.set(u.absoluteString,forKey:"CompanionOrigin");latestReminderSignature="";web.load(URLRequest(url:u))
    }
    @objc func allowNotifications() {
        UserDefaults.standard.set(false,forKey:"RemindersPausedOnMac")
        UNUserNotificationCenter.current().requestAuthorization(options:[.alert,.sound]) { granted,error in DispatchQueue.main.async{self.latestReminderSignature="";self.web.reload();self.alert(granted ? "Reminders are available" : "Reminders remain off",granted ? "Choose a schedule in Connect & privacy. Your active learner profile controls the local time, time zone, and pauses." : "Your progress is unaffected. You can allow notifications later in macOS Settings.")} }
    }
    @objc func pauseReminders() {UserDefaults.standard.set(true,forKey:"RemindersPausedOnMac");UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers:["kuwento-practice"]);latestReminderSignature="";alert("Reminders paused","No practice notifications will be scheduled on this Mac until you choose Allow optional reminder notifications. Your learner record is unchanged.")}
    func userContentController(_ userContentController:WKUserContentController,didReceive message:WKScriptMessage) {
        guard message.frameInfo.isMainFrame,message.frameInfo.securityOrigin.host==origin.host,let body=message.body as? [String:Any],body["action"] as? String=="reminder",let r=body["reminders"] as? [String:Any] else{return}
        let signature=String(describing:r)+String(describing:body["profileId"])
        guard signature != latestReminderSignature else{return};latestReminderSignature=signature
        let center=UNUserNotificationCenter.current();center.removePendingNotificationRequests(withIdentifiers:["kuwento-practice"])
        guard !UserDefaults.standard.bool(forKey:"RemindersPausedOnMac"),r["enabled"] as? Bool==true,r["paused"] as? Bool != true,let time=r["time"] as? String,let zone=r["timezone"] as? String,let tz=TimeZone(identifier:zone) else{return}
        let parts=time.split(separator:":").compactMap{Int($0)};guard parts.count==2 else{return}
        center.getNotificationSettings { settings in guard settings.authorizationStatus == .authorized else{return};var components=DateComponents();components.hour=parts[0];components.minute=parts[1];components.timeZone=tz
            let content=UNMutableNotificationContent();content.title="A little Tagalog, when you’re ready";content.body="Your next conversation is waiting. A small attempt is enough.";content.sound = .default
            center.add(UNNotificationRequest(identifier:"kuwento-practice",content:content,trigger:UNCalendarNotificationTrigger(dateMatching:components,repeats:true)))
        }
    }
    @objc func toggleRecording() {
        if let rec=recorder {rec.stop();recorder=nil;updateMenu();saveRecording();return}
        AVCaptureDevice.requestAccess(for:.audio){granted in DispatchQueue.main.async{guard granted else{self.alert("Microphone access is off","You can upload an existing recording or use written practice. No ability is inferred from this choice.");return};self.beginRecording()}}
    }
    func beginRecording(){do{let url=FileManager.default.temporaryDirectory.appendingPathComponent("kuwento-\(UUID().uuidString).m4a");let rec=try AVAudioRecorder(url:url,settings:[AVFormatIDKey:kAudioFormatMPEG4AAC,AVSampleRateKey:44100,AVNumberOfChannelsKey:1,AVEncoderAudioQualityKey:AVAudioQuality.high.rawValue]);guard rec.record() else{throw NSError(domain:"Kuwento",code:1)};recordingURL=url;recorder=rec;updateMenu();alert("Recording a spoken response","Use the menu-bar item again to stop and choose whether to save a local audio file. Nothing is uploaded or assessed automatically.")}catch{alert("Recording unavailable",error.localizedDescription)}}
    func saveRecording(){guard let u=recordingURL else{return};let panel=NSSavePanel();panel.title="Save this spoken response on your Mac";panel.nameFieldStringValue="Kuwento spoken response.m4a";panel.allowedContentTypes=[.mpeg4Audio];showCompanion();panel.beginSheetModal(for:window){response in defer{try? FileManager.default.removeItem(at:u);self.recordingURL=nil};guard response == .OK,let dest=panel.url else{return};do{if FileManager.default.fileExists(atPath:dest.path){try FileManager.default.removeItem(at:dest)};try FileManager.default.copyItem(at:u,to:dest);self.alert("Saved on this Mac","To retain it in your shared learner record, choose Listen & speak, enable recording retention, and upload this file. No pronunciation score has been assigned.")}catch{self.alert("Could not save audio",error.localizedDescription)}}}
    func webView(_ webView:WKWebView,requestMediaCapturePermissionFor origin:WKSecurityOrigin,initiatedByFrame frame:WKFrameInfo,type:WKMediaCaptureType,decisionHandler:@escaping(WKPermissionDecision)->Void){guard origin.host==self.origin.host,type == .microphone else{decisionHandler(.deny);return};AVCaptureDevice.requestAccess(for:.audio){ok in DispatchQueue.main.async{decisionHandler(ok ? .grant : .deny)}}}
    func webView(_ webView:WKWebView,runOpenPanelWith parameters:WKOpenPanelParameters,initiatedByFrame frame:WKFrameInfo,completionHandler:@escaping([URL]?)->Void){guard frame.securityOrigin.host==origin.host else{completionHandler(nil);return};let panel=NSOpenPanel();panel.allowsMultipleSelection=parameters.allowsMultipleSelection;panel.canChooseDirectories=parameters.allowsDirectories;panel.beginSheetModal(for:window){result in completionHandler(result == .OK ? panel.urls:nil)}}
    func webView(_ webView:WKWebView,createWebViewWith configuration:WKWebViewConfiguration,for navigationAction:WKNavigationAction,windowFeatures:WKWindowFeatures)->WKWebView?{if let u=navigationAction.request.url, ["https","http"].contains(u.scheme ?? ""){NSWorkspace.shared.open(u)};return nil}
    func webView(_ webView:WKWebView,decidePolicyFor navigationAction:WKNavigationAction,decisionHandler:@escaping(WKNavigationActionPolicy)->Void){if navigationAction.shouldPerformDownload{decisionHandler(.download);return};guard let u=navigationAction.request.url else{decisionHandler(.cancel);return};if ["https","http","about","blob"].contains(u.scheme ?? ""){decisionHandler(.allow)}else{decisionHandler(.cancel)}}
    func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) { download.delegate = self }
    func webView(_ webView: WKWebView, navigationResponse: WKNavigationResponse, didBecome download: WKDownload) { download.delegate = self }
    func download(_ download: WKDownload, decideDestinationUsing response: URLResponse, suggestedFilename: String, completionHandler: @escaping (URL?) -> Void) { let panel=NSSavePanel();panel.nameFieldStringValue=suggestedFilename;panel.beginSheetModal(for:window){result in completionHandler(result == .OK ? panel.url:nil)} }
    func userNotificationCenter(_ center:UNUserNotificationCenter,didReceive response:UNNotificationResponse,withCompletionHandler completionHandler:@escaping()->Void){DispatchQueue.main.async{self.showCompanion()};completionHandler()}
    func userNotificationCenter(_ center:UNUserNotificationCenter,willPresent notification:UNNotification,withCompletionHandler completionHandler:@escaping(UNNotificationPresentationOptions)->Void){completionHandler([.banner,.sound])}
}
let app=NSApplication.shared
let delegate=CompanionDelegate()
app.delegate=delegate
app.run()
