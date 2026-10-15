/* Only fictional examples. Never reads the personal app's storage. */
(()=>{
const prefix='labsites-serie-demo-';
const keys=['session-v1','boxing-v1','comfort-v1','workouts-v1','draft-v1','seed-v1'].map(k=>prefix+k);
function seed(){
  if(localStorage.getItem(prefix+'seed-v1'))return;
  const monday=new Date();monday.setHours(12,0,0,0);monday.setDate(monday.getDate()-((monday.getDay()+6)%7)-7);
  const exercises=[['Supino com halteres',14],['Remada na máquina',30],['Elevação lateral',6],['Rosca com halteres',8]];
  const history=[1,0].map((offset)=>{const date=+monday-offset*7*86400000;return {day:'A',week:1,date,started:date,cycleName:'Ciclo demonstrativo · dados fictícios',planVersion:1,logs:exercises.flatMap(([name,weight],index)=>Array.from({length:3},(_,set)=>({name,index,weight:weight-offset*2,reps:12-set,unit:'rep',exerciseId:`original-${name}`,note:set===0?'Registro fictício de demonstração':'',date}))),cardio:null}});
  localStorage.setItem(prefix+'session-v1',JSON.stringify({week:2,day:'A',index:0,phase:'ready',logs:[],history,rest:60,end:0,paused:0,checks:[],draft:{},started:0,deferred:[]}));
  localStorage.setItem(prefix+'boxing-v1',JSON.stringify({history:[{date:+monday,mode:'combo',note:'Sessão fictícia de exemplo.',completed:5,total:5}],steps:[]}));
  localStorage.setItem(prefix+'seed-v1','1');
}
try{seed()}catch{}
document.querySelector('#demo-reset')?.addEventListener('click',()=>{
  if(!confirm('Restaurar os exemplos e apagar apenas as alterações feitas nesta demo?'))return;
  try{keys.forEach(k=>localStorage.removeItem(k));seed();location.reload()}catch{alert('Não foi possível restaurar os dados neste navegador.')}
});
})();
