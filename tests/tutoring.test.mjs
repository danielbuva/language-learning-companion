import test from 'node:test';
import assert from 'node:assert/strict';
import {Companion} from '../core/service.mjs';
import {dispatchTool,handleMcp,tools} from '../core/mcp.mjs';
import {handleApi} from '../core/http.mjs';
import {database,bucket} from './adapter.mjs';
const at=d=>new Date(Date.now()-d*86400000).toISOString();
async function setup(settings={}){const db=database(),service=new Companion(db,bucket()),owner='tutor-learner',p=await service.createProfile(owner,{name:'Learner',settings:{connected:true,excerpts:false,...settings}});return {db,service,owner,p};}
const context={conversationRef:'available-chat-one',availableHistory:'both',limitations:'Only supplied original turns and this current conversation are available.'};
const attempt=(extra={})=>({conceptId:'linkers',task:'Describe cold water',response:'malamig na tubig',occurredAt:at(3),sourceRef:'available-prior-chat',modality:'written-production',support:'independent',supportsUsed:[],outcome:'success',judgmentUncertainty:'medium',evidenceMedium:'text',...extra});
const reviewed=(extra={})=>({historyIndex:0,decision:'include',sourceRef:'available-prior-chat',originalAttemptAvailable:true,contextComplete:true,supportKnown:true,evidenceMedium:'text',assessedOutcome:'success',assessedSupport:'independent',judgmentUncertainty:'medium',rationale:'The original task and response are available, with no preceding model or hints.',...extra});
const call=(s,owner,p,name,args)=>dispatchTool(s,owner,name,{profileId:p.id,...args});

test('tutoring · exact acceptance workflow completes through the existing cached import tool, with no companion visits',async()=>{
 const {db,service,owner,p}=await setup();const first=await call(service,owner,p,'get_learning_summary',{});assert.equal(first.integration.compatibility.write.tool,'import_records');
 const update={kind:'tutoring_update',requestId:'all-learned-so-far',requestSummary:'Update my Kuwento profile using everything we have learned so far',context,profileChanges:{revision:first.profile.revision,learnerRequest:'Focus on family conversations and correct me after an exchange.',changes:{goals:['Join family conversations'],correction:'after-exchange',english:'more-tagalog'}},history:[{kind:'evidence',...attempt()}],observations:[attempt({task:'Describe hot food',response:'mainit na pagkain',occurredAt:at(0),sourceRef:'available-chat-one'})],reviews:[reviewed()],checkpoint:{chatId:'available-chat-one',lastPrompt:'Tell me about a meal',unresolvedCorrection:'Choose na or ng',nextStep:'Try a different modifier independently',status:'unfinished'}};
 const result=await call(service,owner,p,'import_records',{records:[update]});assert.equal(result.status,'confirmed');assert.equal(result.readBackConfirmed,true);assert.equal(result.summary.profile.settings.goals[0],'Join family conversations');assert.equal(result.summary.profile.settings.immersion,'more-tagalog');
 const s=await service.snapshot(owner,p.id),history=s.records.find(r=>r.kind==='evidence'&&r.source==='unverified-import');assert.equal(history.assessmentSource,'reviewed-historical-evidence');assert.equal(history.response,'');assert.equal(s.records.filter(r=>r.kind==='evidence').length,2);assert.equal(s.knowledge.find(k=>k.id==='linkers').assessment.label,'Independent in familiar situations');assert.equal(s.assessments.find(a=>a.dimension==='spoken-production').label,'Unassessed');
 const second=new Companion(db);const summary=await call(second,owner,p,'get_learning_summary',{});assert.equal(summary.sessions[0].lastPrompt,'Tell me about a meal');assert.equal(summary.sessions[0].unresolvedCorrection,'Choose na or ng');
 const verified=await call(second,owner,p,'import_records',{records:[{kind:'tutoring_verification',requestId:update.requestId}]});assert.equal(verified.readBackConfirmed,true);
 const again=await call(service,owner,p,'import_records',{records:[update]});assert.equal(again.duplicateRequest,true);assert.equal((await service.list(owner,p.id,'evidence')).length,2);assert.equal((await service.profile(owner,p.id)).revision,2);
});

