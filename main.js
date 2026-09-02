const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>[...c.querySelectorAll(s)];
const progress=q('.scroll-progress span');
const header=q('.site-header');
const timeline=q('.timeline');
function onScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(max>0?(scrollY/max)*100:0)+'%';
  header.classList.toggle('scrolled',scrollY>20);
}
onScroll();addEventListener('scroll',onScroll,{passive:true});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');if(e.target===timeline)timeline.classList.add('active');}}),{threshold:.13});
qa('.reveal').forEach(el=>io.observe(el)); if(timeline) io.observe(timeline);
qa('.spotlight-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`);}));
const menuBtn=q('.menu-btn'), menu=q('.mobile-menu');
menuBtn?.addEventListener('click',()=>{const open=menuBtn.getAttribute('aria-expanded')==='true';menuBtn.setAttribute('aria-expanded',String(!open));menu.hidden=open;});
qa('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;menuBtn.setAttribute('aria-expanded','false')}));

// V6.3 mobile floating email CTA: show after the visitor begins reading, hide near Contact/Footer.
const mobileFloatCta=q('.mobile-float-cta');
const contactSection=q('#contact');
const footer=q('.site-footer');
let contactInView=false, footerInView=false;
function updateMobileFloatCta(){
  if(!mobileFloatCta) return;
  const mobile=matchMedia('(max-width:760px)').matches;
  const deepEnough=scrollY>Math.min(420, innerHeight*.48);
  const shouldShow=mobile && deepEnough && !contactInView && !footerInView;
  mobileFloatCta.classList.toggle('is-visible',shouldShow);
  mobileFloatCta.classList.toggle('is-hidden-near-contact',contactInView||footerInView);
}
addEventListener('scroll',updateMobileFloatCta,{passive:true});
addEventListener('resize',updateMobileFloatCta,{passive:true});
if(contactSection||footer){
  const ctaObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.target===contactSection) contactInView=entry.isIntersecting;
      if(entry.target===footer) footerInView=entry.isIntersecting;
    });
    updateMobileFloatCta();
  },{rootMargin:'0px 0px -12% 0px',threshold:.08});
  if(contactSection) ctaObserver.observe(contactSection);
  if(footer) ctaObserver.observe(footer);
}
updateMobileFloatCta();


// V7.3 pointer-reactive details. Desktop fine pointers only; motion preference respected.
const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
if(finePointer.matches && !reducedMotion.matches){
  const tiltSelectors=['.spotlight-card','.role-card','.why-card','.service-card','.budget-card','.news-card','.faq-item','.consultation-card-main'];
  qa(tiltSelectors.join(',')).forEach(el=>{
    el.classList.add('interactive-tilt');
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      el.style.setProperty('--tilt-x',`${(-y*3.2).toFixed(2)}deg`);
      el.style.setProperty('--tilt-y',`${(x*4).toFixed(2)}deg`);
    });
    el.addEventListener('pointerleave',()=>{
      el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');
    });
  });
  const aside=q('.consultation-card-aside');
  aside?.addEventListener('pointermove',e=>{
    const r=aside.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*18;
    const y=((e.clientY-r.top)/r.height-.5)*18;
    aside.style.setProperty('--px',`${x.toFixed(1)}px`);
    aside.style.setProperty('--py',`${y.toFixed(1)}px`);
  });
  aside?.addEventListener('pointerleave',()=>{aside.style.setProperty('--px','0px');aside.style.setProperty('--py','0px')});
}

// V7.8 — richer pointer interactions for the homepage.
if(finePointer.matches && !reducedMotion.matches){
  // Soft page-wide cursor aura and ambient light bloom.
  const aura=document.createElement('div');
  aura.className='cursor-aura';
  document.body.appendChild(aura);
  let ax=innerWidth/2, ay=innerHeight/3, tx=ax, ty=ay;
  const hotSelector='a,button,summary,.spotlight-card,.path-card,.support-card,.budget-card,.news-card,.process-step,.stakeholder-grid span,.hero-photo,.editorial-image,.service-photo,.roadmap-photo,.inclusive-visual-image';
  addEventListener('pointermove',e=>{
    tx=e.clientX;ty=e.clientY;
    document.body.style.setProperty('--cursor-x',`${e.clientX}px`);
    document.body.style.setProperty('--cursor-y',`${e.clientY}px`);
    aura.classList.add('is-visible');
    aura.classList.toggle('is-hot',!!e.target.closest(hotSelector));
  },{passive:true});
  addEventListener('pointerleave',()=>aura.classList.remove('is-visible'));
  (function animateAura(){ax+=(tx-ax)*.18;ay+=(ty-ay)*.18;aura.style.transform=`translate(${ax-17}px,${ay-17}px)`;requestAnimationFrame(animateAura)})();

  // Magnetic primary actions: restrained enough to remain readable.
  qa('.button.primary,.nav-cta').forEach(el=>{
    el.classList.add('magnetic');
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-(r.left+r.width/2))*.10;
      const y=(e.clientY-(r.top+r.height/2))*.12;
      el.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
    });
    el.addEventListener('pointerleave',()=>el.style.transform='translate(0,0)');
  });

  // Hero image and floating cards gain layered parallax, without shaking.
  const heroMedia=q('.hero-photo');
  if(heroMedia){
    const heroImg=q('img',heroMedia), cards=qa('.floating-card',heroMedia);
    heroMedia.addEventListener('pointermove',e=>{
      const r=heroMedia.getBoundingClientRect();
      const nx=(e.clientX-r.left)/r.width-.5, ny=(e.clientY-r.top)/r.height-.5;
      if(heroImg) heroImg.style.transform=`scale(1.035) translate(${(-nx*9).toFixed(1)}px,${(-ny*7).toFixed(1)}px)`;
      cards.forEach((card,i)=>card.style.transform=`translate(${(nx*(i?14:-12)).toFixed(1)}px,${(ny*(i?10:-8)).toFixed(1)}px)`);
    });
    heroMedia.addEventListener('pointerleave',()=>{
      if(heroImg) heroImg.style.transform='';
      cards.forEach(card=>card.style.transform='');
    });
  }

  // Cursor-position light on stakeholder chips.
  qa('.stakeholder-grid span').forEach(chip=>chip.addEventListener('pointermove',e=>{
    const r=chip.getBoundingClientRect();
    chip.style.setProperty('--chip-x',`${e.clientX-r.left}px`);
    chip.style.setProperty('--chip-y',`${e.clientY-r.top}px`);
  }));
}

// Keep the desktop navigation synchronized with the section currently being read.
const navMap=new Map();
qa('.desktop-nav a[href^="#"]').forEach(link=>{const el=q(link.getAttribute('href'));if(el)navMap.set(el,link)});
if(navMap.size){
  const navObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    navMap.forEach(link=>link.classList.remove('is-active'));
    navMap.get(visible.target)?.classList.add('is-active');
  },{rootMargin:'-24% 0px -60% 0px',threshold:[0,.12,.3,.55]});
  navMap.forEach((_,section)=>navObserver.observe(section));
}
