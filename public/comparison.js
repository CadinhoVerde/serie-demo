// Calendar weeks in the device's local timezone; do not substitute older sessions.
function previousWeekReference(history,day,name,ordinal,unit,now=Date.now(),exerciseId=null){
  const end=new Date(now);end.setHours(0,0,0,0);end.setDate(end.getDate()-((end.getDay()+6)%7));
  const start=new Date(end);start.setDate(start.getDate()-7);
  const sessions=history.filter(s=>(exerciseId||s.day===day)&&Number(s.started||s.date)>=start.getTime()&&Number(s.started||s.date)<end.getTime())
    .sort((a,b)=>Number(b.started||b.date)-Number(a.started||a.date));
  for(const session of sessions){
    const sets=session.logs.filter(l=>l.unit===unit&&(exerciseId?(l.exerciseId?l.exerciseId===exerciseId:exerciseId.startsWith('original-')&&l.name===name):l.name===name));
    if(sets.length)return {start:start.getTime(),end:end.getTime(),date:Number(session.started||session.date),week:session.week,sets,reference:sets[ordinal]||null,ordinal};
  }
  return {start:start.getTime(),end:end.getTime(),date:null,sets:[],reference:null,ordinal};
}
function referenceForCurrent(){return previousWeekReference(state.history,state.day,exercise(),records().length,timed()?'s':'rep',state.started||Date.now(),configFor().id)}
function weeklyReferenceMarkup(){
  const ref=referenceForCurrent(),number=n=>Number(n).toLocaleString('pt-BR');
  if(!ref.sets.length)return `<div class="week-reference">Semana anterior: sem registro deste exercício.</div>`;
  const value=l=>l.unit==='s'?`${number(l.reps)} s`:`${number(l.weight)} kg × ${number(l.reps)} rep`;
  const current=ref.reference?`Série ${ref.ordinal+1}: <strong>${value(ref.reference)}</strong>`:`Sem registro da série ${ref.ordinal+1}`;
  return `<div class="week-reference"><span>Semana ${ref.week} · ${current}</span><span id="week-difference"></span><details><summary>Ver séries anteriores</summary><div>${ref.sets.map((l,i)=>`<span>S${i+1} · ${value(l)}</span>`).join('')}</div></details></div>`;
}
function updateWeeklyDifference(){
  const node=document.querySelector('#week-difference');if(!node)return;
  const ref=referenceForCurrent().reference;if(!ref){node.textContent='';return}
  const weight=document.querySelector('[name="weight"]'),reps=document.querySelector('[name="reps"]');
  const delta=(n,unit)=>`${n>0?'+':''}${Number(n.toFixed(2)).toLocaleString('pt-BR')} ${unit}`;
  const parts=[];
  if(weight&&weight.value!==''&&Number.isFinite(Number(weight.value)))parts.push(delta(Number(weight.value)-ref.weight,'kg'));
  if(reps&&reps.value!==''&&Number.isFinite(Number(reps.value)))parts.push(delta(Number(reps.value)-ref.reps,ref.unit==='s'?'s':'rep'));
  node.textContent=parts.length?`Agora: ${parts.join(' · ')} em relação à série anterior`:'';
}
