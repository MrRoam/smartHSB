(function(){
  'use strict';
  var STRATEGY_API='https://content.adxpm99.com/api/v1/content/strategies';
  var CALENDAR_API='https://content.adxpm99.com/api/v1/content/calendars/economic';
  var PAGE_SIZE=12;
  var articles=[
    {type:'fx',category:'外汇',date:'11月20日 08:20',source:'FXStreet',title:'通胀数据再次强化日本央行加息押注，日元走强',summary:'市场重新评估日本货币政策的节奏，日元与主要货币的短线波动受到关注。'},
    {type:'fx',category:'外汇',date:'11月20日 08:14',source:'FXStreet',title:'随着美联储加息押注增强，美元走强，欧元面临压力',summary:'利率预期的变化继续影响主要货币对走势，市场等待更多经济信号确认方向。'},
    {type:'commodities',category:'商品',date:'11月20日 08:05',source:'FXStreet',title:'中东紧张局势抵消供应过剩前景，WTI 在 82.50 美元上方企稳',summary:'地缘风险和库存预期交错，原油市场维持高敏感度，波动仍可能放大。'},
    {type:'indices',category:'指数',date:'11月20日 08:04',source:'TradingKey',title:'美股三大指数均跌超 2%，市场聚焦风险偏好变化',summary:'大型科技与成长板块的波动扩大，投资者同步关注美债收益率和企业财报线索。'},
    {type:'analysis',category:'技术分析',date:'11月20日 07:46',source:'FXStreet',title:'瑞波币价格预测：需求低迷之际，XRP 涨势受限于 1.00 美元下方',summary:'从关键价格区域、动能与成交活跃度观察，市场仍在等待新的方向性催化。'},
    {type:'economics',category:'财经指标',date:'11月20日 07:54',source:'FXStreet',title:'已确认：中国人民银行 11 月维持贷款市场报价利率不变',summary:'政策利率保持稳定，市场将继续从流动性与信贷数据中寻找新的价格线索。'}
  ];
  function escapeHTML(value){return String(value==null?'':value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];});}
  function queryValue(key,allowed,fallback){var value=new URLSearchParams(window.location.search).get(key);return allowed.indexOf(value)>-1?value:fallback;}
  function setQuery(key,value){var url=new URL(window.location.href);url.searchParams.set(key,value);window.history.replaceState({},'',url.toString());}
  function pageHero(eyebrow,title,intro,crumb){return '<section class="market-hero"><div class="market-wrap"><nav class="market-breadcrumb" aria-label="面包屑"><a href="index.html">首页</a><span>／</span><a href="'+crumb.href+'">'+crumb.label+'</a><span>／</span><span>'+eyebrow+'</span></nav><p class="market-eyebrow"><i></i>'+eyebrow+'</p><h1>'+title+'</h1><p class="market-intro">'+intro+'</p></div></section>';}
  function impact(level){var dots='';for(var i=0;i<3;i+=1)dots+='<i></i>';return '<span class="impact level-'+level+'" aria-label="波动级别 '+level+'（共 3 级）">'+dots+'</span>';}
  function news(){var root=document.querySelector('[data-news-app]');if(!root)return;root.closest('body').classList.add('market-page');var active=queryValue('category',['all','fx','commodities','indices','analysis','economics'],'all'),tabs=[['all','全部'],['fx','外汇'],['commodities','商品'],['indices','指数'],['analysis','技术分析'],['economics','财经指标']];function render(){var shown=active==='all'?articles:articles.filter(function(item){return item.type===active;});root.innerHTML=pageHero('资讯中心','从市场脉络，到 <em>下一步判断</em>','外汇、商品、指数、技术分析与财经指标的内容快照。筛选设计已按当前消息页分类更新。',{href:'news.html',label:'市场'})+'<section class="market-content"><div class="market-wrap"><div class="market-section-head"><div><h2>市场消息</h2><p>当前页面为内容与筛选样式快照，后续可通过内容接口替换文章数据。</p></div></div><div class="news-tabs" role="tablist" aria-label="资讯类别">'+tabs.map(function(tab){return '<button class="news-tab" role="tab" aria-selected="'+(tab[0]===active)+'" data-news-type="'+tab[0]+'">'+tab[1]+'</button>';}).join('')+'</div><div class="news-grid" aria-live="polite">'+(shown.length?shown.map(function(item){return '<article class="news-card"><div><div class="news-card-top"><span>'+item.date+'</span><span class="news-card-tag">'+item.category+'</span></div><h3>'+item.title+'</h3><p>'+item.summary+'</p></div><footer class="news-card-footer"><span>'+item.source+'</span><a href="news.html" aria-label="查看 '+item.title+' 的详情设计">阅读摘要 <span aria-hidden="true">→</span></a></footer></article>';}).join(''):'<div class="market-empty">当前快照没有该分类内容。接入消息接口后会显示最新文章。</div>')+'</div></div></section>';root.querySelectorAll('[data-news-type]').forEach(function(button){button.addEventListener('click',function(){active=button.dataset.newsType;setQuery('category',active);render();});});}render();}
  function productGroup(productType){return {FX:'fx',Commodities:'commodities',Indices:'indices'}[productType]||'other';}
  function productLabel(productType){return {FX:'外汇',Commodities:'商品',Indices:'指数'}[productType]||'其他';}
  function direction(signal){return '<span class="signal-direction '+(signal.direction==='up'?'up':'down')+'">'+(signal.direction==='up'?'看涨 ↑':'看跌 ↓')+'</span>';}
  function formatPublished(timestamp){return timestamp?new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(timestamp)):'刚刚更新';}
  function strategyCard(signal){return '<a class="signal-card" href="trading-signal-detail.html?signalId='+encodeURIComponent(signal.id)+'"><div><span class="signal-symbol">'+escapeHTML(signal.symbol)+'</span><small class="signal-class">'+productLabel(signal.productType)+' · '+escapeHTML(signal.term)+'</small></div><div class="signal-copy"><h3 class="signal-title">'+escapeHTML(signal.title)+'</h3><p class="signal-summary">'+escapeHTML(signal.summary)+'</p></div><div class="signal-side"><span>最新参考价</span><b>'+escapeHTML(signal.last)+'</b><span>'+formatPublished(signal.publishTime)+'</span></div>'+direction(signal)+'<span class="signal-arrow" aria-hidden="true">→</span></a>';}
  function signalList(){var root=document.querySelector('[data-signal-list-app]');if(!root)return;root.closest('body').classList.add('market-page');var active=queryValue('market',['all','fx','commodities','indices'],'all'),state={page:0,total:0,rawCount:0,rows:[],loading:false,error:''},filters=[['all','全部'],['fx','外汇'],['commodities','商品'],['indices','指数']];function visibleRows(){return state.rows.filter(function(item){return active==='all'||productGroup(item.productType)===active;});}function render(){var visible=visibleRows(),list=state.loading&&!state.rows.length?'<div class="market-empty">正在加载策略…</div>':visible.length?visible.map(strategyCard).join(''):'<div class="market-empty">当前已加载内容中没有此分类策略。可继续加载更多策略。</div>',button=state.rawCount<state.total?'<button class="signal-load-more" data-load-more '+(state.loading?'disabled':'')+'>'+ (state.loading?'正在加载…':'加载更多策略')+'</button>':state.rows.length?'<p class="signal-end">已显示全部可用策略</p>':'',error=state.error?'<p class="signal-error" role="status">'+escapeHTML(state.error)+'<button data-retry>重试</button></p>':'';root.innerHTML=pageHero('交易信号','Trading Central <em>策略信号</em>','实时策略列表与详情由 Trading Central 内容接口提供，数据会随来源更新。',{href:'trading-signals.html',label:'交易策略'})+'<section class="market-content"><div class="market-wrap"><div class="market-section-head"><div><h2>策略列表</h2><p>查看产品、交易周期、方向、参考价位与策略明细。</p></div><span class="market-source">策略数据由 Trading Central 提供</span></div><div class="signal-toolbar"><span class="signal-count">已加载 <b>'+state.rows.length+'</b> 条策略</span><div class="signal-filter" aria-label="策略品种筛选">'+filters.map(function(filter){return '<button aria-pressed="'+(active===filter[0])+'" data-signal-filter="'+filter[0]+'">'+filter[1]+'</button>';}).join('')+'</div></div><div class="signal-list" aria-live="polite">'+list+'</div>'+error+'<div class="signal-pagination">'+button+'</div><p class="market-focus">策略数据仅供信息参考，不构成投资建议、邀约或交易指令。</p></div></section>';root.querySelectorAll('[data-signal-filter]').forEach(function(buttonElement){buttonElement.addEventListener('click',function(){active=buttonElement.dataset.signalFilter;setQuery('market',active);render();});});var loadButton=root.querySelector('[data-load-more]');if(loadButton)loadButton.addEventListener('click',loadMore);var retryButton=root.querySelector('[data-retry]');if(retryButton)retryButton.addEventListener('click',loadMore);}function loadMore(){if(state.loading||(state.total&&state.rawCount>=state.total))return;state.loading=true;state.error='';render();fetch(STRATEGY_API+'/page?pageNum='+(state.page+1)+'&pageSize='+PAGE_SIZE,{headers:{'X-Language':'zh-CN'}}).then(function(response){if(!response.ok)throw new Error('request');return response.json();}).then(function(payload){var value=payload&&payload.value;if(!value||!Array.isArray(value.list))throw new Error('invalid');state.page=value.pageNum||state.page+1;state.total=value.total||state.total;state.rawCount+=value.list.length;state.rows=state.rows.concat(value.list.filter(function(item){return productGroup(item.productType)!=='other';}));}).catch(function(){state.error='暂时无法加载策略，请检查网络后重试。';}).finally(function(){state.loading=false;render();});}render();loadMore();}
  function plainText(value){return String(value||'').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]*>/g,'').replace(/\n{3,}/g,'\n\n').trim();}
  function signalDetail(){var root=document.querySelector('[data-signal-detail-app]');if(!root)return;root.closest('body').classList.add('market-page');var signalId=new URLSearchParams(window.location.search).get('signalId');function shell(content){root.innerHTML=pageHero('交易信号','策略详情，<em>关键信息一页读懂</em>','策略数据由 Trading Central 内容接口实时提供。',{href:'trading-signals.html',label:'交易策略'})+'<section class="market-content"><div class="market-wrap"><a class="market-back" href="trading-signals.html">返回策略列表</a>'+content+'</div></section>';}function renderSignal(signal){var detail=plainText(signal.content);shell('<div class="signal-detail-grid"><article class="signal-summary-panel"><div class="signal-detail-top"><div><p class="signal-detail-product">'+escapeHTML(signal.symbol)+' · '+productLabel(signal.productType)+' · '+escapeHTML(signal.term)+'</p><h2>'+escapeHTML(signal.title)+'</h2><p class="signal-detail-stamp">更新于 '+formatPublished(signal.publishTime)+' · 最新参考价 '+escapeHTML(signal.last)+'</p></div>'+direction(signal)+'</div><div class="signal-plan"><div class="signal-plan-row"><b>策略摘要 · SUMMARY</b><p>'+escapeHTML(signal.summary)+'</p></div><div class="signal-plan-row"><b>首选策略 · PREFERENCE</b><p>'+escapeHTML(signal.preference)+'</p></div><div class="signal-plan-row"><b>备选策略 · ALTERNATIVE</b><p>'+escapeHTML(signal.alternative)+'</p></div><div class="signal-plan-row"><b>技术点评 · COMMENT</b><p>'+escapeHTML(signal.technology)+'</p></div></div></article><aside class="signal-levels"><h3>完整策略说明</h3><p class="signal-raw">'+escapeHTML(detail).replace(/\n/g,'<br>')+'</p></aside><p class="signal-disclaimer"><b>风险提示</b> 本策略内容由 Trading Central 提供，仅供信息参考，不构成投资建议、邀约或交易指令。</p></div>');}if(!signalId){shell('<div class="market-empty">未找到策略编号。请从策略列表选择一条策略。</div>');return;}shell('<div class="market-empty" role="status">正在加载策略详情…</div>');fetch(STRATEGY_API+'/detail?id='+encodeURIComponent(signalId),{headers:{'X-Language':'zh-CN'}}).then(function(response){if(!response.ok)throw new Error('request');return response.json();}).then(function(payload){if(!payload||!payload.value||productGroup(payload.value.productType)==='other')throw new Error('invalid');renderSignal(payload.value);}).catch(function(){shell('<div class="market-empty">暂时无法加载策略详情，请返回列表后重试。</div>');});}
  function calendar(){
    var root=document.querySelector('[data-calendar-app]');
    if(!root)return;
    root.closest('body').classList.add('market-page');

    var query=new URLSearchParams(window.location.search);
    var active=queryValue('type',['data','events','holidays','featured'],'data');
    var selected=normaliseCalendarDate(query.get('date'));
    var important=queryValue('important',['true','false'],'false')==='true';
    var state={page:0,total:0,count:0,rows:[],loading:false,error:''};
    var typeMap={data:'data',events:'event',holidays:'holiday'};

    function normaliseCalendarDate(value){
      return /^\d{4}-\d{2}-\d{2}$/.test(value||'')?value:new Date().toISOString().slice(0,10);
    }
    function offsetDate(value,offset){
      var date=new Date(value+'T12:00:00Z');
      date.setUTCDate(date.getUTCDate()+offset);
      return date.toISOString().slice(0,10);
    }
    function displayDate(value){
      var date=new Date(value+'T12:00:00Z');
      return {
        weekday:new Intl.DateTimeFormat('zh-CN',{weekday:'short',timeZone:'Asia/Jakarta'}).format(date),
        day:new Intl.DateTimeFormat('zh-CN',{month:'2-digit',day:'2-digit',timeZone:'Asia/Jakarta'}).format(date).replace('/','-')
      };
    }
    function displayTime(timestamp){
      return timestamp?new Intl.DateTimeFormat('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Jakarta'}).format(new Date(timestamp*1000)):'—';
    }
    function displayValue(value,potency){
      return value===null||value===undefined||value===''?'—':escapeHTML(String(value)+(potency||''));
    }
    function isImportant(){return active==='featured'||important;}
    function apiUrl(){
      var params=new URLSearchParams({date:selected,pageNum:String(state.page+1),pageSize:String(PAGE_SIZE),isImportant:isImportant()?'1':'0'});
      if(typeMap[active])params.set('type',typeMap[active]);
      return CALENDAR_API+'?'+params.toString();
    }
    function row(item){
      var indicators=item.indicators||{},country=item.country||{},currency=item.currency||{};
      return '<div class="calendar-row"><span>'+displayDate(selected).day+'</span><span>'+displayTime(item.publishTime)+'</span><span><b>'+escapeHTML(currency.code||'—')+'</b><small class="calendar-meta">'+escapeHTML(country.countryName||'—')+'</small></span><span class="calendar-event">'+escapeHTML(item.title||'—')+'</span><span class="calendar-value">'+displayValue(indicators.actual,indicators.potencySymbol)+'</span><span class="calendar-value">'+displayValue(indicators.forecast,indicators.potencySymbol)+'</span><span class="calendar-value">'+displayValue(indicators.previous,indicators.potencySymbol)+'</span>'+impact(Number(item.volatility)||0)+'</div>';
    }
    function render(){
      var dateButtons=[-2,-1,0,1,2].map(function(offset){
        var value=offsetDate(selected,offset),label=displayDate(value),current=value===selected;
        return '<button class="calendar-date-button" type="button" aria-pressed="'+current+'" data-calendar-date="'+value+'"><span>'+label.weekday+'</span><b>'+label.day+'</b></button>';
      }).join('');
      var tabs=[['data','数据'],['events','事件'],['holidays','假期'],['featured','精选']].map(function(tab){
        return '<button class="market-tab" type="button" role="tab" aria-selected="'+(active===tab[0])+'" data-calendar-type="'+tab[0]+'">'+tab[1]+'</button>';
      }).join('');
      var body=state.loading&&!state.rows.length?'<div class="calendar-empty" role="status">正在加载财经日历…</div>':state.rows.length?'<div class="market-calendar-head"><span>日期</span><span>时间</span><span>国家 / 货币</span><span>数据</span><span>实际</span><span>预测</span><span>前值</span><span>波动</span></div>'+state.rows.map(row).join(''):'<div class="calendar-empty"><strong>该日期没有匹配的日历项目</strong>请切换分类、日期，或选择更多日期。</div>';
      var load=state.count<state.total?'<button class="calendar-load-more" type="button" data-calendar-load-more '+(state.loading?'disabled':'')+'>'+ (state.loading?'正在加载…':'加载更多日历')+'</button>':state.rows.length?'<p class="calendar-end">已显示该日期的全部日历项目</p>':'';
      var error=state.error?'<p class="calendar-error" role="status">'+escapeHTML(state.error)+' <button type="button" data-calendar-retry>重试</button></p>':'';
      root.innerHTML=pageHero('财经日历','关键数据，在 <em>公布前准备</em>','按数据、事件、假期与精选查看市场日程。时间为 WIB（UTC+7）。',{href:'economic-calendar.html',label:'市场'})+'<section class="market-content"><div class="market-wrap"><div class="market-section-head"><div><h2>财经日历</h2><p>选择日期和类型，查看公布时间、前值、预测与实际结果。星点越多，表示潜在波动关注度越高。</p></div><span class="market-source">数据由财经日历内容接口提供</span></div><div class="market-panel calendar-panel"><div class="market-controls"><div class="calendar-controls-row"><div class="market-tabs calendar-type-tabs" role="tablist" aria-label="日历分类">'+tabs+'</div><button class="market-toggle" type="button" aria-pressed="'+isImportant()+'" data-calendar-important '+(active==='featured'?'disabled aria-disabled="true"':'')+'>只看重要</button><div class="calendar-date-rail" aria-label="五日日期选择">'+dateButtons+'</div><label class="calendar-picker"><svg class="calendar-picker-icon" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg><span class="sr-only">选择更多日期</span><input type="date" aria-label="选择更多日期" value="'+selected+'" data-calendar-picker></label></div></div>'+body+'<div class="calendar-pagination">'+error+load+'</div></div></div></section>';
      root.querySelectorAll('[data-calendar-type]').forEach(function(button){button.addEventListener('click',function(){active=button.dataset.calendarType;setQuery('type',active);resetAndLoad();});});
      root.querySelectorAll('[data-calendar-date]').forEach(function(button){button.addEventListener('click',function(){selected=button.dataset.calendarDate;setQuery('date',selected);resetAndLoad();});});
      root.querySelector('[data-calendar-picker]').addEventListener('change',function(event){selected=normaliseCalendarDate(event.target.value);setQuery('date',selected);resetAndLoad();});
      var pickerWrap=root.querySelector('.calendar-picker');
      if(pickerWrap){pickerWrap.addEventListener('click',function(event){var input=pickerWrap.querySelector('input[type="date"]');if(!input)return;event.preventDefault();try{if(typeof input.showPicker==='function'){input.showPicker();}else{input.focus();}}catch(error){input.focus();}});}
      var importantButton=root.querySelector('[data-calendar-important]');
      if(importantButton)importantButton.addEventListener('click',function(){if(active==='featured')return;important=!important;setQuery('important',String(important));resetAndLoad();});
      var loadButton=root.querySelector('[data-calendar-load-more]');
      if(loadButton)loadButton.addEventListener('click',loadMore);
      var retryButton=root.querySelector('[data-calendar-retry]');
      if(retryButton)retryButton.addEventListener('click',loadMore);
    }
    function resetAndLoad(){state={page:0,total:0,count:0,rows:[],loading:false,error:''};render();loadMore();}
    function loadMore(){
      if(state.loading||(state.total&&state.count>=state.total))return;
      state.loading=true;state.error='';render();
      fetch(apiUrl(),{headers:{'X-Language':'zh-CN'}}).then(function(response){if(!response.ok)throw new Error('request');return response.json();}).then(function(payload){
        var value=payload&&payload.value;
        if(!value||!Array.isArray(value.list))throw new Error('invalid');
        state.page=value.pageNum||state.page+1;
        state.total=Number(value.total)||0;
        state.count+=value.list.length;
        state.rows=state.rows.concat(value.list);
      }).catch(function(){state.error='暂时无法加载财经日历，请检查网络后重试。';}).finally(function(){state.loading=false;render();});
    }
    render();
    loadMore();
  }
  document.addEventListener('DOMContentLoaded',function(){calendar();news();signalList();signalDetail();});
}());