test('tutoring · ordinary imports never activate settings, reviews, receipts, or assessments',async()=>{
 const {service,owner,p}=await setup();const result=await service.import(owner,p.id,{records:[{kind:'evidence',...attempt(),assessmentEligible:true},{kind:'assessment-review',...reviewed()},{kind:'profile-change',changes:{connected:true}},{kind:'tutoring_update',requestId:'forged',context}]});assert.equal(result.added,1);assert.equal(result.rejected.length,3);assert.equal((await service.snapshot(owner,p.id)).knowledge.find(k=>k.id==='linkers').assessment.label,'Unassessed');
 const res=await handleApi(new Request('https://test/api/companion/profiles/'+p.id+'/import',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({records:[{kind:'tutoring_update',requestId:'browser-envelope',context}]})}),service,owner,['profiles',p.id,'import']);assert.equal((await res.json()).added,0);
});

test('tutoring · available but undated history stays undated and cannot invent delayed retention',async()=>{
 const {service,owner,p}=await setup();const result=await call(service,owner,p,'apply_tutoring_update',{requestId:'undated',context,history:[{kind:'evidence',...attempt({occurredAt:null,datePrecision:'unknown',support:'unknown',outcome:'unassessed',judgmentUncertainty:'high',delayed:true})}],reviews:[reviewed()]});assert.equal(result.status,'confirmed');const s=await service.snapshot(owner,p.id),e=s.records.find(r=>r.kind==='evidence');assert.equal(e.occurredAt,null);assert.equal(e.datePrecision,'unknown');assert.equal(e.source,'unverified-import');assert.equal(e.recordedSupport,'unknown');assert.equal(e.support,'independent');assert.deepEqual(e.supportsUsed,[]);const a=s.knowledge.find(k=>k.id==='linkers').assessment;assert.equal(a.delayedIds.length,0);assert.equal(a.uncertainty,'high');assert.match(a.notice,/no known date/);assert.equal((await service.report(owner,p.id)).undatedHistory,1);
});

test('tutoring · explicit historical reviews cannot erase a model or infer audio from text',async()=>{
 const {service,owner,p}=await setup();let r=await call(service,owner,p,'apply_tutoring_update',{requestId:'model',context,history:[{kind:'evidence',...attempt({support:'model',supportsUsed:['model']})}],reviews:[reviewed()]});assert.equal(r.status,'partial');assert.match(r.errors[0].error,/erase known assistance/);assert.equal(r.readBackConfirmed,false);assert.equal((await service.snapshot(owner,p.id)).assessments.find(a=>a.dimension==='written-production').label,'Unassessed');
 r=await call(service,owner,p,'apply_tutoring_update',{requestId:'audio-from-text',context,history:[{kind:'evidence',...attempt({modality:'spoken-production',evidenceMedium:undefined})}],reviews:[reviewed()]});assert.equal(r.status,'partial');assert.match(r.errors[0].error,/Text or a transcript/);assert.equal((await service.snapshot(owner,p.id)).assessments.find(a=>a.dimension==='spoken-production').label,'Unassessed');
});

test('tutoring · ambiguous audio and self-reported success cannot be reviewed into observed ability',async()=>{
 const {service,owner,p}=await setup();for(const [key,extra,review] of [['ambiguous',{ambiguousAudio:true,modality:'listening',evidenceMedium:'audio'},{evidenceMedium:'audio'}],['self-report',{origin:'self-reported'},{}]]){const r=await call(service,owner,p,'apply_tutoring_update',{requestId:key,context,history:[{kind:'evidence',...attempt(extra)}],reviews:[reviewed(review)]});assert.equal(r.status,'partial');assert.match(r.errors[0].error,/fresh observed check/);}
 assert.ok((await service.snapshot(owner,p.id)).assessments.every(a=>a.label==='Unassessed'));
});

