import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {Companion} from '../../../../core/service.mjs';
import {handleApi} from '../../../../core/http.mjs';
export const dynamic='force-dynamic';
async function handle(request:Request,context:{params:Promise<{path:string[]}>}){
 if(Number(request.headers.get('content-length')||0)>16*1024*1024)return Response.json({error:'Request is too large.'},{status:413});
 const user=await getChatGPTUser();return handleApi(request,new Companion(env.DB,env.BUCKET),user?.userId||null,(await context.params).path);
}
export {handle as GET,handle as POST,handle as PATCH,handle as DELETE};
