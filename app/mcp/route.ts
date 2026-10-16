import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../chatgpt-auth';
import {Companion} from '../../core/service.mjs';
import {handleMcp} from '../../core/mcp.mjs';
export const dynamic='force-dynamic';
async function handle(request:Request){if(Number(request.headers.get('content-length')||0)>256000)return new Response('Request too large',{status:413});const user=await getChatGPTUser();return handleMcp(request,new Companion(env.DB,env.BUCKET),user?.userId||null);}
export {handle as GET,handle as POST,handle as DELETE};
