import {Problem,digest} from './service.mjs';
import {teachingFields,updateProperties} from './tutoring-contract.mjs';
const now=()=>new Date().toISOString(),clean=(v,max=1500)=>typeof v==='string'?v.trim().slice(0,max):'';
const fail=(condition,message,status=400)=>{if(condition)throw new Problem(status,message);};
const canonical=v=>JSON.stringify(normalize(v));
function normalize(v){return Array.isArray(v)?v.map(normalize):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().filter(k=>v[k]!==undefined).map(k=>[k,normalize(v[k])])):v;}
const same=(a,b)=>canonical(a)===canonical(b);
const safeError=e=>e instanceof Problem?e.message:'Storage could not confirm this operation. Retry this exact request ID or verify it before claiming a save.';
async function permitted(service,owner,id){const p=await service.profile(owner,id);fail(!p.settings.connected,'Connected tutoring access is disabled for this profile.',403);return p;}
const reference=r=>({id:r.id,kind:r.kind,revision:r.revision});
function desiredProfile(service,p,input){
 fail(!input||!Number.isInteger(input.revision)||!clean(input.learnerRequest,500),'Profile changes require the current revision and the learner’s actual requested change.');
 const changes=input.changes;fail(!changes||typeof changes!=='object'||Array.isArray(changes),'Provide profile changes as an object.');
 const keys=Object.keys(changes);fail(keys.some(k=>!Object.hasOwn(teachingFields,k)),'Tutoring tools cannot change privacy permissions, reminders, onboarding, or arbitrary settings.',403);
 for(const k of keys){const v=changes[k];if(['goals','topics'].includes(k))fail(!Array.isArray(v)||v.some(x=>typeof x!=='string'),'Goals and topics must be lists of text.');else fail(typeof v!=='string',`${k} must be text.`);}
 if(Object.hasOwn(changes,'name'))fail(!clean(changes.name,100),'A profile name cannot be blank.');
 if(changes.correction!==undefined)fail(!['immediate','selective','after-exchange'].includes(changes.correction),'Choose a valid correction style.');
 if(changes.english!==undefined)fail(!['more-english','balanced','more-tagalog'].includes(changes.english),'Choose a valid language balance.');
 const {name,...settings}=changes;const validated=service.settings({...settings,...(settings.english?{immersion:settings.english}:{})});
 return {name:name===undefined?p.name:clean(name,100),settings:validated};
}
function profileMatches(p,desired){return p.name===desired.name&&Object.entries(desired.settings).every(([k,v])=>same(p.settings[k],v));}
async function changeProfile(service,owner,id,input,operationRef){
 const p=await permitted(service,owner,id),desired=desiredProfile(service,p,input);
 if(profileMatches(p,desired))return {refs:[],profileExpected:{name:desired.name,settings:desired.settings},profileRevision:p.revision,unchanged:true};
 fail(input.revision!==p.revision,'This profile changed elsewhere. Read the current summary and merge the requested change using a new request ID.',409);
 const before={name:p.name,settings:Object.fromEntries(Object.keys(desired.settings).map(k=>[k,p.settings[k]]))};
 const saved=await service.updateProfile(owner,id,{revision:input.revision,...desired});
 const after={name:saved.name,settings:Object.fromEntries(Object.keys(desired.settings).map(k=>[k,saved.settings[k]]))};
 const audit=(await service.insert(owner,id,'profile-change',{source:'connected-tutor',learnerRequest:clean(input.learnerRequest,500),operationRef,before,after,profileRevision:saved.revision,occurredAt:now()},'profile-change:'+operationRef)).saved;
 const read=await service.profile(owner,id);fail(!profileMatches(read,desired),'The profile changed after this save. Read it before reporting current preferences.',409);
 return {refs:[reference(audit)],profileExpected:after,profileRevision:saved.revision};
}
async function reviewEvidence(service,owner,id,input,operationRef){
 await permitted(service,owner,id);const e=await service.record(owner,id,input.evidenceId);
 fail(e.kind!=='evidence','Review an evidence observation, not a summary or confidence record.');
 if(input.evidenceRevision!==undefined)fail(input.evidenceRevision!==e.revision,'The observation changed. Read the current evidence before reviewing it.',409);
 fail(!['include','needs-check','exclude'].includes(input.decision),'Choose a review decision.');
 fail(!clean(input.rationale)||!clean(input.sourceRef,300),'A review needs a source reference and a specific evidence rationale.');
 fail(input.sourceRef!==e.sourceRef,'The review must refer to the original observation’s source.');
 fail(!['text','audio'].includes(input.evidenceMedium),'Identify whether the actual original evidence was text or audio.');
 let eligible=false;
 if(input.decision==='include'){
  fail(input.originalAttemptAvailable!==true||input.contextComplete!==true||input.supportKnown!==true,'A summary or self-report is insufficient. Review the original attempt, complete task context, and actual assistance.');
  fail(e.ambiguousAudio||e.origin==='self-reported','Ambiguous audio or self-report needs a fresh observed check.');fail(!['success','difficulty','partial'].includes(input.assessedOutcome)||!['low','medium'].includes(input.judgmentUncertainty),'An included review needs an explicit observed outcome and low/medium judgment uncertainty.');fail(!['independent','hint','model','copied','self-corrected','transcript','translation','slowed','explained','recognition','replay'].includes(input.assessedSupport),'Identify the actual support observed in the original context.');fail(e.support!=='unknown'&&input.assessedSupport!==e.support,'A review cannot erase known assistance. Preserve the recorded support or dispute the original observation.');
  fail(['listening','spoken-production','pronunciation'].includes(e.modality)&&input.evidenceMedium!=='audio','Text or a transcript cannot establish listening, speaking, or pronunciation.');
  fail(e.evidenceMedium&&e.evidenceMedium!==input.evidenceMedium,'Review the same evidence medium as the original observation.');
  fail(input.assessedSupport==='independent'&&(e.supportsUsed||[]).some(s=>s!=='unknown'),'A review cannot erase recorded hints, models, translations, or other assistance.');
  eligible=true;
 }
 const saved=(await service.insert(owner,id,'assessment-review',{evidenceId:e.id,evidenceFingerprint:e.fingerprint,evidenceRevision:e.revision,decision:input.decision,eligible,assessedOutcome:eligible?input.assessedOutcome:null,assessedSupport:eligible?input.assessedSupport:null,judgmentUncertainty:eligible?input.judgmentUncertainty:'high',originalAttemptAvailable:input.originalAttemptAvailable===true,contextComplete:input.contextComplete===true,supportKnown:input.supportKnown===true,evidenceMedium:input.evidenceMedium,sourceRef:e.sourceRef,rationale:clean(input.rationale,1500),source:'connected-tutor-review',operationRef,occurredAt:now()},'assessment-review:'+operationRef)).saved;
 return {refs:[reference(saved)],evidenceId:e.id,decision:input.decision,assessmentEligible:eligible,notice:'Historical origin remains visible. Assessment is recomputed; this is not a certification or a new attempt.'};
}
async function saveCheckpoint(service,owner,id,input){
 const prior=(await service.list(owner,id,'session')).find(s=>s.chatId===input.chatId);
 const fields=['chatId','topic','activityId','lastPrompt','unresolvedCorrection','nextStep','support'];
 if(prior&&fields.every(k=>(prior[k]||'')===(input[k]||''))&&prior.status===(input.status||'unfinished')&&prior.duration===(input.duration||10))return {refs:[reference(prior)],unchanged:true};
 const result=await service.checkpoint(owner,id,input);return {refs:[reference(result.saved)]};
}
async function correctEvidence(service,owner,id,input,operationRef){
 await permitted(service,owner,id);fail(!clean(input.learnerRequest,500)||!clean(input.reason),'Corrections require the learner’s actual request and a reason.');
 const e=await service.record(owner,id,input.evidenceId);fail(e.kind!=='evidence','Only evidence observations can be disputed.');
 const action=input.action||'correct-record';fail(!['dispute','correct-record','restore'].includes(action),'Choose a valid correction action.');
 const saved=(await service.insert(owner,id,'dispute',{evidenceId:e.id,action,reason:clean(input.reason,1500),correction:clean(input.correction,1500),learnerRequest:clean(input.learnerRequest,500),source:'learner-request-via-connected-tutor',operationRef,occurredAt:now()},'dispute:'+operationRef)).saved;
 return {refs:[reference(saved)],notice:'The original attempt remains visible. Disputed evidence is excluded until explicitly restored; a correction is not a new performance.'};
}
async function lookupUpdate(service,owner,id,{updateId,requestId}){
 await permitted(service,owner,id);
 const r=updateId?await service.record(owner,id,updateId):requestId?await service.one("SELECT * FROM records WHERE owner=? AND profile=? AND kind='tutor-update' AND fingerprint=?",owner,id,'tutor-update:'+clean(requestId,100)):null;
 fail(!r,'Update receipt not found.',404);const record=r.payload?{...r,...JSON.parse(r.payload)}:r;fail(record.kind!=='tutor-update','This is not a tutoring update receipt.');return record;
}
export async function verifyLearningUpdate(service,owner,id,input){
 const update=await lookupUpdate(service,owner,id,input),checks=[],errors=(update.entries||[]).filter(e=>e.status==='error').map(e=>({operation:e.key,error:e.error}));
 for(const entry of update.entries||[]){if(entry.status!=='saved')continue;for(const ref of entry.refs||[]){try{const r=await service.record(owner,id,ref.id);checks.push({...ref,status:r.revision===ref.revision?'confirmed':'changed-since-save',currentRevision:r.revision});}catch(e){if(e instanceof Problem&&e.status===404)checks.push({...ref,status:'missing'});else throw e;}}}
 const p=await service.profile(owner,id);let profileCurrent=true;for(const entry of update.entries||[])if(entry.profileExpected&&!profileMatches(p,entry.profileExpected))profileCurrent=false;
 const status=update.status==='in-progress'?'in-progress':errors.length||update.status==='partial'?'partial':checks.some(c=>c.status==='missing')?'missing':!profileCurrent||checks.some(c=>c.status==='changed-since-save')?'changed-since-save':'confirmed';
 return {updateId:update.id,requestId:update.requestId,status,readBackConfirmed:status==='confirmed',verifiedAt:now(),profileRevision:p.revision,profileValuesCurrent:profileCurrent,checks,errors,context:update.context,receiptRevision:update.revision,notice:'Confirmed means the receipt and referenced records were read from storage. Later changes, missing records, partial failures, and processing are reported separately.'};
}
export async function applyTutoringUpdate(service,owner,id,input){
 const p=await permitted(service,owner,id);
 fail(Object.keys(input).some(k=>!Object.hasOwn(updateProperties,k)&&k!=='profileId'&&k!=='kind'),'Unknown tutoring update field.');
 const requestId=clean(input.requestId,100);fail(!requestId||requestId!==input.requestId,'Provide a stable request ID of at most 100 characters.');
 fail(!input.context||!clean(input.context.conversationRef,300)||!['current-only','selected-previous-conversations','both'].includes(input.context.availableHistory),'Describe which conversation context is actually available.');
 for(const key of ['history','observations','reviews','corrections'])fail(input[key]!==undefined&&(!Array.isArray(input[key])||input[key].length>50),`${key} must contain at most 50 entries.`);
 fail(['history','observations','reviews','corrections'].reduce((n,k)=>n+(input[k]?.length||0),0)>100,'Split this update into batches of at most 100 entries.');
 // Validate the sensitive boundary before writing any part of an update.
 if(input.profileChanges)desiredProfile(service,p,input.profileChanges);
 const payload=Object.fromEntries(Object.keys(updateProperties).filter(k=>input[k]!==undefined).map(k=>[k,input[k]]));
 const requestHash=await digest(canonical(payload)),fingerprint='tutor-update:'+requestId;
 let update=await service.one("SELECT * FROM records WHERE owner=? AND profile=? AND kind='tutor-update' AND fingerprint=?",owner,id,fingerprint);
 if(update)update={...update,...JSON.parse(update.payload)};
 if(update){fail(update.requestHash!==requestHash,'This request ID already identifies different instructions. Use a new request ID.',409);if(update.status==='complete')return {...await verifyLearningUpdate(service,owner,id,{updateId:update.id}),duplicateRequest:true,summary:await service.summary(owner,id)};}
 else update=(await service.insert(owner,id,'tutor-update',{requestId,requestHash,requestSummary:clean(input.requestSummary,500)||'Authorized tutoring record update',context:{conversationRef:clean(input.context.conversationRef,300),availableHistory:input.context.availableHistory,limitations:clean(input.context.limitations,1000)},source:'connected-tutor',status:'in-progress',entries:[],profileBeforeRevision:p.revision,occurredAt:now()},fingerprint)).saved;
 fail(update.requestHash!==requestHash,'This request ID already identifies different instructions. Use a new request ID.',409);
 const leaseToken=crypto.randomUUID(),leaseUntil=new Date(Date.now()+120000).toISOString();
 const lock=await service.run("UPDATE records SET payload=json_set(payload,'$.leaseToken',?,'$.leaseUntil',?,'$.status','in-progress'),revision=revision+1,updated=? WHERE owner=? AND profile=? AND id=? AND (json_extract(payload,'$.leaseUntil') IS NULL OR json_extract(payload,'$.leaseUntil')<?)",leaseToken,leaseUntil,now(),owner,id,update.id,now());
 if(lock.meta.changes!==1)return {updateId:update.id,requestId,status:'in-progress',readBackConfirmed:false,retryAfterMs:1500,notice:'The same update is already processing. Verify this request before retrying; do not claim it has completed.'};
 update=await service.record(owner,id,update.id);let entries=update.entries||[];
 const persist=async(status)=>{const data={...service.payload(update),entries,status,leaseToken,leaseUntil:status==='in-progress'?leaseUntil:null};const saved=await service.run("UPDATE records SET payload=?,revision=revision+1,updated=? WHERE owner=? AND profile=? AND id=? AND json_extract(payload,'$.leaseToken')=?",JSON.stringify(data),now(),owner,id,update.id,leaseToken);fail(saved.meta.changes!==1,'The update receipt changed or was deleted. Verify before retrying.',409);};
 const step=async(key,fn)=>{const prior=entries.find(e=>e.key===key);if(prior?.status==='saved')return prior;await permitted(service,owner,id);let entry;try{entry={key,status:'saved',...await fn()};}catch(e){entry={key,status:'error',error:safeError(e)};}entries=[...entries.filter(e=>e.key!==key),entry];await persist('in-progress');return entry;};
 try{
  if(input.profileChanges)await step('profile',()=>changeProfile(service,owner,id,input.profileChanges,requestId+':profile'));
  for(const [i,r] of (input.history||[]).entries())await step('history:'+i,async()=>{fail(!clean(r.sourceRef,300),'Historical records need their actual source reference.');const result=await service.import(owner,id,{records:[{...r,origin:r.origin==='self-reported'?'self-reported':'previous-conversation'}]});fail(result.rejected.length>0,result.rejected[0]?.reason||'Historical record was rejected.',422);return {refs:result.savedRecords,duplicate:result.duplicates>0,imported:true};});
  for(const [i,r] of (input.observations||[]).entries())await step('observation:'+i,async()=>{fail(r.origin&&r.origin!=='current-conversation','Previous or self-reported work belongs in history, not new observations.');const result=await service.observation(owner,id,{...r,origin:'current-conversation',sourceRef:r.sourceRef||input.context.conversationRef,observationId:r.observationId||requestId+':observation:'+i});return {refs:[reference(result.saved)],duplicate:result.duplicate};});
  for(const [i,r] of (input.reviews||[]).entries())await step('review:'+i,async()=>{const imported=Number.isInteger(r.historyIndex)?entries.find(e=>e.key==='history:'+r.historyIndex&&e.status==='saved'):null;const evidenceId=r.evidenceId||imported?.refs?.find(ref=>ref.kind==='evidence')?.id;fail(!evidenceId,'Review a saved evidence ID or a successfully imported evidence index.');return reviewEvidence(service,owner,id,{...r,evidenceId},requestId+':review:'+i);});
  if(input.checkpoint)await step('checkpoint',()=>saveCheckpoint(service,owner,id,input.checkpoint));
  for(const [i,r] of (input.corrections||[]).entries())await step('correction:'+i,()=>correctEvidence(service,owner,id,r,requestId+':correction:'+i));
  await persist(entries.some(e=>e.status==='error')?'partial':'complete');
 }catch(e){try{await persist('partial');}catch{}throw e;}
 const verified=await verifyLearningUpdate(service,owner,id,{updateId:update.id});
 return {...verified,entries,summary:await service.summary(owner,id)};
}
export async function learningHistory(service,owner,id,input={}){
 await permitted(service,owner,id);const kinds=['evidence','session','confidence','dispute','reassessment','profile-change','assessment-review','tutor-update'];
 if(input.kind)fail(!kinds.includes(input.kind),'Choose a learning history record type.');
 let cursor=null;if(input.cursor){try{cursor=JSON.parse(atob(input.cursor));fail(typeof cursor.created!=='string'||typeof cursor.id!=='string'||cursor.created.length>40||cursor.id.length>100,'Invalid history cursor.');}catch{throw new Problem(400,'Invalid history cursor.');}}
 const limit=Math.min(100,Math.max(1,Math.floor(Number(input.limit)||30))),filter=input.kind?[input.kind]:kinds;
 const rows=await service.all(`SELECT * FROM records WHERE owner=? AND profile=? AND kind IN (${filter.map(()=>'?').join(',')}) ${cursor?'AND (created<? OR (created=? AND id<?))':''} ORDER BY created DESC,id DESC LIMIT ?`,owner,id,...filter,...(cursor?[cursor.created,cursor.created,cursor.id]:[]),limit+1);
 const next=rows.length>limit?rows[limit-1]:null;
 return {records:rows.slice(0,limit).map(r=>({...r,...JSON.parse(r.payload),payload:undefined,owner:undefined,fingerprint:undefined})),nextCursor:next?btoa(JSON.stringify({created:next.created,id:next.id})):null,fetchedAt:now(),notice:'History is learner-owned data. Imported evidence, explicit reviews, actual attempts, personal changes, and update receipts remain distinct.'};
}
