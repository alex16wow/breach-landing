/* Scroll and pointer transforms live on separate wrappers, preserving the
   approved image sizes, offsets, clip paths and the final card composition. */
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const cards=[...document.querySelectorAll('.artifact-card')];
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  let context;
  const layers=cards.map(card=>{
    card.classList.remove('reveal');card.classList.add('visible');
    const result={card};
    for(const name of ['back','item','particles']){
      const image=card.querySelector(`.${name}`);
      const scroll=document.createElement('div');
      scroll.className=`artifact-scroll-layer layer-${name}`;
      const pointer=document.createElement('div');pointer.className='artifact-pointer-layer';
      image.before(scroll);scroll.append(pointer);pointer.append(image);
      result[name]={scroll,pointer};
    }
    const glow=document.createElement('div');glow.className='artifact-glow';card.prepend(glow);result.glow=glow;
    return result;
  });
  const hero=document.querySelector('.hero');
  const stage=document.createElement('div');stage.className='hero-stage';hero.before(stage);stage.append(hero);
  const glow=document.createElement('div');glow.className='rift-glow';hero.prepend(glow);
  const clamp=gsap.utils.clamp(-.5,.5);
  layers.forEach(layer=>{
    function reset(){
      gsap.to([layer.back.pointer,layer.item.pointer,layer.particles.pointer],{x:0,y:0,scale:1,duration:.5,overwrite:true,ease:'power2.out'});
      gsap.to(layer.glow,{opacity:0,duration:.5,overwrite:true});
    }
    layer.card.addEventListener('pointermove',e=>{
      if(!motion||!fine.matches||e.pointerType==='touch')return;
      const r=layer.card.getBoundingClientRect();const x=clamp((e.clientX-r.left)/r.width-.5),y=clamp((e.clientY-r.top)/r.height-.5);
      gsap.to(layer.back.pointer,{x:-x*12,y:-y*12,duration:.5,overwrite:true,ease:'power2.out'});
      gsap.to(layer.item.pointer,{scale:1.08,duration:.5,overwrite:true,ease:'power2.out'});
      gsap.to(layer.particles.pointer,{x:x*35,y:y*35,duration:.5,overwrite:true,ease:'power2.out'});
      gsap.to(layer.glow,{opacity:.6,duration:.5,overwrite:true});
    });
    layer.card.addEventListener('pointerleave',reset);
    window.addEventListener('breach-motion',()=>{if(!motion)reset()});
  });
  function build(){
    context?.revert();
    document.body.classList.remove('cinematic-scroll');
    if(!motion){ScrollTrigger.refresh();return;}
    context=gsap.context(()=>{
      const desktop=innerWidth>1000;
      const mobile=innerWidth<=650;
      if(desktop){
        document.body.classList.add('cinematic-scroll');
        const timeline=gsap.timeline({scrollTrigger:{id:'hero-rift',trigger:stage,start:'top top',end:'+=1000',pin:hero,pinSpacing:false,scrub:.65,anticipatePin:1,invalidateOnRefresh:true}});
        timeline.to('#hero-video',{scale:1.35,transformOrigin:'50% 43%',ease:'none',duration:1},0)
          .to('.hero-copy,.scroll-cue,.nav',{opacity:0,ease:'none',duration:.45},0)
          .to(glow,{opacity:.46,ease:'none',duration:1},0);
      }else{
        gsap.timeline({scrollTrigger:{id:'hero-rift-mobile',trigger:hero,start:'top top',end:'bottom top',scrub:.4}})
          .to('#hero-video',{scale:1.12,transformOrigin:'50% 43%',ease:'none'},0)
          .to('.hero-copy',{opacity:0,ease:'none'},0)
          .to(glow,{opacity:.2,ease:'none'},0);
      }
      const starts=[[-100,-40,-5],[0,120,4],[0,-100,-4],[100,60,5]];
      const amount=mobile?.35:1;
      layers.forEach((layer,i)=>{
        // Each staggered card reaches its exact approved position as it enters
        // the readable part of the viewport; scrolling back separates it again.
        const tl=gsap.timeline({scrollTrigger:{id:`artifact-${i}`,trigger:layer.card,start:'top bottom+=80',end:'top 24%',scrub:.65,invalidateOnRefresh:true,onLeave:self=>{self.animation.progress(1);self.kill(false,true)}}});
        const [x,y,rotation]=starts[i];
        tl.fromTo(layer.card,{x:x*amount,y:y*amount,rotation:rotation*amount},{x:0,y:0,rotation:0,duration:1,ease:'none'},0)
          .fromTo(layer.back.scroll,{y:15*amount},{y:0,duration:1,ease:'none'},0)
          .fromTo(layer.item.scroll,{y:-35*amount,scale:.9},{y:0,scale:1,duration:1,ease:'none'},0)
          .fromTo(layer.particles.scroll,{y:60*amount},{y:0,duration:1,ease:'none'},0);
      });
    });
    ScrollTrigger.refresh();
  }
  build();
  window.addEventListener('breach-motion',build);
  let previousWidth=innerWidth,resizeTimer;
  window.addEventListener('resize',()=>{if(innerWidth===previousWidth)return;previousWidth=innerWidth;clearTimeout(resizeTimer);resizeTimer=setTimeout(build,180)});
  window.addEventListener('load',()=>ScrollTrigger.refresh());
  document.fonts.ready.then(()=>ScrollTrigger.refresh());
})();
