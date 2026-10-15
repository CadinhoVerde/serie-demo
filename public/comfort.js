/* Preferences never replace training records. */
let comfort={large:false,focus:false,sound:true,vibration:true};
try{comfort={...comfort,...JSON.parse(localStorage.getItem('labsites-serie-demo-comfort-v1')||'{}')}}catch{}
comfort.large=false;
let noticeAudio;
function trainingSignal(message){
  if(message)toast(message);
  if(comfort.vibration)navigator.vibrate?.([150,80,150]);
  if(!comfort.sound)return;
  try{noticeAudio=noticeAudio||new(window.AudioContext||window.webkitAudioContext)();noticeAudio.resume();const o=noticeAudio.createOscillator(),g=noticeAudio.createGain();o.connect(g);g.connect(noticeAudio.destination);o.frequency.value=740;g.gain.setValueAtTime(.12,noticeAudio.currentTime);g.gain.exponentialRampToValueAtTime(.001,noticeAudio.currentTime+.45);o.start();o.stop(noticeAudio.currentTime+.45)}catch{}
}
function applyComfort(){
  document.body.classList.toggle('large-text',comfort.large);
  document.body.classList.toggle('focus-mode',comfort.focus);
  for(const key of ['large','focus','sound','vibration']){const button=document.querySelector(`[data-comfort="${key}"]`);if(button){button.setAttribute('aria-pressed',String(comfort[key]));button.textContent=({large:comfort.large?'Texto ampliado':'Ampliar texto',focus:comfort.focus?'Sair do modo foco':'Modo foco',sound:comfort.sound?'Som ligado':'Som desligado',vibration:comfort.vibration?'Vibração ligada':'Vibração desligada'})[key]}}
  try{localStorage.setItem('labsites-serie-demo-comfort-v1',JSON.stringify(comfort))}catch{}
}
document.querySelectorAll('[data-comfort]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.comfort;comfort[key]=!comfort[key];applyComfort();if(key==='sound'&&comfort.sound)trainingSignal('Som ativado.')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&comfort.focus){comfort.focus=false;applyComfort();document.querySelector('[data-comfort="focus"]')?.focus()}});
document.querySelector('#fullscreen')?.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else{comfort.focus=true;applyComfort();toast('Modo foco ativado. Tela cheia não está disponível neste navegador.')}}catch{comfort.focus=true;applyComfort();toast('Modo foco ativado.')}});
document.addEventListener('fullscreenchange',()=>{document.querySelector('#fullscreen').textContent=document.fullscreenElement?'Sair da tela cheia':'Tela cheia'});
applyComfort();
