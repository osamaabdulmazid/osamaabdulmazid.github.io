
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const nav = document.querySelector(".nav");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".navlinks a").forEach(a => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
      });
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.10});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const close = document.getElementById("lightbox-close");
  document.querySelectorAll(".image-button img").forEach(img => {
    img.closest(".image-button").addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
  function closeLightbox(){
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
  }
  if (close) close.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});


/* Premium interaction layer — no libraries, no external dependencies. */
document.addEventListener("DOMContentLoaded", () => {
  const progress = document.getElementById("site-progress");
  const glow = document.getElementById("cursor-glow");
  const canvas = document.getElementById("ambient-canvas");
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", updateProgress, {passive:true});
  updateProgress();

  if (glow && !reduced && window.matchMedia("(pointer:fine)").matches) {
    let x = innerWidth/2, y = innerHeight/2, tx=x, ty=y;
    window.addEventListener("pointermove", e => { tx=e.clientX; ty=e.clientY; glow.style.opacity="1"; }, {passive:true});
    const loop=()=>{ x += (tx-x)*.12; y += (ty-y)*.12; glow.style.left=x+"px"; glow.style.top=y+"px"; requestAnimationFrame(loop); };
    loop();
  }

  // Lightweight star/particle field for depth.
  if (canvas && !reduced) {
    const ctx=canvas.getContext("2d",{alpha:true});
    const dots=[]; const DPR=Math.min(devicePixelRatio||1,2);
    const resize=()=>{canvas.width=innerWidth*DPR;canvas.height=innerHeight*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);dots.length=0;const count=Math.min(120,Math.floor(innerWidth*innerHeight/14000));for(let i=0;i<count;i++)dots.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.35+.25,a:Math.random()*.5+.12,v:Math.random()*.18+.02,p:Math.random()*Math.PI*2});};
    resize(); window.addEventListener("resize",resize,{passive:true});
    const draw=()=>{ctx.clearRect(0,0,innerWidth,innerHeight);for(const d of dots){d.y-=d.v;if(d.y<0)d.y=innerHeight;d.p+=.006;const a=d.a*(.72+.28*Math.sin(d.p));ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle=`rgba(185,160,255,${a})`;ctx.fill();}requestAnimationFrame(draw)};draw();
  }

  // Subtle 3D tilt for cards on desktop.
  if (!reduced && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".tilt-card").forEach(card=>{
      card.addEventListener("pointermove", e=>{
        const r=card.getBoundingClientRect(), px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(900px) rotateX(${(-py*3.2).toFixed(2)}deg) rotateY(${(px*4.2).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener("pointerleave",()=>{card.style.transform=""});
    });
    document.querySelectorAll(".magnetic").forEach(btn=>{
      btn.addEventListener("pointermove",e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${((e.clientX-(r.left+r.width/2))/r.width*10).toFixed(1)}px,${((e.clientY-(r.top+r.height/2))/r.height*7).toFixed(1)}px)`});
      btn.addEventListener("pointerleave",()=>btn.style.transform="");
    });
  }

  // Add reveal class to content blocks if not already present.
  document.querySelectorAll("section .glass, .timeline-item, .skill-block, .section-heading").forEach((el,i)=>{if(!el.classList.contains("reveal"))el.classList.add("reveal");el.style.transitionDelay=Math.min(i%6,5)*70+"ms";});
  if (window.IntersectionObserver) {
    const ro=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");ro.unobserve(e.target)}}),{threshold:.08});
    document.querySelectorAll(".reveal").forEach(el=>ro.observe(el));
  } else document.querySelectorAll(".reveal").forEach(el=>el.classList.add("show"));
});

/* AWWWARDS-STYLE MOTION LAYER */
document.addEventListener("DOMContentLoaded",()=>{
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const fine=window.matchMedia?.("(pointer:fine)")?.matches;
  const hero=document.querySelector(".hero");
  const copy=document.querySelector(".hero-copy");
  const visual=document.querySelector(".hero-visual");
  const portrait=document.querySelector(".portrait-frame");
  const orbit=document.querySelector(".hero-orbit");
  const progress=document.getElementById("site-progress");
  const glow=document.getElementById("cursor-glow");

  if(progress){
    const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+"%"};
    addEventListener("scroll",update,{passive:true});update();
  }

  if(!reduced && fine && hero){
    let mx=0,my=0,rx=0,ry=0,px=0,py=0;
    hero.addEventListener("pointermove",e=>{
      const r=hero.getBoundingClientRect(); mx=(e.clientX-r.left)/r.width-.5; my=(e.clientY-r.top)/r.height-.5;
      if(glow){glow.style.opacity="1";glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";}
    },{passive:true});
    hero.addEventListener("pointerleave",()=>{mx=my=0;if(glow)glow.style.opacity="0"});
    const tick=()=>{
      rx+=(mx*5-rx)*.055; ry+=(my*4-ry)*.055; px+=(mx*18-px)*.055; py+=(my*14-py)*.055;
      if(copy)copy.style.transform=`translate3d(${px*.28}px,${py*.28}px,0)`;
      if(visual)visual.style.transform=`translate3d(${px}px,${py}px,0)`;
      if(portrait)portrait.style.transform=`rotate(${2.5+rx*.35}deg) translate3d(${px*.3}px,${py*.3}px,${45+(-my*30)}px)`;
      if(orbit)orbit.style.transform=`translate(-50%,-50%) rotateX(${66+ry*.7}deg) rotateZ(${-18+rx*.7}deg) translateZ(-10px)`;
      requestAnimationFrame(tick);
    };tick();
  }

  if(!reduced){
    const items=document.querySelectorAll(".journey-card,.work-card,.education-card,.credential-card,.presence-card,.gallery-item,.stat-card");
    items.forEach((el,i)=>{
      el.style.transformStyle="preserve-3d";
      if(!fine)return;
      el.addEventListener("pointermove",e=>{
        const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        el.style.transform=`perspective(1100px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-5px)`;
      });
      el.addEventListener("pointerleave",()=>el.style.transform="");
    });
  }
});
