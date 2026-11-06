/* SmartHSB · 全站交互 v1.0 */
(function(){
  'use strict';

  /* ---------- Toast ---------- */
  var toastEl = null, toastTimer = null;
  window.toast = function(msg){
    if(!toastEl){ toastEl = document.createElement('div'); toastEl.className='toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, 2600);
  };

  /* ---------- 移动端菜单 ---------- */
  window.toggleMenu = function(){
    var p = document.getElementById('menuPanel');
    if(p) p.classList.toggle('open');
  };
  window.toggleMGroup = function(btn){
    var g = btn.parentElement;
    g.classList.toggle('open');
    btn.setAttribute('aria-expanded', g.classList.contains('open'));
  };

  /* ---------- 通用 Tab 切换 ---------- */
  document.querySelectorAll('.tabs [data-tab]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var wrap = btn.closest('section') || document;
      wrap.querySelectorAll('.tabs [data-tab]').forEach(function(b){ b.classList.remove('on'); });
      btn.classList.add('on');
      wrap.querySelectorAll('[data-panel]').forEach(function(p){
        p.classList.toggle('active', p.getAttribute('data-panel') === btn.getAttribute('data-tab'));
      });
    });
  });

  /* ---------- FAQ 折叠 ---------- */
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.parentElement;
      var open = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); });
      if(!open) item.classList.add('open');
    });
  });

  /* ---------- 帮助中心：搜索 / 目录联动 / 展开全部 ---------- */
  var hcSearch = document.getElementById('hcSearch');
  if(hcSearch){
    var hcItems = [].slice.call(document.querySelectorAll('.hc-main .hc-item'));
    var hcCats  = [].slice.call(document.querySelectorAll('.hc-main .hc-cat'));
    var hcResult = document.getElementById('hcResult');
    var hcEmpty  = document.getElementById('hcEmpty');
    var hcClear  = document.getElementById('hcClear');
    var hcAll    = document.getElementById('hcToggleAll');

    function escHtml(s){
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    hcCats.forEach(function(c){
      var n = c.querySelector('.hc-cat-n');
      if(n) c.__n = n.textContent;
    });
    hcItems.forEach(function(it){
      var qt = it.querySelector('.hc-qt');
      it.__q = qt.textContent;
      it.__ql = it.__q.toLowerCase();
      it.__a = (it.querySelector('.faq-a').textContent || '').toLowerCase();
    });

    function hcRun(q){
      q = (q || '').replace(/^\s+|\s+$/g,'');
      var lq = q.toLowerCase(), hit = 0;
      hcItems.forEach(function(it){
        var qt = it.querySelector('.hc-qt');
        if(!q){
          it.classList.remove('hide');
          qt.textContent = it.__q;
          hit++;
          return;
        }
        var ok = it.__ql.indexOf(lq) > -1 || it.__a.indexOf(lq) > -1;
        it.classList.toggle('hide', !ok);
        if(!ok){ qt.textContent = it.__q; return; }
        hit++;
        var i = it.__ql.indexOf(lq);
        if(i > -1){
          qt.innerHTML = escHtml(it.__q.slice(0, i)) + '<mark>' + escHtml(it.__q.substr(i, q.length)) + '</mark>' + escHtml(it.__q.slice(i + q.length));
        } else {
          qt.textContent = it.__q;
        }
      });
      hcCats.forEach(function(c){
        var vis = c.querySelectorAll('.hc-item:not(.hide)').length;
        var n = c.querySelector('.hc-cat-n');
        if(n) n.textContent = q ? ('匹配 ' + vis + ' 条') : c.__n;
        c.hidden = !!q && vis === 0;
      });
      if(hcResult){
        hcResult.hidden = !q;
        if(q) hcResult.innerHTML = '关键词「' + escHtml(q) + '」匹配到 <b>' + hit + '</b> 条问答';
      }
      if(hcEmpty) hcEmpty.hidden = !(q && hit === 0);
      if(hcClear) hcClear.hidden = !q;
    }

    var hcTimer = null;
    hcSearch.addEventListener('input', function(){
      clearTimeout(hcTimer);
      hcTimer = setTimeout(function(){ hcRun(hcSearch.value); }, 120);
    });
    if(hcClear) hcClear.addEventListener('click', function(){
      hcSearch.value = ''; hcRun(''); hcSearch.focus();
    });
    document.addEventListener('keydown', function(e){
      var tag = (document.activeElement.tagName || '').toLowerCase();
      if(e.key === '/' && tag !== 'input' && tag !== 'textarea'){
        e.preventDefault(); hcSearch.focus();
      }
    });

    /* 展开 / 收起全部 */
    if(hcAll){
      var hcExpanded = false;
      hcAll.addEventListener('click', function(){
        hcExpanded = !hcExpanded;
        hcItems.forEach(function(it){ it.classList.toggle('open', hcExpanded); });
        hcAll.textContent = hcExpanded ? '收起全部' : '展开全部';
      });
    }

    /* 目录高亮联动 */
    if('IntersectionObserver' in window){
      var hcNavLinks = [].slice.call(document.querySelectorAll('.hc-nav a'));
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(!en.isIntersecting) return;
          var id = en.target.id;
          hcNavLinks.forEach(function(a){
            a.classList.toggle('on', a.getAttribute('href') === '#' + id);
          });
        });
      }, {rootMargin:'-96px 0px -68% 0px', threshold:0});
      hcCats.forEach(function(c){ io.observe(c); });
    }

    /* 深链：/help.html#q-W6 自动展开 */
    function hcOpenHash(){
      var h = location.hash;
      if(!h) return;
      var el = document.querySelector(h);
      if(!el) return;
      var item = el.closest('.hc-item');
      if(item){
        item.parentElement.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); });
        item.classList.add('open');
      }
      setTimeout(function(){ el.scrollIntoView({behavior:'smooth', block:'center'}); }, 60);
    }
    window.addEventListener('hashchange', hcOpenHash);
    hcOpenHash();
  }

  /* ---------- WIB 时钟（UTC+7） ---------- */
  window.renderClock = function(id){
    var el = document.getElementById(id);
    if(!el) return;
    function tick(){
      var now = new Date();
      var wib = new Date(now.getTime() + (7*60 + now.getTimezoneOffset())*60000);
      var p = function(n){ return (n<10?'0':'')+n; };
      el.textContent = p(wib.getHours())+':'+p(wib.getMinutes())+':'+p(wib.getSeconds());
    }
    tick(); setInterval(tick, 1000);
  };

  /* ---------- 模拟账户注册表单 ---------- */
  var demoForm = document.getElementById('demoForm');
  if(demoForm){
    var phone = document.getElementById('dPhone');
    var code = document.getElementById('dCode');
    var pwd = document.getElementById('dPwd');
    var agree = document.getElementById('dAgree');
    var sendBtn = document.getElementById('dSendCode');
    var eye = document.getElementById('dEye');
    var rules = document.getElementById('dPwRules');

    function digits(v){ return v.replace(/[^0-9]/g, ''); }

    /* 手机号仅允许数字 */
    phone.addEventListener('input', function(){ phone.value = digits(phone.value); });
    code.addEventListener('input', function(){ code.value = digits(code.value); });

    /* 密码规则校验 */
    var tests = {
      len: function(v){ return v.length >= 8 && v.length <= 12; },
      num: function(v){ return /[0-9]/.test(v); },
      upper: function(v){ return /[A-Z]/.test(v); },
      lower: function(v){ return /[a-z]/.test(v); },
      special: function(v){ return /[^A-Za-z0-9]/.test(v); }
    };
    function checkPwd(){
      var v = pwd.value, all = true;
      rules.querySelectorAll('li').forEach(function(li){
        var ok = tests[li.getAttribute('data-rule')](v);
        li.classList.toggle('ok', ok);
        if(!ok) all = false;
      });
      return all && v.length > 0;
    }
    pwd.addEventListener('input', checkPwd);

    /* 显示/隐藏密码 */
    eye.addEventListener('click', function(){
      var show = pwd.type === 'password';
      pwd.type = show ? 'text' : 'password';
      eye.classList.toggle('on', show);
      eye.setAttribute('aria-pressed', show ? 'true' : 'false');
      eye.setAttribute('aria-label', show ? '隐藏密码' : '显示密码');
    });

    /* 发送验证码：60 秒倒计时 */
    var timer = null;
    sendBtn.addEventListener('click', function(){
      if(sendBtn.disabled) return;
      if(phone.value.length < 6){ toast('请先填写正确的手机号码'); phone.focus(); return; }
      var cc = document.getElementById('dCc').value;
      toast('验证码已发送至 ' + cc + ' ' + phone.value);
      var left = 60;
      sendBtn.disabled = true;
      sendBtn.textContent = left + 's 后重发';
      timer = setInterval(function(){
        left--;
        if(left <= 0){ clearInterval(timer); sendBtn.disabled = false; sendBtn.textContent = '重新发送'; return; }
        sendBtn.textContent = left + 's 后重发';
      }, 1000);
    });

    /* 提交 */
    demoForm.addEventListener('submit', function(e){
      e.preventDefault();
      if(phone.value.length < 6){ toast('请填写正确的手机号码'); phone.focus(); return; }
      if(code.value.length !== 6){ toast('请输入 6 位短信验证码'); code.focus(); return; }
      if(!checkPwd()){ toast('密码不符合安全规则，请按提示调整'); pwd.focus(); return; }
      if(!agree.checked){ toast('请先阅读并同意平台服务条款与隐私政策'); agree.focus(); return; }
      toast('模拟账户申请已提交，开通后将以短信通知');
    });
  }

  /* ---------- 单栏章节流：吸顶章节导航高亮 + 阅读进度 ---------- */
  (function(){
    var nav = document.querySelector('.chp-nav');
    if(!nav) return;
    var box  = nav.querySelector('.chp-in');
    var bar  = nav.querySelector('.chp-prog span');
    var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
    var secs  = links.map(function(a){
      try{ return document.querySelector(a.getAttribute('href')); }catch(e){ return null; }
    });

    /* 折叠：胶囊平铺超过 2 行（或窄屏）时收起为单行横滑，并提供展开按钮 */
    var more = document.createElement('div');
    more.className = 'chp-more';
    var btn = document.createElement('button');
    btn.type = 'button';
    more.appendChild(btn);
    nav.insertBefore(more, nav.querySelector('.chp-prog'));

    var TWO_ROW = 100;   // 两行高度上限：padding 10*2 + 34*2 + gap 8 = 96
    var folded = false, foldable = false;

    function setLabel(){
      btn.innerHTML = folded
        ? '展开全部 ' + links.length + ' 章 <span>▾</span>'
        : '收起章节导航 <span>▴</span>';
    }
    function setOffset(){
      var top = window.innerWidth <= 980 ? 73 : 84;
      document.documentElement.style.setProperty('--chp-off', (nav.offsetHeight + top + 16) + 'px');
    }
    function layout(){
      var prev = nav.classList.contains('folded');
      nav.classList.remove('folded');
      var need = box.scrollHeight > TWO_ROW || window.innerWidth <= 700;
      foldable = need;
      if(need && !prev){ nav.classList.add('folded'); folded = true; }
      else if(need && prev){ nav.classList.add('folded'); folded = true; }
      else { folded = false; }
      nav.classList.toggle('foldable', foldable);
      setLabel();
      setOffset();
    }
    btn.addEventListener('click', function(){
      folded = !folded;
      nav.classList.toggle('folded', folded);
      setLabel();
      setOffset();
    });

    var lastIdx = -1;
    function sync(){
      var idx = 0;
      for(var i=0;i<secs.length;i++){
        if(secs[i] && secs[i].getBoundingClientRect().top <= 160) idx = i;
      }
      links.forEach(function(a,i){ a.classList.toggle('on', i===idx); });

      var act = links[idx];
      if(act && box && idx !== lastIdx){
        var l = act.offsetLeft, r = l + act.offsetWidth;
        if(l < box.scrollLeft + 16){ box.scrollLeft = Math.max(0, l - 16); }
        else if(r > box.scrollLeft + box.clientWidth - 16){ box.scrollLeft = r - box.clientWidth + 16; }
      }
      lastIdx = idx;
      if(bar){
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0) + '%';
      }
    }

    var raf = null;
    function onScroll(){
      if(raf) return;
      raf = requestAnimationFrame(function(){ raf = null; sync(); });
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    var rt = null;
    window.addEventListener('resize', function(){
      if(rt) clearTimeout(rt);
      rt = setTimeout(function(){ layout(); sync(); }, 150);
      onScroll();
    });
    layout();
    sync();
  })();
})();