test('tutoring · profile changes are requested, revision-safe, audited, and cannot broaden permissions',async()=>{
 const {service,owner,p}=await setup();await assert.rejects(()=>call(service,owner,p,'update_learner_profile',{requestId:'privacy-escalation',conversationRef:'chat',revision:p.revision,learnerRequest:'Change goals',changes:{goals:['Travel'],excerpts:true,connected:true}}),/cannot change privacy/);assert.equal((await service.list(owner,p.id,'tutor-update')).length,0);
 await assert.rejects(()=>call(service,owner,p,'update_learner_profile',{requestId:'inferred',conversationRef:'chat',revision:p.revision,learnerRequest:'',changes:{goals:['Travel']}}),/actual requested/);
 const r=await call(service,owner,p,'update_learner_profile',{requestId:'preferences',conversationRef:'chat',revision:p.revision,learnerRequest:'Please use more English and give me time to think.',changes:{english:'more-english',accessibility:'More thinking time'}});assert.equal(r.readBackConfirmed,true);const current=await service.profile(owner,p.id);assert.equal(current.settings.excerpts,false);assert.equal(current.settings.recordings,false);assert.equal(current.settings.connected,true);const audit=(await service.list(owner,p.id,'profile-change'))[0];assert.equal(audit.before.settings.english,'balanced');assert.equal(audit.after.settings.english,'more-english');
 const stale=await call(service,owner,p,'update_learner_profile',{requestId:'stale-profile',conversationRef:'other-chat',revision:p.revision,learnerRequest:'Use more Tagalog.',changes:{english:'more-tagalog'}});assert.equal(stale.status,'partial');assert.equal(stale.readBackConfirmed,false);assert.match(stale.errors[0].error,/changed elsewhere/);assert.equal((await service.profile(owner,p.id)).settings.english,'more-english');
});

test('tutoring · durable verification detects later changes, deletion, and partial saves',async()=>{
 const {service,owner,p}=await setup();const r=await call(service,owner,p,'apply_tutoring_update',{requestId:'partial-save',context,observations:[attempt(),attempt({task:'Invalid',modality:'invalid'})]});assert.equal(r.status,'partial');assert.equal(r.entries.filter(e=>e.status==='saved').length,1);assert.equal((await call(service,owner,p,'verify_learning_update',{updateId:r.updateId})).readBackConfirmed,false);
 const good=await call(service,owner,p,'apply_tutoring_update',{requestId:'good-save',context,observations:[attempt({observationId:'distinct-real-attempt'})]});assert.equal(good.status,'confirmed');const evidence=good.checks.find(x=>x.kind==='evidence');await service.deleteRecord(owner,p.id,evidence.id);const missing=await call(service,owner,p,'verify_learning_update',{updateId:good.updateId});assert.equal(missing.status,'missing');assert.equal(missing.readBackConfirmed,false);
});

test('tutoring · request and observation IDs cannot be reused to change original evidence',async()=>{
 const {service,owner,p}=await setup();const input={requestId:'retry',context,observations:[attempt({observationId:'turn-4'})]};await call(service,owner,p,'apply_tutoring_update',input);await assert.rejects(()=>call(service,owner,p,'apply_tutoring_update',{...input,observations:[attempt({observationId:'turn-4',response:'Different'})]}),/different instructions/);
 const conflict=await call(service,owner,p,'apply_tutoring_update',{requestId:'different-request',context,observations:[attempt({observationId:'turn-4',response:'Different'})]});assert.equal(conflict.status,'partial');assert.match(conflict.errors[0].error,/different evidence/);assert.equal((await service.list(owner,p.id,'evidence')).length,1);
});

test('tutoring · simultaneous retries share a lease and do not duplicate learning progress',async()=>{
 const {service,owner,p}=await setup();const input={requestId:'concurrent-retry',context,observations:[attempt()]};const results=await Promise.all([call(service,owner,p,'apply_tutoring_update',input),call(service,owner,p,'apply_tutoring_update',input)]);assert.ok(results.some(r=>r.status==='confirmed'));assert.ok(results.every(r=>['confirmed','in-progress'].includes(r.status)));assert.equal((await service.list(owner,p.id,'evidence')).length,1);assert.equal((await service.list(owner,p.id,'tutor-update')).length,1);
});

