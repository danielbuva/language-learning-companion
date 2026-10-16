import {Problem} from './service.mjs';
import {curriculum,activities,research,resources,recordedClips} from './catalog.mjs';
export async function handleApi(request,service,owner,path){
 const parts=path.filter(Boolean),method=request.method,url=new URL(request.url);
 const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 try{
  if(!['GET','HEAD'].includes(method)){const origin=request.headers.get('origin');if(origin&&origin!==url.origin)throw new Problem(403,'Cross-origin writes are not permitted.');}
  if(parts[0]==='catalog')return json({curriculum,activities,research,resources,recordedClips});
  if(parts[0]==='review'){const token=request.headers.get('X-Review-Token');if(!token)throw new Problem(401,'A review access link is required.');if(parts[1]==='audio'&&parts[2]&&method==='GET'){const {file,record}=await service.sharedAudio(token,parts[2]);return new Response(file.body,{headers:{'Content-Type':record.mediaType,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}return method==='GET'?json(await service.sharedView(token)):method==='POST'?json(await service.sharedFeedback(token,await request.json())):json({error:'Method not allowed'},405);}
  if(!owner)throw new Problem(401,'Sign in with ChatGPT to access your learning record.');
  if(parts[0]!=='profiles')throw new Problem(404,'Endpoint not found.');
  if(parts.length===1){if(method==='GET')return json({profiles:await service.profiles(owner)});if(method==='POST')return json(await service.createProfile(owner,await request.json()),201);}
  const id=parts[1];await service.profile(owner,id);const action=parts[2];
  if(!action){if(method==='GET')return json(await service.snapshot(owner,id));if(method==='PATCH')return json(await service.updateProfile(owner,id,await request.json()));if(method==='DELETE')return json(await service.deleteProfile(owner,id,(await request.json()).confirmation));}
  if(action==='records'){if(method==='GET')return json({records:await service.list(owner,id,url.searchParams.get('kind')||undefined)});if(method==='POST'){const b=await request.json();return json(await service.saveRecord(owner,id,b.kind,b),201);}if(method==='DELETE'&&parts[3])return json(await service.deleteRecord(owner,id,parts[3]));}
  if(action==='observations'&&method==='POST')return json(await service.observation(owner,id,await request.json(),'browser'),201);
  if(action==='checkpoint'&&method==='POST')return json(await service.checkpoint(owner,id,await request.json(),false));
  if(action==='dispute'&&method==='POST')return json(await service.dispute(owner,id,await request.json()),201);
  if(action==='report'&&method==='GET')return json(await service.report(owner,id,url.searchParams.get('from'),url.searchParams.get('to')));
  if(action==='summary'&&method==='GET')return json(await service.portable(owner,id));
  if(action==='export'&&method==='GET')return json(await service.export(owner,id));
  if(action==='import'&&method==='POST')return json(await service.import(owner,id,await request.json()));
  if(action==='share'){if(method==='POST')return json(await service.share(owner,id,await request.json()),201);if(method==='GET')return json({shares:(await service.list(owner,id,'share')).map(({fingerprint,owner,...r})=>r)});}
  if(action==='audio'){if(method==='POST')return json(await service.upload(owner,id,await request.arrayBuffer(),request.headers.get('content-type')||'',url.searchParams.get('title')),201);if(method==='GET'&&parts[3]){const {file,record}=await service.audio(owner,id,parts[3]);return new Response(file.body,{headers:{'Content-Type':record.mediaType,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':'inline'}});}}
  throw new Problem(404,'Endpoint or method not found.');
 }catch(e){return json({error:e instanceof Problem?e.message:'The connection is unavailable. No save is confirmed. Refresh and try again.'},e instanceof Problem?e.status:503);}
}
