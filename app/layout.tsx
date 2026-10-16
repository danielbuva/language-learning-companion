import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Kuwento · Your language, lived',description:'Your evidence-first Tagalog learning companion. Continue in ChatGPT; keep your learning in view.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