test('tutoring · revoked or unrelated accounts cannot manage or verify another learner',async()=>{
 const {service,owner,p}=await setup();await assert.rejects(()=>call(service,'unrelated',p,'apply_tutoring_update',{requestId:'other',context}),/not found/);await service.updateProfile(owner,p.id,{revision:p.revision,settings:{connected:false}});for(const name of ['apply_tutoring_update','get_learning_history','verify_learning_update','update_learner_profile','review_learning_evidence'])await assert.rejects(()=>call(service,owner,p,name,{requestId:'revoked',context}),/disabled/);assert.equal((await service.list(owner,p.id,'tutor-update')).length,0);
});

test('tutoring · learner corrections preserve the original and take precedence over reviews',async()=>{
 const {service,owner,p}=await setup();const r=await call(service,owner,p,'apply_tutoring_update',{requestId:'original',context,history:[{kind:'evidence',...attempt()}],reviews:[reviewed()]});const id=r.checks.find(c=>c.kind==='evidence').id;assert.equal((await service.snapshot(owner,p.id)).knowledge.find(k=>k.id==='linkers').assessment.independentCount,1);
 const correction=await call(service,owner,p,'apply_tutoring_update',{requestId:'correct-support',context,corrections:[{evidenceId:id,learnerRequest:'I had seen a model before that answer.',reason:'Assistance was missing',correction:'This was model-supported, not independent.'}]});assert.equal(correction.status,'confirmed');assert.equal((await service.snapshot(owner,p.id)).knowledge.find(k=>k.id==='linkers').assessment.independentCount,0);assert.equal((await service.record(owner,p.id,id)).support,'independent');assert.equal((await service.list(owner,p.id,'dispute')).length,1);
});

test('tutoring · withdrawing excerpts does not erase a historical review or retain prohibited text in receipts',async()=>{
 const {service,owner,p}=await setup({excerpts:true});const r=await call(service,owner,p,'apply_tutoring_update',{requestId:'review-before-withdrawal',context,history:[{kind:'evidence',...attempt()}],reviews:[reviewed()]});await service.updateProfile(owner,p.id,{revision:p.revision,settings:{excerpts:false}});const s=await service.snapshot(owner,p.id);assert.equal(s.records.find(r=>r.kind==='evidence').response,'');assert.equal(s.knowledge.find(k=>k.id==='linkers').assessment.independentCount,1);const receipt=await service.record(owner,p.id,r.updateId);assert.ok(!JSON.stringify(receipt).includes('malamig na tubig'));assert.equal((await call(service,owner,p,'verify_learning_update',{updateId:r.updateId})).status,'changed-since-save');
});

test('tutoring · history pagination is scoped and older unfinished checkpoints remain resumable',async()=>{
 const {service,owner,p}=await setup();await service.checkpoint(owner,p.id,{chatId:'unfinished-old',lastPrompt:'Original unfinished question',nextStep:'Wait for the learner',status:'unfinished'});for(let i=0;i<12;i++)await service.checkpoint(owner,p.id,{chatId:'completed-'+i,lastPrompt:'Completed task',nextStep:'Done',status:'complete'});const summary=await service.summary(owner,p.id);assert.equal(summary.sessions[0].chatId,'unfinished-old');const first=await call(service,owner,p,'get_learning_history',{kind:'session',limit:5});const second=await call(service,owner,p,'get_learning_history',{kind:'session',limit:5,cursor:first.nextCursor});assert.equal(first.records.length,5);assert.ok(!first.records.some(r=>second.records.some(s=>s.id===r.id)));await assert.rejects(()=>call(service,owner,p,'get_learning_history',{cursor:'bad cursor'}),/Invalid history cursor/);
});

