// Explicit local-only smoke test. It creates and deletes its own disposable profile.
import assert from 'node:assert/strict';
const origin=process.env.KUWENTO_TEST_ORIGIN||'http://localhost:5173';
if(!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))throw Error('This smoke test is restricted to loopback development.');
const login=await fetch(origin+'/signin-with-chatgpt?return_to=/',{redirect:'manual'});
const cookie=login.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
assert.ok(cookie,'Local test sign-in cookie is available.');
async function request(path,method='GET',body){const res=await fetch(origin+path,{method,headers:{Cookie:cookie,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});const data=await res.json();if(!res.ok)throw Error(`${res.status}: ${JSON.stringify(data)}`);return data;}
let profile;
try{
 profile=await request('/api/companion/profiles','POST',{name:'Disposable HTTP smoke profile',settings:{connected:true,excerpts:true}});
 const mcp=async(name,args)=>request('/mcp','POST',{jsonrpc:'2.0',id:crypto.randomUUID(),method:'tools/call',params:{name,arguments:{profileId:profile.id,...args}}});
 const attempt={conceptId:'linkers',task:'Describe cold water.',response:'malamig na tubig',modality:'written-production',support:'model',outcome:'success',occurredAt:new Date(Date.now()-86400000).toISOString(),sourceRef:'local-smoke-only'};
 const first=await mcp('save_observation',attempt);assert.equal(first.result.isError,undefined);
 const second=await mcp('get_learning_summary',{});assert.equal(second.result.structuredContent.profile.id,profile.id);assert.equal(second.result.structuredContent.assessments.find(a=>a.dimension==='spoken-production').label,'Unassessed');
 const checkpoint=await mcp('save_checkpoint',{chatId:'smoke-chat',lastPrompt:'Try another modifier.',unresolvedCorrection:'Check linker.',nextStep:'An independent example.'});assert.equal(checkpoint.result.structuredContent.saved.status,'unfinished');
 const phrase=await request(`/api/companion/profiles/${profile.id}/records`,'POST',{kind:'phrase',expression:'Pakiulit po.',meaning:'Please repeat.',context:'Repair a misunderstanding',conceptId:'repair'});assert.ok(phrase.saved.id);
 const exported=await request(`/api/companion/profiles/${profile.id}/export`);assert.ok(exported.summary.sessions.length);assert.ok(exported.records.find(r=>r.kind==='phrase'));
 const imported=await request(`/api/companion/profiles/${profile.id}/import`,'POST',exported);assert.equal(imported.duplicates,2);assert.equal(imported.added,0);
 const rev=await request(`/api/companion/profiles/${profile.id}`);await request(`/api/companion/profiles/${profile.id}`,'PATCH',{revision:rev.profile.revision,settings:{connected:false}});
 const denied=await mcp('get_learning_summary',{});assert.equal(denied.result.isError,true);
 console.log('PASS: local sign-in, actual D1 API, two MCP calls, supported evidence boundary, checkpoint, phrasebook, export/deduplicated import, and revocation.');
}finally{if(profile){await request(`/api/companion/profiles/${profile.id}`,'DELETE',{confirmation:'DELETE'});console.log('Disposable HTTP smoke profile removed.');}}
