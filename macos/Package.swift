// swift-tools-version: 5.9
import PackageDescription
let package = Package(name:"Kuwento",platforms:[.macOS(.v13)],products:[.executable(name:"Kuwento",targets:["Kuwento"])],targets:[.executableTarget(name:"Kuwento")])