test('tutoring · discovery is typed, correctly marks writes, and JSON-RPC errors never imply save confirmation',async()=>{
 const {service,owner,p}=await setup();assert.equal(tools.find(t=>t.name==='apply_tutoring_update').annotations.readOnlyHint,false);assert.equal(tools.find(t=>t.name==='verify_learning_update').annotations.readOnlyHint,true);assert.ok(tools.find(t=>t.name==='apply_tutoring_update').inputSchema.properties.history.items.properties.support);
 const response=await handleMcp(new Request('https://test/mcp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'apply_tutoring_update',arguments:{profileId:p.id,requestId:'invalid-context'}}})}),service,owner);const rpc=await response.json();assert.equal(rpc.result.isError,true);assert.equal(rpc.result.structuredContent,undefined);
});


test('tutoring · new concepts enter the knowledge index without invented progress, and undated sources remain distinct',async()=>{
 const {service,owner,p}=await setup();const imported=await call(service,owner,p,'apply_tutoring_update',{requestId:'new-concepts',context,history:[{kind:'evidence',...attempt({conceptId:'climbing-plans',conceptTitle:'Discuss climbing plans',topic:'climbing',occurredAt:null,datePrecision:'unknown',sourceRef:'available-prior-chat-a'})},{kind:'evidence',...attempt({conceptId:'climbing-plans',conceptTitle:'Discuss climbing plans',topic:'climbing',occurredAt:null,datePrecision:'unknown',sourceRef:'available-prior-chat-b'})}]});assert.equal(imported.status,'confirmed');const s=await service.snapshot(owner,p.id);assert.equal(s.records.filter(r=>r.kind==='evidence').length,2);const k=s.knowledge.find(k=>k.id==='climbing-plans');assert.equal(k.title,'Discuss climbing plans');assert.equal(k.assessment.label,'Unassessed');assert.equal(k.evidenceIds.length,2);
});


test('tutoring · a partial storage failure resumes the same request without repeating confirmed steps',async()=>{
 const {service,owner,p}=await setup();const original=service.observation.bind(service);let fails=true,firstCalls=0;service.observation=async(owner,id,input,origin)=>{if(input.task==='First actual attempt')firstCalls++;if(input.task==='Second actual attempt'&&fails)throw Error('Transient storage outage');return original(owner,id,input,origin);};
 const input={requestId:'resume-partial',context,observations:[attempt({task:'First actual attempt'}),attempt({task:'Second actual attempt'})]};const partial=await call(service,owner,p,'apply_tutoring_update',input);assert.equal(partial.status,'partial');assert.equal((await service.list(owner,p.id,'evidence')).length,1);fails=false;const resumed=await call(service,owner,p,'apply_tutoring_update',input);assert.equal(resumed.status,'confirmed');assert.equal(resumed.readBackConfirmed,true);assert.equal(firstCalls,1);assert.equal((await service.list(owner,p.id,'evidence')).length,2);assert.equal((await service.list(owner,p.id,'tutor-update')).length,1);
});


test('tutoring · a later review decision wins even when timestamps tie',async()=>{
 const {service,owner,p}=await setup();const saved=(await service.observation(owner,p.id,attempt())).saved;
 await service.insert(owner,p.id,'assessment-review',{evidenceId:saved.id,evidenceFingerprint:saved.fingerprint,decision:'include',eligible:true,assessedOutcome:'success',assessedSupport:'independent',judgmentUncertainty:'medium',rationale:'Earlier review',sourceRef:saved.sourceRef});
 await service.insert(owner,p.id,'assessment-review',{evidenceId:saved.id,evidenceFingerprint:saved.fingerprint,decision:'exclude',eligible:false,rationale:'Later review withdraws inclusion',sourceRef:saved.sourceRef});
 const reviews=await service.list(owner,p.id,'assessment-review');await service.run("UPDATE records SET id=?,created=? WHERE id=?",'zzzz-earlier-review','2026-01-01T00:00:00.000Z',reviews[1].id);await service.run("UPDATE records SET id=?,created=? WHERE id=?",'aaaa-later-review','2026-01-01T00:00:00.000Z',reviews[0].id);
 const s=await service.snapshot(owner,p.id);assert.equal(s.knowledge.find(k=>k.id==='linkers').assessment.independentCount,0);assert.equal(s.records.find(r=>r.id===saved.id).assessmentReview.decision,'exclude');
});
