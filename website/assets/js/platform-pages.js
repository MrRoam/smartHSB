(() => {
  'use strict';
  const watched = document.querySelectorAll('.platform-chapter,.platform-learning-path,.tool-scene');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('pf-visible'); observer.unobserve(entry.target); }
  }), { threshold:.12 });
  watched.forEach(node => observer.observe(node));
  document.querySelectorAll('.dv-k b').forEach((node,index) => node.style.setProperty('--pf-item',index));

  const reading = document.querySelector('.tutorial-reading');
  const meter = document.querySelector('.tutorial-meter');
  if (reading && meter) {
    const article = reading.querySelector('article');
    const links = [...reading.querySelectorAll('.chp-in a[href^="#"]')];
    const chapters = links.map(link => document.getElementById(link.getAttribute('href').slice(1)));
    let queued=false;
    function updateReading() {
      queued=false;
      if (!article) return;
      const top=article.getBoundingClientRect().top+scrollY;
      const length=Math.max(1,article.offsetHeight-innerHeight*.55);
      const percent=Math.round(Math.max(0,Math.min(1,(scrollY-top+130)/length))*100);
      meter.querySelector('b').textContent=percent+'%';
      meter.querySelector('em').style.width=percent+'%';
      let current=0;
      chapters.forEach((chapter,index)=>{if(chapter && chapter.getBoundingClientRect().top<180)current=index;});
      links.forEach((link,index)=>{
        if(index===current)link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    }
    addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateReading);}},{passive:true});
    addEventListener('resize',updateReading);updateReading();
  }

  const dialog=document.querySelector('#download-qr-viewer');
  if (dialog) {
    let opener;
    document.querySelectorAll('.qr-enlarge').forEach(button=>button.addEventListener('click',()=>{
      opener=button;
      const original=button.querySelector('img');
      const preview=dialog.querySelector('img');
      const title=button.closest('.dl-card')?.querySelector('h3')?.textContent || '下载二维码';
      preview.src=original.getAttribute('src');preview.alt=original.alt;
      dialog.querySelector('.qr-viewer-caption').textContent=title;
      if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
    }));
    dialog.querySelector('.qr-viewer-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>opener?.focus());
  }
})();
