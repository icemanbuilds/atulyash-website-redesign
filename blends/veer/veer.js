/* Veer: cut-out rig with springs. Breathes, blinks, his headband tails trail the scroll,
   he waves, gives a thumbs up and reacts to the PIN check. Tap him for a tip. */
(()=>{
const RIG={"box": {"w": 278.6, "h": 871.5}, "parts": {"head": {"x": 0.04666, "y": 0.0, "w": 0.87351, "h": 0.3198}, "body": {"x": 0.04666, "y": 0.29947, "w": 0.91106, "h": 0.70053}, "armL": {"x": 0.70711, "y": 0.36487, "w": 0.29289, "h": 0.28823}, "armR": {"x": 0.0, "y": 0.35799, "w": 0.30754, "h": 0.30264}, "blink": {"x": 0.04666, "y": 0.0, "w": 0.87351, "h": 0.3198}, "happy": {"x": 0.04666, "y": 0.0, "w": 0.87351, "h": 0.3198}, "wave": {"x": -0.43933, "y": 0.1616, "w": 0.65427, "h": 0.2689}, "thumb": {"x": -0.47578, "y": 0.16451, "w": 0.69347, "h": 0.25927}, "tail1": {"x": 0.71647, "y": 0.1257, "w": 0.32563, "h": 0.21541}, "tail2": {"x": 0.71647, "y": 0.1257, "w": 0.32563, "h": 0.21541}}, "armL": {"ox": 0.45, "oy": 0.06}, "armR": {"ox": 0.55, "oy": 0.06}, "wave": {"ox": 0.93, "oy": 0.84}, "thumb": {"ox": 0.93, "oy": 0.86}, "tail": {"ox": 0.25, "oy": 0.04, "rot": -36}, "neck": 0.93};
const BASE=(document.currentScript&&document.currentScript.src||'').replace(/veer\.js.*$/,'');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const dimensions={
  'arm-left':[39,121],'arm-right':[41,127],'arm-thumb':[93,109],'arm-wave':[88,113],
  body:[122,294],head:[117,134],'head-blink':[117,134],'head-happy':[117,134],
  lie:[440,274],peek:[361,333],tail:[44,90]
};
const img=(name,cls)=>{
  const i=new Image(...dimensions[name]);
  i.alt='';i.loading='lazy';i.decoding='async';
  if(cls)i.className=cls;
  i.src=BASE+'img/'+name+'.webp';
  return i;
};
const place=(el,p,ox,oy)=>{Object.assign(el.style,{left:p.x*100+'%',top:p.y*100+'%',width:p.w*100+'%',height:p.h*100+'%',transformOrigin:(ox*100)+'% '+(oy*100)+'%'});};
const all=new Map(), visible=new Set();
/* Scroll speed, smoothed: tails and head respond to it. */
let sv=0,lastY=scrollY,lastT=performance.now(), animation=0;
if(!reduce)addEventListener('scroll',()=>{
  if(!visible.size||document.hidden)return;
  const now=performance.now(), y=scrollY, dt=Math.max(16,now-lastT);
  sv=Math.max(-3,Math.min(3,(y-lastY)/dt));
  lastY=y;lastT=now;
},{passive:true});

function stand(btn){
  const fig=document.createElement('span');fig.className='vfig';
  const rig=document.createElement('span');rig.className='vrig';
  const sh=document.createElement('span');sh.className='vshadow';
  const P=RIG.parts, L={};
  const add=(key,file,cls,ox,oy)=>{const e=img(file,cls);place(e,P[key],ox,oy);rig.appendChild(e);L[key]=e;return e;};
  add('tail2','tail','',RIG.tail.ox,RIG.tail.oy);
  add('armL','arm-left','arm',RIG.armL.ox,RIG.armL.oy);
  add('body','body','',.5,1);
  add('tail1','tail','',RIG.tail.ox,RIG.tail.oy);
  add('armR','arm-right','arm',RIG.armR.ox,RIG.armR.oy);
  add('wave','arm-wave','arm alt',RIG.wave.ox,RIG.wave.oy);
  add('thumb','arm-thumb','arm alt',RIG.thumb.ox,RIG.thumb.oy);
  add('head','head','',.5,RIG.neck);
  add('blink','head-blink','alt',.5,RIG.neck);
  add('happy','head-happy','alt',.5,RIG.neck);
  fig.append(sh,rig);btn.prepend(fig);
  const fit=()=>{const h=btn.clientHeight,w=h*RIG.box.w/RIG.box.h;rig.style.width=w+'px';rig.style.left=(btn.clientWidth-w)/2+'px';};
  fit();addEventListener('resize',fit);
  const v={btn,fig,L,sh,kind:'stand',arm:'armR',face:'head',blinkAt:performance.now()+1500+Math.random()*2500,blinkEnd:0,
    hopT:-9,armT:-9,armUntil:0,happyUntil:0,tailV:0,tailA:0,headV:0,headA:0,ph:Math.random()*6};
  return v;
}
function single(btn,file){
  const fig=document.createElement('span');fig.className='vfig';
  const sprite=img(file);
  if(btn.dataset.pose==='peek'){const c=document.createElement('span');c.className='vclip';c.appendChild(sprite);fig.appendChild(c);}
  else fig.appendChild(sprite);
  btn.prepend(fig);
  return {btn,fig,sprite,kind:btn.dataset.pose,ph:Math.random()*6,hopT:-9};
}
const setArm=(v,a)=>{if(v.arm===a)return;['armR','wave','thumb'].forEach(k=>v.L[k].style.opacity=k===a?1:0);v.arm=a;};
const setFace=(v,f)=>{if(v.face===f)return;['head','blink','happy'].forEach(k=>v.L[k].style.opacity=k===f?1:0);v.face=f;};

function say(v,text,ms){const b=v.btn.querySelector('.vbub');b.textContent=text;v.btn.classList.add('say');clearTimeout(v.sayT);v.sayT=setTimeout(()=>v.btn.classList.remove('say'),ms||5200);}
function act(v,pose){const now=performance.now();v.hopT=now;
  if(v.kind!=='stand')return;
  if(pose==='wave'||pose==='thumb'){v.armT=now;v.armUntil=now+(pose==='wave'?2600:2200);v.armPose=pose;}
  v.happyUntil=now+1800;}

document.querySelectorAll('.veer').forEach(btn=>{
  const pose=btn.dataset.pose;
  const v=pose==='peek'?single(btn,'peek'):pose==='lie'?single(btn,'lie'):stand(btn);
  v.pose=pose;v.tips=(btn.dataset.tips||'').split('|').filter(Boolean);v.tip=0;v.seen=false;
  all.set(btn,v);
  btn.addEventListener('click',()=>{const t=v.tips[v.tip++%v.tips.length];say(v,t,6000);act(v,v.kind==='stand'?(v.tip%2?'thumb':'wave'):'');});
});
/* he never stands on air: wait until the panel under his gap has opened, give its top edge a moment to settle, then he rises */
function whenGrounded(v,cb){
  const gap=v.btn.closest('.vgap'), panel=gap&&gap.nextElementSibling;
  if(reduce||!document.documentElement.classList.contains('mo')||!panel){cb();return;}
  const go=()=>setTimeout(cb,450);
  if(panel.classList.contains('in')){go();return;}
  const mo=new MutationObserver(()=>{if(panel.classList.contains('in')){mo.disconnect();go();}});
  mo.observe(panel,{attributes:true,attributeFilter:['class']});
}
/* arriving in view: rise in once his panel is there, do his pose, say his line */
const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    const v=all.get(entry.target);
    if(entry.isIntersecting)visible.add(v);
    else visible.delete(v);
    /* every time he comes back into view (scrolling down or up) he greets again; a short cooldown stops flicker at the edge */
    if(entry.isIntersecting&&performance.now()-(v.shownAt||-1e9)>2500){
      v.seen=true;v.shownAt=performance.now();
      clearTimeout(v.inT);
      const greet=first=>{if(!visible.has(v))return;act(v,v.pose);if(first)v.hopT=-9;say(v,v.btn.dataset.say,6000);};
      if(v.landed)v.inT=setTimeout(greet,reduce?0:350);
      else if(!v.waiting){v.waiting=true;
        whenGrounded(v,()=>{v.btn.classList.add('up');v.landed=true;v.inT=setTimeout(()=>greet(true),reduce?0:750);});}
    }
    if(!entry.isIntersecting){clearTimeout(v.inT);v.btn.classList.remove('say');}
  });
  syncAnimation();
});
all.forEach(v=>io.observe(v.btn));
if(!reduce)document.addEventListener('visibilitychange',syncAnimation);
/* PIN check */
document.addEventListener('pin',e=>{const v=all.get(document.querySelector('.veer[data-pin-react]'));if(!v)return;
  if(e.detail==='ok'){say(v,'Yes! We deliver to you.',6500);act(v,'thumb');v.happyUntil=performance.now()+4000;}
  else if(e.detail==='no'){say(v,'Not there yet. WhatsApp us and we will tell you when.',6500);act(v,'wave');}
  else say(v,'Six digits, please. Like 110017.',4500);});

