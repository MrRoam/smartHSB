(() => {
  'use strict';
  function init(){
    const body=document.body;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    const motion=()=>!reduce.matches&&!body.classList.contains('motion-off')&&!document.hidden;
    // The preview illustrates the three account tiers; it never changes an account.
    const plans=[...document.querySelectorAll('.trade-preview-plan')];
    let current=0;
    const choose=index=>{current=index;plans.forEach((plan,i)=>plan.classList.toggle('is-current',i===index));};
    if(plans.length){
      choose(0);
      const sections=[...document.querySelectorAll('.trade-account-comparison .acct')];
      sections.forEach((plan,i)=>{plan.addEventListener('mouseenter',()=>choose(i));plan.addEventListener('focusin',()=>choose(i));});
      const io=new IntersectionObserver(entries=>{
        if(entries[0].isIntersecting) choose(current);
      },{threshold:.15});
      io.observe(document.querySelector('.trade-account-preview'));
      setInterval(()=>{const bounds=document.querySelector('.trade-account-preview').getBoundingClientRect();if(motion()&&bounds.bottom>0&&bounds.top<innerHeight)choose((current+1)%plans.length);},3500);
    }

    const market=document.querySelector('.trade-market-workspace');
    if(market){
      const input=market.querySelector('[data-trade-market-search]');
      const counter=market.querySelector('[data-trade-search-count]');
      const quotes=market.querySelector('#mktBody');
      const host=quotes||market;
      const empty=document.createElement('p');empty.className='trade-search-empty';empty.textContent='当前分类没有匹配的品种，请调整关键词。';empty.hidden=true;
      (quotes?quotes:market.querySelector('.tabs')).insertAdjacentElement('afterend',empty);
      function filter(){
        const term=input.value.trim().toLowerCase();
        const rows=[...market.querySelectorAll(quotes?'.qrow':'.trade-search-table tbody tr')];
        rows.forEach(row=>{row.hidden=!!term&&!row.textContent.toLowerCase().includes(term);});
        const visible=[...market.querySelectorAll(quotes?'.qrow':'.tab-panel.active .trade-search-table tbody tr')];
        const count=visible.filter(row=>!row.hidden).length;
        counter.textContent=`显示 ${count} / ${visible.length} 个品种`;
        empty.hidden=count>0;
      }
      input.addEventListener('input',filter);
      market.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{requestAnimationFrame(filter);}));
      if(quotes)new MutationObserver(filter).observe(quotes,{childList:true});
      filter();
      market.querySelectorAll('.tabs .tab').forEach((tab,i,tabs)=>{
        tab.addEventListener('keydown',e=>{
          let next;
          if(e.key==='ArrowRight')next=(i+1)%tabs.length;
          if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
          if(e.key==='Home')next=0;
          if(e.key==='End')next=tabs.length-1;
          if(next!==undefined){e.preventDefault();tabs[next].focus();tabs[next].click();}
        });
      });
    }

    const form=document.querySelector('#demoForm');
    if(form){
      const status=document.querySelector('.trade-interface-status');
      // Capture before legacy handlers: the endpoints are intentionally unconnected.
      const send=form.querySelector('#dSendCode');
      send.addEventListener('click',e=>{
        e.preventDefault();e.stopImmediatePropagation();
        const phone=form.querySelector('#dPhone');
        if(phone.value.replace(/\D/g,'').length<6){window.toast?.('请先填写正确的手机号码');phone.focus();return;}
        status.textContent='短信接口待接入，当前未发送验证码。';
        window.toast?.('短信接口待接入，当前未发送验证码');
      },true);
      form.addEventListener('submit',e=>{
        e.preventDefault();e.stopImmediatePropagation();
        status.textContent='开户接口待接入，当前未提交申请或创建账户。请通过 APP 或客服渠道办理。';
        window.toast?.('开户接口待接入，当前未提交申请');
      },true);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
