export const settingsSections=[
 {id:'profile',title:'Profile & goals',description:'Your name, interests, and reasons for learning.'},
 {id:'learning',title:'Learning preferences',description:'Language support, corrections, and accessibility.'},
 {id:'chatgpt',title:'ChatGPT connection',description:'Connect your tutor and check profile access.'},
 {id:'privacy',title:'Privacy & sharing',description:'Choose what to retain and who can review it.'},
 {id:'reminders',title:'Reminders & devices',description:'A schedule that fits your day, on your devices.'},
 {id:'data',title:'Your data',description:'Export, import, and manage your learner profiles.'},
];
export function resolveNavigation(hash,pages){
 const params=new URLSearchParams(hash.replace(/^#/,''));let page=params.get('view');
 const legacy=page==='Connect & privacy';if(legacy)page='Settings';
 if(!page||!pages.includes(page))return null;
 const section=legacy?'chatgpt':settingsSections.some(s=>s.id===params.get('section'))?(params.get('section')||'profile'):'profile';
 return {page,section};
}
export function navigationHash(page,section='profile'){
 return '#view='+encodeURIComponent(page)+(page==='Settings'?'&section='+encodeURIComponent(settingsSections.some(s=>s.id===section)?section:'profile'):'');
}