if(reduce)return;
/* the loop: springs, breathing, blinking */
const ease=t=>t<0?0:t>1?1:1-Math.pow(1-t,3);
function syncAnimation(){
  if(reduce||document.hidden||!visible.size){
    if(animation)cancelAnimationFrame(animation);
    animation=0;
    return;
  }
  if(!animation){
    sv=0;lastY=scrollY;lastT=performance.now();
    animation=requestAnimationFrame(frame);
  }
}
function frame(now){
  const T=now/1000; sv*=.9;
  visible.forEach(v=>{
    const hk=(now-v.hopT)/650, hop=hk>=0&&hk<1?Math.sin(hk*Math.PI)*(1-hk*.4):0, sq=hk>=0&&hk<.18?(1-hk/.18):0;
    const br=Math.sin(T*1.7+v.ph);
    if(v.kind==='stand'){
      const L=v.L;
      v.fig.style.transform=`translateY(${(-hop*14).toFixed(2)}px) scale(${(1+sq*.06).toFixed(3)},${(1-sq*.07+hop*.03).toFixed(3)})`;
      v.sh.style.transform=`scale(${(1-hop*.35).toFixed(3)})`;v.sh.style.opacity=(1-hop*.5).toFixed(2);
      L.body.style.transform=`scale(${(1-br*.004).toFixed(4)},${(1+br*.011).toFixed(4)})`;
      /* head: breath, idle sway, a spring that nods with the scroll */
      v.headV+=(-sv*3-v.headA)*.08;v.headV*=.86;v.headA+=v.headV;
      const hr=Math.sin(T*.6+v.ph)*2.2+v.headA, hy=-br*1.1;
      ['head','blink','happy'].forEach(k=>L[k].style.transform=`translateY(${hy.toFixed(2)}px) rotate(${hr.toFixed(2)}deg)`);
      /* tails: cloth on a spring, lifted by scrolling */
      v.tailV+=(sv*14-v.tailA)*.05;v.tailV*=.9;v.tailA+=v.tailV;
      const t1=Math.sin(T*1.3+v.ph)*6+Math.sin(T*2.9)*2-v.tailA, t2=Math.sin(T*1.1+v.ph+1.2)*7-v.tailA*1.2;
      L.tail1.style.transform=`translateY(${hy.toFixed(2)}px) rotate(${(t1+RIG.tail.rot).toFixed(2)}deg)`;
      L.tail2.style.transform=`translateY(${hy.toFixed(2)}px) rotate(${(t2-8+RIG.tail.rot).toFixed(2)}deg) scale(.86)`;
      /* arms */
      const ak=(now-v.armT)/1000;
      if(now<v.armUntil){setArm(v,v.armPose==='wave'?'wave':'thumb');
        const inK=ease(ak/.35);
        if(v.armPose==='wave')L.wave.style.transform=`rotate(${((1-inK)*40+Math.sin(ak*9)*14*inK).toFixed(2)}deg)`;
        else L.thumb.style.transform=`rotate(${((1-inK)*35+Math.sin(ak*5)*4*inK).toFixed(2)}deg) translateY(${(-Math.abs(Math.sin(ak*5))*2).toFixed(2)}px)`;
      }else setArm(v,'armR');
      L.armR.style.transform=`rotate(${(br*1.4).toFixed(2)}deg)`;
      L.armL.style.transform=`rotate(${(-br*1.4).toFixed(2)}deg)`;
      /* face */
      if(now>v.blinkAt){v.blinkEnd=now+150;v.blinkAt=now+2200+Math.random()*3800;}
      setFace(v,now<v.happyUntil?'happy':now<v.blinkEnd?'blink':'head');
    }else if(v.kind==='peek'){
      const i=v.sprite;
      if(v.btn.classList.contains('up')&&now-v.hopT>1100){i.style.transition='none';
        i.style.transform=`translateY(${(Math.sin(T*1.4+v.ph)*2.5+hop*-6).toFixed(2)}px) rotate(${(Math.sin(T*.8+v.ph)*2).toFixed(2)}deg)`;i.style.transformOrigin='50% 100%';}
    }else{
      const i=v.sprite;i.style.transformOrigin='30% 100%';
      i.style.transform=`translateY(${(-hop*8).toFixed(2)}px) scale(${(1+br*.004).toFixed(4)},${(1+br*.012).toFixed(4)})`;
    }
  });
  animation=requestAnimationFrame(frame);
}
})();
