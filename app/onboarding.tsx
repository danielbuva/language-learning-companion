'use client';
import React,{useEffect,useRef,useState} from 'react';
import {ArrowRight,ArrowUpRight,Check,CheckCircle2,ChevronLeft,Copy,Heart,Link2,MessageCircle,RefreshCw,Shield,Sparkles,Target} from 'lucide-react';

type Snapshot=any;
const steps=['Your goals','Your comfort','Connect ChatGPT','First conversation'];
const interests=['Family & friends','Food & cooking','Travel','Everyday life','Work','Stories & culture'];
async function request(path:string,method='GET',body?:unknown){
 const res=await fetch('/api/companion'+path,{method,headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,cache:'no-store'});
 const data:any=await res.json();if(!res.ok)throw Error(data.error||'Unable to save. Please try again.');return data;
}
export function lessonPrompt(profile:Snapshot){
 return `Use the Kuwento · Language Learning Companion plugin to teach me Tagalog. First call get_learning_summary with profileId "${profile.id}" and tell me which profile you loaded. Use my saved goals, support preferences, accessibility needs, and unfinished checkpoints. Let's have a short, natural conversation about ${profile.settings.topics?.[0]||'everyday life'} toward my goal: ${profile.settings.goals?.[0]?.replace(/[.!?]+$/, '')||'communicating in everyday situations'}. Ask one manageable question and wait for my answer. Check my starting point gently; treat untested abilities as unassessed. Distinguish my confidence from your observed assessment. Save only concise permitted observations of actual attempts and a checkpoint as we go, including support used and uncertainty. Never infer listening or speaking ability from text. Don't claim a save succeeded unless the tool confirms it.`;
}
export default function Onboarding({snapshot,initialStep,onSaved,onClose}:{snapshot?:Snapshot;initialStep?:number;onSaved:(id:string)=>Promise<void>;onClose:()=>void}){
 const profile=snapshot?.profile,preferences=profile?.settings||{};
 const [step,setStep]=useState(initialStep??preferences.onboarding?.step??(profile?1:0));
 const [name,setName]=useState(profile?.name||''),[goal,setGoal]=useState(preferences.goals?.join('\n')||'');
 const [topics,setTopics]=useState<string[]>(preferences.topics||[]),[otherTopics,setOtherTopics]=useState('');
 const [opportunities,setOpportunities]=useState(preferences.opportunities||''),[background,setBackground]=useState(preferences.background||'');
 const [english,setEnglish]=useState(preferences.english||'balanced'),[correction,setCorrection]=useState(preferences.correction||'after-exchange'),[accessibility,setAccessibility]=useState(preferences.accessibility||'');
 const [busy,setBusy]=useState(false),[checking,setChecking]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState(''),[connection,setConnection]=useState(snapshot?.connection),[copied,setCopied]=useState(false);
 const heading=useRef<HTMLHeadingElement>(null),savedProfile=useRef(profile);
 useEffect(()=>{heading.current?.focus();window.scrollTo({top:0,behavior:'instant'});},[step]);
 useEffect(()=>{setConnection(snapshot?.connection);},[snapshot?.connection?.status,snapshot?.connection?.verifiedAt]);
 const connected=!!preferences.connected,verified=connection?.status==='verified'&&connected;
 const save=async(changes:Snapshot,nextStep=step,completed=false,deferred=false)=>{
  setBusy(true);setError('');setMessage('');
  try{
   const onboarding={version:1,step:nextStep,completed,deferred};
   if(savedProfile.current){const p=await request('/profiles/'+savedProfile.current.id,'PATCH',{revision:savedProfile.current.revision,...changes,settings:{...changes.settings,onboarding}});savedProfile.current=p;await onSaved(p.id);}
   else {const p=await request('/profiles','POST',{...changes,settings:{...changes.settings,onboarding}});savedProfile.current=p;await onSaved(p.id);}
   setStep(nextStep);return true;
  }catch(e:any){setError(e.message);return false;}finally{setBusy(false);}
 };
 const checkConnection=async(manual=true)=>{
  if(!profile)return;
  if(manual){setChecking(true);setError('');setMessage('');}
  try{const latest=await request('/profiles/'+profile.id);setConnection(latest.connection);if(latest.connection.status==='verified'){await onSaved(profile.id);if(manual)setMessage('ChatGPT successfully read this profile. You’re ready.');}else if(manual)setMessage('No connected summary read yet. Select @Kuwento in ChatGPT and send the starter prompt below.');}
  catch(e:any){if(manual)setError(e.message);}finally{if(manual)setChecking(false);}
 };
 useEffect(()=>{if(step!==3||!connected||verified)return;const tick=()=>{if(document.visibilityState==='visible')void checkConnection(false);};const timer=setInterval(tick,5000);window.addEventListener('focus',tick);return ()=>{clearInterval(timer);window.removeEventListener('focus',tick);};},[step,profile?.id,connected,verified]);
 const prompt=profile?lessonPrompt(profile):'';
 const copy=async(text:string)=>{try{await navigator.clipboard.writeText(text);setCopied(true);setMessage('Copied. Select @Kuwento in your ChatGPT conversation, then paste and send.');}catch{setMessage('Select and copy the text below. Clipboard access is unavailable.');}};
 const defer=async()=>{if(await save({},Math.max(1,step),false,true))onClose();};
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();
  if(step===1){if(!goal.trim()){setError('Add a small, real-life goal to give your tutor a starting point.');return;}await save({name,settings:{goals:goal.split('\n').map((g:string)=>g.trim()).filter(Boolean),topics:[...new Set([...topics,...otherTopics.split(',').map(t=>t.trim()).filter(Boolean)])],opportunities}},2);}
  else if(step===2)await save({settings:{background,english,immersion:english,correction,accessibility}},3);
  else if(step===3){if(await save({},4))setCopied(false);}
  else if(step===4){if(await save({},4,true))onClose();}
 };
 if(step===0)return <section className="onboarding-intro" aria-labelledby="onboarding-title">
  <span className="setup-kicker"><Sparkles size={15}/> WELCOME TO KUWENTO</span>
  <h1 id="onboarding-title" ref={heading} tabIndex={-1}>Your Tagalog.<br/><em>Your real life.</em></h1>
  <p className="setup-lede">Learn through conversation in ChatGPT. Keep your goals, discoveries, and next steps together here.</p>
  <div className="setup-journey" aria-label="How Kuwento works">
   <article><span className="journey-icon"><Heart size={23}/></span><small>01 · MAKE IT PERSONAL</small><h2>A profile that grows with you</h2><p>Tell us what you want to do in Tagalog and what helps you learn.</p></article>
   <article><span className="journey-icon"><MessageCircle size={23}/></span><small>02 · LEARN IN CHATGPT</small><h2>A conversation, with continuity</h2><p>Connect Kuwento so your tutor can pick up your saved context in supported chats.</p></article>
   <article><span className="journey-icon"><Target size={23}/></span><small>03 · SEE WHAT YOU CAN DO</small><h2>Progress you can understand</h2><p>Real attempts and separate assessments. Untested skills stay unassessed.</p></article>
  </div>
  <div className="intro-actions"><button onClick={()=>setStep(1)}>Set up my learning profile <ArrowRight size={17}/></button><span>About 3 minutes · No placement test</span></div>
  <div className="setup-trust"><Shield size={17}/><p>You choose what to connect and save. Full conversations aren’t required. Export or delete your companion record whenever you choose.</p></div>
 </section>;
 return <section className="onboarding" aria-labelledby="setup-title">
  <div className="setup-top"><span className="setup-kicker">A GOOD PLACE TO BEGIN</span>{profile&&<button className="text-button" disabled={busy} onClick={defer}>Finish setup later</button>}</div>
  <ol className="setup-stepper" aria-label="Setup progress">{steps.map((title,i)=><li key={title} className={step===i+1?'current':step>i+1?'done':''} aria-current={step===i+1?'step':undefined}><span>{step>i+1?<Check size={15}/>:i+1}</span><b>{title}</b></li>)}</ol>
  <div className="setup-layout"><div className="setup-panel"><form onSubmit={submit}>
   <span className="setup-kicker">STEP {step} OF 4{profile?' · TAGALOG':''}</span>
   <h1 id="setup-title" ref={heading} tabIndex={-1}>{['','What would you love to say?','Make learning feel like you.','Bring your ChatGPT tutor along.','Your first conversation awaits.'][step]}</h1>
   <p className="setup-description">{['','Start with a real-life goal. Your profile gives every connected lesson a direction.','Choose your starting support. You can change these preferences as you learn.','Give supported chats access to this profile, then confirm that ChatGPT can read it.','Your profile is saved and your connection has been verified. Let’s put them to use.'][step]}</p>
   {step===1&&<>
    <label className="field"><span>What should we call you? <span aria-hidden="true">*</span></span><input autoComplete="given-name" maxLength={100} required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name or a nickname"/></label>
    <label className="field"><span>What would you like to do in Tagalog? <span aria-hidden="true">*</span></span><textarea rows={3} required maxLength={2000} value={goal} onChange={e=>setGoal(e.target.value)} placeholder="For example: Join everyday conversations with my family."/><small>One goal per line. A small, useful goal is enough.</small></label>
    <div className="goal-examples" aria-label="Goal ideas">{['Chat with family','Travel with confidence','Tell my own stories'].map(g=><button type="button" className="secondary" key={g} onClick={()=>setGoal(goal?goal+'\n'+g:g)}>{g} <span aria-hidden="true">+</span></button>)}</div>
    <fieldset className="setup-interests"><legend>What do you enjoy talking about? <small>Optional</small></legend><div>{interests.map(t=><button type="button" className={'topic-chip '+(topics.includes(t)?'selected':'')} key={t} aria-pressed={topics.includes(t)} onClick={()=>setTopics(topics.includes(t)?topics.filter(x=>x!==t):[...topics,t])}>{topics.includes(t)&&<Check size={14}/>} {t}</button>)}</div></fieldset>
    <label className="field"><span>Other interests <small>Optional</small></span><input value={otherTopics} onChange={e=>setOtherTopics(e.target.value)} placeholder="Music, gardening, basketball…"/><small>Separate with commas.</small></label>
    <label className="field"><span>Where could Tagalog fit into your day? <small>Optional</small></span><textarea rows={2} maxLength={1500} value={opportunities} onChange={e=>setOpportunities(e.target.value)} placeholder="A family call, a local café, a few minutes after work…"/></label>
   </>}
   {step===2&&<>
    <label className="field"><span>Your experience so far <small>Optional · your own description</small></span><textarea rows={2} value={background} maxLength={1500} onChange={e=>setBackground(e.target.value)} placeholder="I’m starting fresh / I grew up hearing Tagalog / I know a few phrases…"/><small>This gives your tutor context. It doesn’t set an assessed level.</small></label>
    <label className="field"><span>How much English support feels right?</span><select value={english} onChange={e=>setEnglish(e.target.value)}><option value="more-english">More English, with small steps into Tagalog</option><option value="balanced">A comfortable balance of English and Tagalog</option><option value="more-tagalog">More Tagalog, with English when I need it</option></select></label>
    <label className="field"><span>When would you like corrections?</span><select value={correction} onChange={e=>setCorrection(e.target.value)}><option value="after-exchange">After an exchange, to keep the conversation flowing</option><option value="selective">Interrupt selectively when it helps understanding</option><option value="immediate">As I go, with immediate feedback</option></select></label>
    <label className="field"><span>What makes practice accessible for you? <small>Optional</small></span><textarea rows={3} maxLength={1500} value={accessibility} onChange={e=>setAccessibility(e.target.value)} placeholder="Written alternatives to audio, extra thinking time, shorter prompts, clearer formatting…"/></label>
    <div className="setup-inline-note"><Heart size={18}/><p>Listening, speaking, reading, and writing have separate assessments. You can learn through text and add audio whenever you’re comfortable.</p></div>
   </>}
   {step===3&&<>
    <div className={'setup-status '+(verified?'verified':'')} role="status"><span>{verified?<CheckCircle2 size={23}/>:<Link2 size={23}/>}</span><div><b>{verified?'ChatGPT connection verified':connected?'Permission enabled · awaiting ChatGPT':'Connected tutoring is off'}</b><p>{verified?'An authenticated ChatGPT tool read this profile on '+new Date(connection.verifiedAt).toLocaleString()+'.':connected?'We’ll confirm the connection after ChatGPT reads your learning summary.':'Enable only if you want Kuwento tools in ChatGPT to read and update this learner record.'}</p></div></div>
    {verified&&<button type="button" disabled={busy} onClick={()=>save({},4)}>Continue to my first lesson <ArrowRight size={16}/></button>}
    <div className="connection-step"><span>1</span><div><h2>Choose connected tutoring</h2><p>Authorized Kuwento tools can read your goals, preferences, evidence, and checkpoints, and save selected learning records. Unrelated chats are not monitored. A summary read stores a connection receipt.</p>{!connected?<button type="button" disabled={busy} onClick={()=>save({settings:{connected:true}},3)}>Allow connected tutoring chats <Link2 size={16}/></button>:<p className="setup-allowed"><Check size={16}/> Permission enabled for {profile.name}</p>}<small>Response excerpts and audio stay under your existing privacy choices. You can revoke chat access in Connect & privacy.</small></div></div>
    <div className="connection-step"><span>2</span><div><h2>Install and connect Kuwento</h2><p>Open ChatGPT Plugins using the same account as this learning space. Find <b>Kuwento · Language Learning Companion</b> in your personal plugins, install it, and complete Connect if asked.</p><a className="button secondary" href="https://chatgpt.com/plugins" target="_blank" rel="noreferrer">Open ChatGPT Plugins <ArrowUpRight size={15}/></a><small>Already installed? Go straight to your conversation.</small></div></div>
    <div className="connection-step"><span>3</span><div><h2>Start a connected conversation</h2><p>In a new ChatGPT chat, type <b>@</b> and select <b>Kuwento</b>. Paste and send this prompt. It asks your tutor to read this exact profile before teaching.</p><textarea className="starter-prompt" aria-label="Your first connected lesson prompt" value={prompt} readOnly rows={5}/><div className="row-actions"><button type="button" className="secondary" onClick={()=>copy(prompt)}><Copy size={15}/>{copied?'Copy again':'Copy lesson prompt'}</button><a className="button secondary" href="https://chatgpt.com" target="_blank" rel="noreferrer">Open ChatGPT <ArrowUpRight size={15}/></a></div><p className="profile-reference">Profile: {profile.name} · <code>{profile.id}</code></p></div></div>
    <div className="connection-check"><button className="secondary" type="button" disabled={checking||busy||!connected} onClick={()=>checkConnection()}><RefreshCw size={15}/>{checking?'Checking…':'Check connection'}</button><span>Updates automatically while this step is open.</span></div>
    <details className="setup-help"><summary>Can’t find Kuwento, or the connection isn’t working?</summary><p>Check that both places use the same account, Kuwento is installed, and you selected it with @ in the chat. Ask ChatGPT to call <code>get_learning_summary</code> with the profile ID shown above. A normal chat reply or a pasted summary won’t verify a live connection.</p><p>Plugin availability depends on your account and workspace. If needed, follow the <a href="https://developers.openai.com/api/docs/guides/custom-mcp-server" target="_blank" rel="noreferrer">official custom MCP setup guide</a>: use this server URL and OAuth authentication.</p><label className="field"><span>Kuwento server URL</span><input readOnly value={typeof window==='undefined'?'':window.location.origin+'/mcp'}/></label><p>You can finish later and use the portable tutor summary in Connect & privacy. It’s a dated snapshot; new chats won’t automatically update this record.</p></details>
   </>}
   {step===4&&<>
    <div className="setup-ready"><CheckCircle2 size={31}/><div><h2>A personal starting point</h2><p>{profile.name} · Tagalog</p><blockquote>{preferences.goals?.[0]}</blockquote><small>{preferences.topics?.length?'Interests: '+preferences.topics.join(', '):'Your tutor will help you choose a topic.'}</small></div></div>
    <h2 className="setup-subhead">Your next ten minutes</h2><ol className="first-lesson"><li><b>Have a small, real conversation.</b><p>Use the starter prompt with @Kuwento in ChatGPT. Your tutor asks one question, waits, and adapts to what you actually do.</p></li><li><b>Let your tutor save the useful parts.</b><p>Selected observations and a checkpoint carry your next step into a supported connected chat. Review any requested tool approvals.</p></li><li><b>Come back and see what’s taking shape.</b><p>Your profile, knowledge index, and review priorities grow from evidence. A connection check adds no learner progress.</p></li></ol>
    <div className="row-actions"><button className="secondary" type="button" onClick={()=>copy(prompt)}><Copy size={15}/>Copy first lesson prompt</button><a className="button" href="https://chatgpt.com" target="_blank" rel="noreferrer">Start in ChatGPT <ArrowUpRight size={16}/></a></div>
    <details className="setup-help"><summary>View or copy your first lesson prompt</summary><textarea className="starter-prompt" aria-label="First lesson prompt" readOnly rows={6} value={prompt}/></details>
   </>}
   {error&&<p className="error" role="alert">{error}</p>}{message&&<p className="setup-message" role="status">{message}</p>}
   <div className="setup-actions"><button type="button" className="text-button" disabled={busy} onClick={()=>{setError('');setMessage('');setStep(step-1);}}><ChevronLeft size={16}/>Back</button><button disabled={busy||(step===3&&!verified)}>{busy?'Saving…':step===4?'Open my learning space':step===3?'Continue':'Save & continue'} <ArrowRight size={16}/></button></div>
   <small className="setup-save-note">{profile?'Completed steps are saved to your learner profile. You can revisit setup at any time.':'Your profile is created when you save this step. Fields marked * are required.'}</small>
  </form></div><aside className="setup-aside"><span className="aside-spark" aria-hidden="true">✳</span><h2>{step<3?'A little more you, in Tagalog.':'The conversation is the classroom.'}</h2><p>{step<3?'A family story. A meal shared. A question you can ask without rehearsing. Start with something that matters to you.':'ChatGPT teaches and listens. Kuwento keeps the selected learning context so the next conversation can meet you where you are.'}</p><div><Shield size={18}/><p>Your learning belongs to you.<br/>Permissions are yours to change.</p></div></aside></div>
 </section>;
}
