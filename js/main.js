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
