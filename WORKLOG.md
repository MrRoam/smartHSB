# SmartHSB 执行记录

## 2026-11-14 · 首页删除「交易之外，还有更多值得期待」积分横幅

**需求**：用户要求去掉 rewards 区块（交易之外/了解积分奖励/查看当前活动/rewards-orbit 插画）。

**实施**：index.html 整段删除 `<section class="rewards-section" id="rewards">…</section>`（24 行）；CSS 中残留 .rewards-section 规则不再生效，暂保留不清理。全站无 #rewards 锚点引用；rewards.html / promotions.html 页面本身不受影响。

**验证**：#rewards 已不存在；行业奖项区块与上一区块衔接正常无空白异常；0 JS 错。

## 2026-11-14 · 首页市场区块背景改灰色（对齐资金区块）

**需求**：#markets 大背景原为淡蓝 --ice(#EEF5FF)，改为资金区块同款灰色调。

**实施**：home-minpilot.css `.home-minpilot .markets` 背景由 `var(--ice)` 改 `var(--soft)`（#F6F6F6）。其余（极光边框白卡、tabs、内边距）不动。

**验证**：实测 markets 与 funding-section 背景均 rgb(246,246,246)；截图核对灰底上极光边框白卡与文字清晰；0 JS 错。
- bump：home-minpilot 4027758987（index.html）。

## 2026-11-14 · 首页 APP 区背景改为左白右蓝绿（右下泛白修复）

**需求**：上一版(cb50edf)整块铺蓝绿改错了——用户要求保持原图：左侧白底，仅右侧蓝绿渐变一直延伸到底（右下圈出处不再泛白）。

**实施**：home-minpilot.css 两处 `.home-minpilot .platform::before` 统一改为 `linear-gradient(102deg,#FFF 0% 30%,#F4FAF8 48%,#E9F5F3 64%,#DFF8EB 84%,#D8F4E7 100%)`——左侧 30% 之前纯白，向右经多档中间色平滑过渡到蓝绿，右下角（102deg 梯度最深处）为 #D8F4E7，全高覆盖无泛白。

**验证**：1440/390 截图核对——左侧文字区白底、右侧整列含右下角与底部声明行均为蓝绿、无生硬接缝；移动端 0 横向溢出、0 JS 错。
- bump：home-minpilot 164e9ba3d1（index.html）。

## 2026-11-14 · 首页 APP 区背景改蓝绿渐变铺满（底部不再泛白）

**需求**：#platform 区背景泛白（圈出底部免责声明一带），要求蓝绿渐变一直延伸到底。

**说明**：用户已在界面回退 bc90bae（HERO 参考稿光晕版），本次在其回退后的状态上直接改为铺满式渐变，一并落定回退产生的未提交文件状态。

**实施**：home-minpilot.css 两处 `.home-minpilot .platform::before`（88 行桌面 / 400 行移动端覆写）统一改为 `linear-gradient(118deg,#E9F2FF 0%,#E3F5F1 46%,#DFF8EB 100%)`，radial 光斑全部移除；渐变随 `inset:0` 铺满整块（含底部 stage-caption 免责声明行）。

**验证**：1440 截图核对——渐变从顶部延伸到底部、无白色断层，手机模型/浮动卡/按钮/免责声明清晰；0 JS 错。
- bump：home-minpilot b7dfe6657a（index.html）。

## 2026-11-14 · 首页世界地图点阵改浅绿

**需求**：地图当前偏灰，用户要求改浅绿更亮丽。

**实施**：world-map.svg 两处 stop `#9FB4CB`（蓝灰）→ `#A6D9BF`（浅薄荷绿，单色均匀）；index.html 引用版本参数 `?v=20261114b`。深绿航线（#20a88c/#01a66b）与端点在浅绿底图上仍清晰分层。

**验证**：截图核对——点阵均匀浅绿、画面亮丽干净，航线/端点/标签卡可辨，0 JS 错。

## 2026-11-14 · 首页 overview 标题合并为一句一行

**需求**：「一个账户 / 打开全球市场」两行标题合并为一句、桌面一行显示。

**实施**：
1. index.html：标题改为「一个账户，打开全球市场」，逗号后加 `<br class="h2-br-m">`（窄屏断行锚点）。
2. home-minpilot.css：`.h2-br-m` 桌面 display:none（单行），≤600px display:inline（逗号后自然断行，避免“打/开”被拆开）。
3. type-in.js 修复：segments/splitChars 重建 DOM 时 `<br>` 会丢 class，两处（segments 收集 28 行、pieces 透传 46 行、重建 79 行）补 `cls` 透传，重建后的 br 保留原类名，CSS 断行控制对动画后的 DOM 依然生效（顺带修复所有页 type-in 场景同类问题）。

**验证**：桌面 1280 标题单行（h2 高 72px ≈ 一行）；390 移动端在逗号后两行整齐断行；licenses 内页 type-in 动画抽查正常；0 JS 错。
- bump：home-minpilot b8d6c000d6（index.html）、type-in.js 8719720f4b（35 页）。

## 2026-11-14 · 首页世界地图底图去渐变（干净化）

**需求**：首页 overview-world 地图背后的蓝/绿渐变光晕显脏，去掉渐变色让图更干净。

**实施**（两处）：
1. `assets/img/home/world-map.svg`：点阵 stroke 的 `land` 渐变（#4f91c3→#34ac83 蓝→绿）两处 stop 统一为单色 `#9FB4CB`（柔和蓝灰），点阵整幅均匀一色；index.html 引用加 `?v=20261114` 防缓存。
2. home-minpilot.css `.home-minpilot .map-glow`：去掉双 radial-gradient（左蓝 #badcff / 右绿 #c4efe3 + blur）改为 `display:none`，整块背景回归纯白。

**验证**：截图核对——背景纯白、点阵单色浅蓝灰、绿色航线与端点、四枚白色标签卡均清晰；390 移动端 0 横向溢出、0 JS 错。
- bump：home-minpilot 01895f111e（index.html）。

## 2026-11-14 · 真实账户页「支持」四卡加彩虹渐变描边

**需求**：account-real「HSB 为真实账户提供的支持」四张 .kv 卡（专属促销/账户等级/积分与奖励/1对1导师课）加与首页入金/出金两卡同款渐变边框。

**实施**：site-light.css 末尾新增 `.internal-site[data-page="account-real"] .kv`：`border:2px solid transparent` + 双层 background-clip（白底 padding-box + 同款 180deg 五色渐变 border-box），去投影；radius/内边距沿用原值。作用域限定 account-real 页，不影响 learn-risk 的 .kv 灰边样式。

**验证**：1280/390 截图核对——四卡描边渐变均匀、文字无压边；移动端 0 横向溢出、0 JS 错。
- bump：site-light 92aa5740d9（34 页）。

## 2026-11-14 · 首页保险说明盾形图标加淡绿徽章底

**需求**：参照「01」序号徽章样式，给 funding 区 insurance-note 的对勾盾形图标加底色。

**实施**：home-minpilot.css 新增 `.home-minpilot .funding-details .insurance-note>.mini-shield`：34×34、去描边、圆角 10px、底色 #E7F7F0、对勾 #006C45、字号 14px（与内页图标/序号徽章 token 同色系）。

**验证**：实测渲染 34×34、rgb(231,247,240)/rgb(0,108,69)/radius 10px，截图核对与文字对齐良好，0 JS 错。
- bump：home-minpilot 13e8074b2e（index.html）。

## 2026-11-14 · 首页「入金 / 出金」两张卡加彩虹渐变描边

**需求**：参照次按钮（iris-shell「试用模拟账户」胶囊）的渐变边框，给首页 funding 区两张白卡加同款描边。

**实施**：home-minpilot.css `.home-minpilot .funding-details>div`（335 行，现行生效规则）由 `border:1px solid var(--line)+白底` 改为双层 background-clip 渐变描边：`border:2px solid transparent` + `linear-gradient(#fff,#fff) padding-box` + `linear-gradient(180deg,#ffeab5 20%,#f2a85d 40%,#8052e4 60%,#2e85ea 80%,#68efae 100%) border-box`（与 iris-shell 同一渐变、同一垂直方向），不占布局、圆角 20px 保持。仅 index.html 引用该 css。

**验证**：1280/390 截图核对——两卡描边呈 黄→橙→紫→蓝→绿 垂直渐变、圆角处均匀、文字无压边；移动端 0 横向溢出、0 JS 错。
- bump：home-minpilot aaff8f3800（index.html）。

## 2026-11-14 · 许可证与认证页白灰交替节奏

**需求**：licenses 页各区块大背景按 白、灰交替，提升视觉节奏（用户指定以行业奖项的灰色调为基准）。

**实施**：licenses.html 三段区块改灰底 `#F3F4F6` + 上下 1px 分隔线（沿用 ISO 区块原有 inline 模式）：#awards 行业奖项（原白底）、ISO 认证（var(--card)→#F3F4F6）、FAQ 合规常见问题（原白底）。牌照/资金保险/谨防诈骗/CTA 保持白底。

**验证**：逐区块读取计算背景色——hero 白、牌照 rgba(0,0,0,0)(白)、奖项 #F3F4F6、保险 白、ISO #F3F4F6、诈骗 白、FAQ #F3F4F6、CTA 白，白灰交替成立；整页截图核对灰白衔接自然、卡片清晰，0 JS 错。

## 2026-11-14 · 许可证与认证页新增「客户资金保险」区块

**需求**：在 licenses.html「行业奖项」之后增加客户资金保险内容（属许可证与认证范围），原页面内容不动，仅增项并保证整页协调。

**实施**：新增 `<section id="insurance">`（kicker Fund Protection），复用出入金页同款结构——`.ins-aurora.aurora-frame` 极光底框 + 内层 `.cert-band` 白卡（$1,000,000 色块 / 隔离账户与承保两段正文 / 四重保障提示条 / aswata + wtw 标识行），文案口径与 deposit-withdraw 完全一致，提示条内链接改指「入金与出金 →」。site-light.css `.ins-aurora` 作用域扩展至 `[data-page="licenses"]`（3 处选择器同步）。

**验证**：1280/390 截图核对——新区块渲染正常；整页节奏 行业奖项 → 资金保险（极光白卡）→ ISO 认证（灰底 cert-band）→ 防诈骗 → FAQ 衔接协调；移动端 0 横向溢出、0 JS 错。
- bump：site-light b11f578a71（34 页）。

## 2026-11-14 · 出入金页资金保险卡加极光底框

**需求**：参照账户卡（demo 页）样式，给 deposit-withdraw「客户资金保险」白卡加渐变极光底色。

**实施**：`.cert-band` 外包一层 `.ins-aurora.aurora-frame`（复用 site-motion.css 通用底框），site-light.css 末尾新增作用域段：`--aurora-bg:#EEF5FF / size:125% / pad:20px / radius:16px / shadow:none`，内层 cert-band 去投影，移动端 pad 收 14px。白卡内容零改动。

**验证**：1280/390 截图核对——外层淡蓝渐变底框 + 内层白卡，$1,000,000 色块、两段正文、四重保障提示条、aswata/wtw 标识均正常无压边，0 JS 错。
- bump：site-light 9747f71246（34 页）。

## 2026-11-14 · 数据表表头统一改淡绿底（对齐图标/序号徽章 token）

**需求**：平台教程/知识中心等内页的表头原为浅蓝灰底（--site-surface-blue + 中性灰字），统一改为序号徽章同款淡绿底 + 深绿字。

**实施**：site-light.css 表头规则由 `:is(table.spec th,.qhead)` 改为 `:is(table.spec th,.qhead,.hc-a thead th)`，底色/字色改 `var(--site-ic-bg)/var(--site-ic-ink)`（#E7F7F0 / #006C45）。新增 `.hc-a thead th` 覆盖帮助中心 FAQ 内 59 张裸 `<table>`（原 page.css #EEF5FF 浅蓝被覆盖）。覆盖面：learn-* ×4、tutorial-* ×4、deposit-* ×4、products、fraud-warning、economic-calendar、help、live-quotes（.qhead）。

**验证**：tutorial-open / help（展开 FAQ）/ live-quotes 三处实测底色 rgb(231,247,240)、字色 rgb(0,108,69)，截图核对表头与正文区分清晰。
- bump：site-light 1ab8e6d1fc（34 页）。

## 2026-11-14 · 隐私政策页分组标题框压边修复 + 移动端多列列表断点失效修复

**根因 1**：`.internal-site .doc-grp` 给 h3 加了边框圆角白底，但基础规则无 padding，标题文字贴框左上缘。修复：加 `padding:12px 16px`（margin 微调 20px 0 10px）。
**根因 2（顺带发现）**：移动端 ≤600px 收单列的覆写选择器写成了 `.doc-grp .cols3`，但 HTML 中 h3.doc-grp 与 ul.cols3 是平级而非嵌套，选择器永远匹配不到——390px 下三列列表一直被挤压换行。修复：改为 `.internal-site ul.cols3, .internal-site ul.cols2{grid-template-columns:1fr}`（cols2 同步收单列）；桌面列数不变（3/2）。

**验证**：390 实测 cols3/cols2 均 1 列、1440 保持 3/2 列；标题框文字四周留白；privacy-policy × 1440/768/390 零溢出零 JS 错。
- bump：editorial-pages 77dfe061ce（17 页）。

## 2026-11-14 · 隐私政策页联系方式键标签压边修复

**根因**：privacy-policy 底部 doc-contact 的键标签（电子邮箱/官方网站/地址）浅蓝底块被 flex 默认 stretch 拉伸到整行高度（"地址"行值文字换行后行很高），文字行盒贴块上下缘。

**实施**：editorial-pages.css `.internal-site .doc-ck` 加 `padding:5px 8px; border-radius:4px; align-self:center`（flex-basis 84px 保持，border-box 全局生效）。bump：editorial-pages 39fe0d1ff9（17 页）。

**验证**：键块高 30px、文字四周留白；桌面/390 截图核对（地址行块居中、值多行正常）；privacy-policy × 1440/768/390 零溢出零 JS 错。

## 2026-11-14 · 帮助中心 FAQ 文字压边修复

**根因**：editorial-pages.css 把 help 页 FAQ 的内边距覆写为左右 0（.faq-q `21px 0`、.faq-a `0 0 24px 0`），问题与答案文字直接贴到列表容器边缘。

**实施**：.faq-q 左右 12px、.faq-a 左右 12px（与问题对齐）、移动端 ≤600px 收为 10px。bump：editorial-pages 14c481c4fa（17 页）。

**验证**：展开态实测问题文字与答案段落左缩进均为 12px（相对卡片）；help 页 1440/768/390 零溢出零 JS 错；截图核对。

## 2026-11-14 · 初步定版推送 GitHub Pages

**动作**：`git push origin main` 0692fef → 1c9e933，累计 54 个本地提交一次性推送；GitHub Pages 自动部署完成。

**线上校验**：https://mrroam.github.io/smartHSB/ ，tutorial-trade/manage 资源串已是 platform-pages.css?v=5cb2b14061（最新）；index / products / help / live-quotes / tutorial-manage 均 200；tutorial-manage 线上 HTML 路径条为 5 项、当前页项无 href 无箭头、其余 4 项带 ↗。

## 2026-11-14 · 路径条恢复箭头 + 可跳转项文字标蓝

**实施**：4 个教程页为带 href 的 4 项恢复 ↗（当前页项不带）；新增 `.tutorial-path>a[href]{color:var(--site-blue)}`，箭头 color:inherit 同步标蓝（opacity .75）；当前页项无 href 保持深墨 #1D1D1F 不标蓝。两端均匀分布布局保持不变（箭头紧贴文字后，不再悬空）。移动端 ≤760px 箭头隐藏（5 列太窄）。bump：platform-pages 5cb2b14061（7 页）。

**验证**：manage 页 4 项 rgb(35,93,254)+1 箭头、当前项深色 0 箭头；trade 页同理；桌面/390 截图核对；4 页×1440/768/390 零溢出零 JS 错。

## 2026-11-14 · 路径条去箭头 + 五项两端均匀分布

**根因**：每项的 ↗ 用 margin-left:auto 右对齐在自己格子的最右缘，视觉上像贴在下一项前面的分隔符；最后一项的箭头悬在最右端成了孤立元素（用户红圈）。

**实施**：4 个教程页移除路径条内全部 4 个 ↗（含 aria-current 规则对 >i 的引用一并清理）；桌面布局由 5 等分网格改为 flex space-between——首项贴左、末项贴右、中间间距均匀（实测四段间距均 260px），05 交易 正好落到原箭头位置；移动端媒体查询恢复 5 等分网格。bump：platform-pages cccb1b88b0（7 页）。

**验证**：桌面 1440 两页实测 lastRightGap/firstLeftGap=0、gaps 全等；截图核对无箭头残留；移动 390 五项两行式排布正常；4 页×1440/768/390 零溢出零 JS 错。

## 2026-11-14 · 修正：教程页路径条保留 5 项，仅当前页项去箭头

**背景**：上一轮误把「去掉当前页箭头」理解成「删除当前页整项」，用户指出 05 交易 被误删。

**实施**：4 个教程页路径条恢复 5 项完整顺序；当前页项改为 `<a aria-current="page">`（无 href、无箭头，cursor:default、不跟 hover 位移，保留深色高亮与绿色序号），其余 4 项保持链接+箭头；platform-pages.css 网格恢复 repeat(5) 列并追加当前项规则。bump：platform-pages 93dcc2258e（7 页）。

**验证**：4 页均为 5 项、当前项文字在且 0 箭头、其余 4 项各 1 箭头、5 列均匀分布、零 JS 错；trade 页截图核对；4 页×1440/768/390 零溢出。

## 2026-11-14 · 教程页学习路径条移除当前页自链接

**目标**：用户指出 tutorial-path 路径条里指向当前页自身的链接（aria-current="page"）多余，应去掉。

**实施**：4 个教程页（install/open/manage/trade）各移除 1 个自链接项，每页剩 4 项；编号保持全局路径位（如 install 页显示 02 开户…05 交易，trade 页显示 01 安装…04 资金），用户可据此判断自己处于五步路径的第几步；platform-pages.css 路径网格 repeat(5→4) 列。bump：platform-pages 3d2f8789da（7 页）。

**验证**：4 页均无自链接、4 列均匀分布、零 JS 错；桌面截图核对无孤立箭头；4 页×1440/768/390 零溢出。

## 2026-11-14 · 正文序号徽章放大（用户反馈偏小）

**实施**：.prose h2 i 徽章 26×26/12.5px → **32×32/14.5px**（radius 9、margin-right 13、vertical-align 3px），600px 以下收为 28×28/13px；侧栏菜单序号 9px → 10.5px（subpages.css 与 platform-pages.css 两处）。覆盖全部 13 个带序号页（含原有的 user-agreement/privacy-policy）。

**验证**：桌面/390 截图核对徽章与标题比例协调；35 页×3 档零溢出零 JS 错。
- bump：subpages 1aed9d1544(34 页)、platform-pages 57fd6856a7(7 页)；page.css 无版本号直接生效。

## 2026-11-14 · 知识中心/平台教程等 11 页正文标题补「数字+绿底」序号徽章（对齐条款与条件页）

**目标**：参照 user-agreement / privacy-policy 的展示（左侧 chp-nav 菜单 01/02/03…，正文 h2 前有同号「数字+绿底」徽章），补齐其余带侧栏序号导航页面的正文徽章，实现左右对应。

**排查（脚本全站比对侧栏序号 vs 正文徽章）**：11 页缺失——deposit-bank(8)/deposit-ewallet(6)/deposit-va(8)/learn-basic(7)/learn-risk(8)/learn-technical(8)/learn-terms(10)/tutorial-install(7)/tutorial-manage(7)/tutorial-open(6)/tutorial-trade(6)，共 81 个标题；user-agreement、privacy-policy 本已齐。

**实施**
- 11 页正文 h2/h3（带 id=sN）按侧栏编号前插 `<i>NN</i>`（脚本按 nav 映射注入，site-motion.js 对 .motion-heading 只做整块位移动画、不拆文本，插入安全）。
- 徽章色统一：page.css `.prose h2 i` 与 site-light.css `.doc-sec>h2>i` 由两套近似的绿（#F1FFF7/#E8F8F0）统一改用 `--site-ic-bg/--site-ic-ink`。
- bump：site-light 2f07ea922c(34 页)；page.css 无版本号直接生效。

**验证**：13 个相关页 nav 序号与正文徽章一一对应、徽章计算样式唯一 rgb(231,247,240)/rgb(0,108,69)、零 JS 错；learn-basic/tutorial-install 截图核对；35 页×3 档零溢出。

## 2026-11-14 · 知识中心 4 个板块序号底色改图标规范色

**实施**：learn.html 4 个序号标签加 `ic-tag-num` 修饰类（与其余页 ic-tag 文字标签区分，避免误伤）；site-light.css 在 .ic-tag 蓝色规则后追加 `.ic-tag-num{background:var(--site-ic-bg);color:var(--site-ic-ink)}`。bump：site-light bd340756b6(34 页)。

**验证**：learn.html 实测 01–04 均 rgb(231,247,240)/rgb(0,108,69)，同页其它 ic-tag（无 ic-tag-num）不受影响，零 JS 错，截图核对通过。

## 2026-11-14 · 全站图标徽章底色统一（规范色 #E7F7F0 + #006C45）

**目标**：用户指定以参考截图实测色 rgb(231,247,240)=#E7F7F0 底 + rgb(0,108,69)=#006C45 图标线条为准，全站排查统一。

**排查（Playwright 全站 35 页计算样式扫描）**：图标徽章共 6 类。已是规范色：.cc-ic(4 页 16 处)、.f-ic(3 页 22 处)；偏差：help 页 .hc-cc-ic/.hc-cat-ic/.hc-way-ic 用了浅一档 #F1FFF7（上轮误用 surface-mint）；demo 注册 .rc-ic 与下载页三端 .dl-ic 为浅蓝底灰字。排除项：.ic-tag（文字标签胶囊非图标）、.ins-chip（保险公司 logo 容器，保持中性）、.mp-pin（地图实心圆 pin）、.dv-pf（设备样机内浮层）、page.css .dl-ic-apple/android/win 品牌色定义（已被 page-download 覆盖，未生效，保留）。

**实施**
- site-light.css 新增规范 token `--site-ic-bg:#E7F7F0; --site-ic-ink:#006C45`，`.motion-card :is(.ic-ic,.f-ic,.cc-ic)` 改用 token。
- editorial-pages.css：help 三类图标 → token（修正上轮 #F1FFF7）。
- page.css：.hc-way-ic、.rc-ic → token（rc-ic 边框改 transparent）。
- trading-pages.css：page-demo .rc-ic 覆写 → token。
- platform-pages.css：下载页 .dl-ic → token（原浅蓝灰字）。
- bump：site-light 6225f47add(34 页) / editorial f6b58db23f(17) / trading a88a64e75f(10) / platform ed04f715fb(7)。

**验证**：全站图标徽章计算样式唯一组合 rgb(231,247,240)/rgb(0,108,69)；download/demo 截图核对；35 页×1440/768/390 零溢出零 JS 错。

## 2026-11-14 · 帮助中心图标底色统一为薄荷绿

**目标**：用户指定 help.html 图标底色统一为站内薄荷绿语言（--site-surface-mint 底 + --site-green 线条，与导航 hover/页签选中一致）。

**实施**：editorial-pages.css 两处（均 page-help 作用域）——8 张分类卡 `.hc-cc-ic` 与各分类区头 `.hc-cat-ic` 由「浅蓝底 + 灰字」改为「薄荷绿底 + 深绿字」。bump：editorial-pages.css v=eed8dafca3（17 页引用）。

**验证**：help.html 实测 8 枚 .hc-cc-ic 与 .hc-cat-ic computed 均为 rgb(241,255,247)/rgb(0,108,69)，样式唯一、零 JS 错，截图核对通过。

## 2026-11-14 · 交易品种页「品种明细与参数」对齐实时报价页风格

**目标**：products.html 品种明细模块按 live-quotes「全量行情」模块语言重做——表格加极光底色框、模块大背景改白。

**根因/现状**：该模块原为浅蓝大底（--site-surface-blue）上直接铺 tabs + 白色 tbl-wrap（方角、底部分割线），与实时报价页「白区 + 极光框 + 白卡」语言不一致；且 tabs 选中态被 site-light 的柠檬绿规则（同权重后加载）压过 trading-pages 的下划线规则。

**实施**
- products.html：搜索工具栏 + tabs + 4 张品种表 tab-panel 包进 `.spec-aurora.aurora-frame`，内层再包 `.spec-card` 白卡（对齐实时报价 .mkt 白卡语言）；保证金说明 note 保持框外。
- site-light.css 新增 products 作用域段：页面大背景改白；`.spec-card` 白卡 14px 圆角 + overflow hidden；工具栏/tabs 左右 24px 内边距；`.tbl-wrap` 去边框方角改透明白；tabs 选中态覆写为「深墨下划线」（0,5,0 胜出柠檬绿规则）；tab 计数徽章改浅蓝底；600px 断点 pad 14px / 边距 17px。
- bump：site-light.css v=1acf72624b（34 页）。

**验证**：桌面 1440 与移动 390 截图核对（极光框、白卡、下划线 tabs、浅蓝表头均正确）；搜索过滤「显示 1 / 2 个品种」、tab 切换 forex 正常、零 JS 错；全站 35 页 × 1440/768/390 零溢出。

## 2026-11-14 · 走查 P1 批量收口：主按钮 / 表头 / 卡片 hover（P1-4/5/6，P1-7 上午已完成）

- **P1-4 主按钮**：实测全站 32 页 `.btn-primary` 本就统一为蓝绿渐变（走查报告误判——site-light.css 里柠檬绿规则在第 148 行渐变规则之前，同权重被覆盖）。本轮删除柠檬绿死规则（#BFFF37+深字+hover 位移）与 `cta-band` 蓝色死规则（类名全站无使用，改指 .btn 同渐变）。柠檬绿仅保留 tabs 选中态等标签用途。
- **P1-5 表头**：`table.spec th` + `.qhead`（14 页）浅绿 #F1FFF7/深绿字 → 浅蓝 `--site-surface-blue`(#EEF5FF)/中性灰 `--site-muted`(#606062)；help 页 `.hc-a thead th`（#F5F8FD/深墨）同步。实测 deposit/live-quotes/products/economic-calendar 四页 computed 一致。
- **P1-6 卡片 hover**：统一为「2px 彩虹渐变描边 + 浅蓝填充，零位移零阴影」。描边用 `::before + mask(xor)` 遮罩绘制（padding:2px 只留边缘，不占布局、无 2px 文字抖动，opacity 220ms 淡入）；覆盖 `.motion-card`（全站白卡）、`.acct`、`.cmp`、trading-tools 三卡。旧规则清理：page.css 的 `.icard/a.icard/.art/.acct` 位移、style.css 的 `.feat`、subpages.css 归零规则去 `.feat`、trading-pages.css 账户卡浅蓝平铺、site-light.css 账户卡上浮+阴影与 motion-card 的 `translate:0 -4px`+光斑（focus-within 同步）。保留分支：平铺分割线卡片无反馈、资讯列表 `.art` 走 fill-hover 深色铺满、help 8 卡沿用 2026-11-13 的 border 版彩虹边（避免与 `.motion-link::before` fill-hover 冲突）。
- **P1-7 极光底框**：上午已完成（.aurora-frame 通用类 + 39 处挂类，提交 dc73c70），本次核对无误。
- bump：site-light 0c69fb5ec4（34 页）/ subpages ee1785c384（34 页）/ trading-pages 3ef2027eab（10 页）；page.css 与 style.css 无版本号引用，直接生效。
- 验证：35 页 × 390/768/1440 三档零溢出、零 JS 错误；卡片 hover 终态实测（account-types/about/trading-tools/account-real/download）= 浅蓝底 #EEF5FF + 无渐变图 + ::before opacity 1 + 无 transform；Real 卡彩虹描边圆角完整、内容清晰（截图核对）。
- 仅本地提交。

## 2026-11-14 · hero-ticker / 页脚点阵补 reduced-motion（走查报告 P0-3）

- 排查结论：`world-points.js` 实为纯点阵坐标数据（无任何动画代码），走查报告判为缺失属误报；真正的绘制与动效控制在 `column-home.js` 的 `pointMap()`，彼处 `motion` 判定（系统 reduce / body.motion-off）早已完备。仅在 world-points.js 头部补职责注释，防止下次误判。
- 实际缺口在 `hero-ticker.js` + `site-light.css`：内页 hero 提示条此前只依赖 CSS 的 `@media (prefers-reduced-motion)` 静态规则，JS 仍测量宽度并写入 `--ticker-*`；且页内动效开关（body.motion-off，subpages.js 分发）关闭后提示条仍会滚动。
- 修复：hero-ticker.js 重写 layout——系统 reduce 或 body.motion-off 时移除 `--ticker-from/to/dur` 与 `is-static`，交给 CSS 静态居中；监听 `prefers-reduced-motion change` 与 `smarthsb-motion-change` 事件，开关切换即时恢复/静止。site-light.css 新增 `.internal-site.motion-off .hero-ticker__track{animation:none;width:100%;justify-content:center}`（与系统 reduce 规则同构）。
- 验证（Playwright 双上下文实测）：reduce → animation none、0 帧重绘、提示条居中完整无裁切、`--ticker-from` 为空；no-preference → tickerSlide 正常滚动（约 45px/s）；手动点动效开关 → 立即静止（animation none）。页脚点阵 reduce 下 0 帧、no-preference 下 31fps，符合预期。
- 版本：hero-ticker.js bump af7d5c4baf（34 页）、site-light.css bump 847bf4767b（34 页），仅本地提交。

## 2026-11-14 · 首页 M-06 倾斜横向溢出修复（走查报告 P0-1）

- 问题实测：1440/1280/1024 视口 docScroll 各超出 137/142/131px（768 超出 172），源自 M-06 倾斜中间态把 1280 宽卡片撑到约 1714；此前靠 `html.js{overflow-x:hidden}` 兜底，滚动条虽隐藏但内容尺寸仍超宽，且劫持根滚动容器。
- 修复：裁切改放 `.markets` 整幅区块 `overflow-x:clip`（边界=屏幕边缘，圆角不被切）；移除 html 级 hidden 与 ≤767px 的 `.tilt-stage` clip 兜底；tilt-up.css 顶部写明裁切位置约定。
- 验证：四档宽度 docScroll 全部归位且不可横向滚动；全站 35 页 × 4 档复检零溢出；倾斜中间态截图两侧自然出画无切边。tilt-up.css bump 4f15f22f6a / home-minpilot 0b27a33716，提交 51d4ca4，仅本地。

## 2026-11-14 · 极光底框收口为 .aurora-frame 通用类（走查报告 4.1）

- site-motion.css 新增 `.aurora-frame` 通用件（35 页共享），底框全部参数化为 `--aurora-bg/image/size/pos/pad/radius/shadow` 七个变量，全站唯一实现；39 处底框（6 处定制框 + 32 处 M-07 motion-aurora）挂类、删除各自复制粘贴的背景/内边距/圆角/投影声明，只留变量覆盖；媒体查询断点同步改变量。
- 清理：trading-pages.css 删除遗留「账户对比扁平表格」容器规则（唯一使用页 account-types 已改极光框，且 0,3,0 权重会盖掉通用件，曾致 padding/background 丢失）；home-minpilot 删 tilt-stage 残留 padding 规则。
- 验证：39 处 computed padding/size/pos/radius/shadow 与改前逐项一致（脚本扫描 PROBLEM:0）；900/600/479/359 断点覆盖生效；六模块截图（账户卡/权益/工具/行情/日历/首页品种表）视觉无变化。三份 css bump（site-motion affbfa7239 / site-light 2702f56c29 / home-minpilot 3db77d0736 / trading-pages 29facaa967），提交 dc73c70，仅本地。

## 2026-11-14 · 财经日历页：事件区改白 + 表格极光底框 + 使用说明区改灰

- trade-calendar-workspace 背景改白；列表/周视图两个 .tbl-wrap 各外包 .cal-aurora 极光底框（同行情表语言，白表 14px 圆角去边框），周视图提示行在底框外；「如何使用财经日历」inline style 改 #F6F6F6 灰块。site-light.css bump c623458c71，提交 abab1d5。
- 验证：桌面全页截图——事件区白、极光框内表格正常、灰块 1940–2450px 精确覆盖使用说明区、FAQ 白、页脚灰，层次分明；390px 无横向溢出、表格在框内正常滚动。仅本地提交，暂不推送。

## 2026-11-14 · 实时报价页大背景改白

- 用户要求页面大背景改白色。page-hero 与 trade-market-workspace 原 --site-surface-blue(#EEF5FF) 改白，表头/徽章/hover 点缀色不动；页脚 #F6F6F6 全站统一背景保留。site-light.css bump f7540896b8，提交 0433c6f。
- 验证：全页截图采样，hero/workspace/FAQ 区均为纯白。仅本地提交，暂不推送。

## 2026-11-14 · 实时报价页行情表加极光底框

- 用户要求参照账户类型页给 live-quotes 行情表加底色。
- 实施：.mkt 白卡外包 .mkt-aurora（aurora-mesh.svg 170%/45%、24px 内边距、20px 圆角、同款投影），白卡圆角 8→14px；≤600px padding 14px。页面动效未触碰。site-light.css bump 37a2d6ea39，提交 c66a737。
- 验证：桌面 1280 / 移动端 390 截图，底框四边均匀、无横向溢出、卡内内容正常。仅本地提交，暂不推送。

## 2026-11-14 · 首页品种表加极光底框

- 用户要求参照账户类型页给首页 #markets 品种表加底色框，动效不变。
- 实施：极光底框做在 .market-explorer（M-06 倾斜目标）上，内部新增 .market-explorer-inner 白卡承载原内容 —— 底框随卡片一起后仰扶正（先试过底框放 .tilt-stage 静态外层，倾斜中间态白卡悬在框外，弃用）。≤540px 底框 14px / 内卡 16px 12px。home-minpilot.css bump 0b9386fce5，提交 326b2f2。
- 验证：滚动过动画终点截图，底框四边均匀、终态与账户类型页一致；桌面/390px 无横向溢出；倾斜/扫光等动效未动。仅本地提交，暂不推送。

## 2026-11-14 · 下载中心路线卡上下留白减半

- 用户反馈卡片上下白色留白太多。实测 dl-steps-sec 上下 padding 各 96px（site-light `.sec{padding-block:96px}` 覆盖了 page.css 的 30px），各减半为 48px。版本 bump eaaf7dbcd7（34 页同步），提交 2a55edd。仅本地提交，暂不推送。

## 2026-11-14 · 下载中心路线模块：去标签压高度 + 圆点对齐修复

- 用户反馈：模块太高（去 SMARTHSB / DOWNLOAD WORKFLOW 标签、高度参照改前）；圆点只有 02 对齐，01/03 错位。
- 错位根因：宽屏下 SVG 等比缩放（meet）左右留白，圆点随内容向中心内收；1280 视口恰好无留白所以本地此前未复现。
- 修复：圆点改 HTML `.dl-route-dot` 按 16.67%/50%/83.33% 绝对定位；SVG `preserveAspectRatio=none` 只画线（non-scaling-stroke 保 1px），任何宽度精确对齐。去标签 + padding 34/32→20/22 + 轨道 180→70px，高度大幅回落。≤600px 隐藏轨道。版本 bump 1ec836f2ad（34 页同步），提交 2d23389。1280/1920/390 三档验证对齐（像素扫描圆点 vs 标题中心差 ≤5px）。仅本地提交，暂不推送。

## 2026-11-14 · 下载中心三步模块重构为 HERO 路线动画

- 用户要求参照真实账户页 HERO 区动画重构 download.html 三步模块：三个独立节点 + 动态横线从左向右循环。
- 实施：dl-route 路线场景（渐变底卡 #FFF7DE→#ECFAE2→#DFF7EC + 点阵 + mono 标签 + SVG 路线 + 三节点 01/02/03）；连线 = 虚线基线 + 绿色光段 routeTransfer 4.8s 左→右循环（pathLength=340 归一化，节奏同真实账户页 tradeTransfer）。
- 关键细节：viewBox 必须与栅格同宽（1126×180）且栅格去 gap 改 li 内边距，圆点才精确压在 16.7%/50%/83.3% 节点中心（之前 420 viewBox 被居中留白，圆点错位 61px）；≤600px 隐藏路线、节点纵向堆叠；motion-off / prefers-reduced-motion 下光段静止。
- site-light.css bump a96501f7f5，34 个内页引用同步 bump，提交 dd74929。桌面/390px/动画采样均已验证。仅本地提交，暂不推送。

## 2026-11-14 · trading-tools 删除 APP 使用提示

- 删除工具三卡下方「以上工具在 APP 内使用；信号与汇率数据以平台实时显示为准。」提示行。提交 70e2c10。

## 2026-11-14 · trading-tools 三卡间距修复，极光彩色透过卡缝

- 用户反馈参照账户类型页三种账户卡：三卡之间要有间隔、底色要看得清。排查发现根因：`.tool-directory` 基础样式为 `display:block`（platform-pages.css），上一轮加底带时用容器 `gap` 接管卡距且把 `.icard` 的 `margin-bottom` 清零 —— block 容器 gap 无效，三卡完全贴死，底色只在四周露出。
- 实施：恢复 `.icard{margin-bottom:20px}`（末卡除外）；底图改 `background-size:170% 180%` + `position:50% 95%`，纵向拉伸后极光彩色核（青 #00E5E0 / 橙 #FFB000 等）同时压中两条水平卡缝（缝隙呈橙→青、青→绿渐变）。版本 bump 5cc81ebe6a，提交 91aa1fe。
- 验证：measure.js 量得 card2 顶 − card1 底 = 20px；截图确认缝隙彩色明显、外沿橙/青边保留。仅本地提交，暂不推送。

## 2026-11-14 · trading-tools 工具三卡外层加极光底带

- 用户要求按账户类型页定价卡样式给交易工具三卡加底色，原动效不变。实施：site-light.css 追加 `.tool-directory` 容器铺 aurora-mesh.svg（与账户类型页同一张图、108% 铺法、20px 圆角、40px 投影、18px 缝），卡内渐变底/扫光动效/slide-in 均不动；icard 原余量 margin-bottom 清零由容器 gap 16px 接管。版本 bump 77030e612f。
- 验证：截图确认极光带生效、缝隙露彩色、卡内清晰；无横向溢出。仅本地提交，暂不推送。

## 2026-11-14 · 四个教程页左侧目录统一白底、悬停浅绿

- 范围：tutorial-install / tutorial-open / tutorial-manage / tutorial-trade（安装/开户/账户管理/交易操作指南）。这些页侧栏是 `.tutorial-index .chp-nav .chp-in`，与隐私政策的 `.reading-sidebar` 结构不同，此前非激活项被全局规则染成浅蓝灰。
- 实施：site-light.css 把上轮侧栏规则扩展覆盖 `.tutorial-index .chp-in a`（白底深灰字、激活项深墨加粗、悬停浅绿 #E8FFF4）；另因 platform-pages.css 有 `.chp-nav` 五类 !important 透明底规则，补一条更高优先级 `.tutorial-index .chp-nav .chp-in a:is(.on,.active,[aria-current]){background:#fff!important}`。版本 bump 5c2f319930。
- 验证：四页采样背景集合仅白色一种、激活项白底；悬停浅绿 + 绿字。仅本地提交，暂不推送。

## 2026-11-14 · learn-risk 风险管理四步骤卡文字压边修复

- 根因：内页主题把 `.step` 改为上下 25px、左右 0 padding（无边框顶线风格），而阅读页 `.doc-single .prose .step` 又带浅灰底 #f8fafc，导致文字直接贴住左右边缘。
- 实施：subpages.css 追加 `.internal-site .doc-single .prose .step{padding:25px 22px}`（限定带底色的阅读页步骤卡，不影响裸露式步骤条）；34 页版本 bump 30754e178d。
- 验证：桌面左右间隙 22px、移动端无溢出；截图确认四卡文字留白正常。仅本地提交，暂不推送。

## 2026-11-14 · help.html 移除左侧目录菜单

- 用户要求去掉帮助中心左侧「目录」侧栏（hc-side：8 个分类导航 + 展开全部按钮）。JS 依赖均有空值保护（if(hcAll)、空数组 IO），直接删除 aside 安全；editorial-pages.css 追加 `.page-help .hc-layout` 单列布局，正文占满容器。版本 bump 83c405f025。
- 验证：1280/390 正文与容器左右偏差 0、无溢出、无 JS 错误；截图确认侧栏消失、内容满宽。仅本地提交，暂不推送。

## 2026-11-14 · privacy-policy 侧栏全部白底（上轮修正：仅激活项白底不彻底）

- 用户反馈侧栏整体仍显灰色（所有项底色都是 --site-surface-blue），要求统一白色、仅悬停浅绿。上轮只改了激活项，本轮补全：侧栏所有 `.chp-in a` 白底深灰字（!important 压过 surface-blue 基础规则），激活项深墨加粗，悬停浅绿 #E8FFF4。site-light.css 版本 bump 至 06d0cebde4。
- 四态采样：默认全白 / 滚动切换 / 非激活悬停浅绿 / 激活项悬停浅绿，全部通过。仅本地提交，暂不推送。

## 2026-11-14 · privacy-policy 删除「中文参考译本」提示框

- 用户要求去掉正文顶部的「本页为中文参考译本，与印尼语 / 英语版本如有差异，以印尼语版本为准。」note-info 提示框，已删除。user-agreement.html 侧栏 chp-tip 中的类似表述属不同位置文案，未动。
- 仅本地提交，暂不推送。

## 2026-11-14 · privacy-policy 侧栏当前章节改白底、悬停保持浅绿

- 目标与验收：阅读页竖排侧栏当前章节原与普通项同为浅蓝灰（--site-surface-blue），改为白底深字加粗；悬停浅绿 #E8FFF4 保持不变。验收：默认/滚动切换/悬停（含激活项悬停）四态采样通过。
- 实施：site-light.css 新增规则（作用域限定 `.reading-sidebar`，不影响其他页顶部胶囊导航）：`.on/.read-active` 白底 !important 压过 page.css 胶囊 `.on` 蓝底规则；激活项悬停单独覆写回浅绿。site-light.css 版本 bump 至 3a00fdde34（全站 34 页）。
- 结果与证据：默认激活白底、滚动跟随切换、非激活悬停浅绿、激活项悬停浅绿，全部符合。仅本地提交，暂不推送。

## 2026-11-13 · fraud-warning 两区块文字宽度对齐页面容器

- 目标与验收：用户要求「官方声明与澄清」声明卡 + 警示条、「HSB 官方公告」正文文字宽度以实际页面宽度为准（撑满 `.wrap`）。验收：三块与容器左右偏差为 0。
- 实施：去掉 `.quote` / `.note-warn` 的内联 `max-width:900px`；`.prose` 因全局规则 `.internal-site .prose{max-width:820px}`（不改动，他页仍需），本页内联 `max-width:none` 覆写。
- 结果与证据：1280/390 采样 quote/prose/note 与 wrap 左右偏差均 0、无溢出。仅本地提交，暂不推送。

## 2026-11-13 · 帮助中心 8 卡 hover 补充浅蓝填充（对齐次按钮 hover 态）

- 目标与验收：用户要求 hover 态除彩虹描边外，补上参考按钮（次按钮 hover）的填充色。验收：hover = 浅蓝填充 + 彩虹描边 + 深色文字，与次按钮 hover 完全一致。
- 实施：site-light.css help 块 hover 规则第一层 padding-box 由 `#fff` 改为 `var(--site-surface-blue)`（次按钮 hover 同款变量）；图标底色本就是 surface-blue，无需改。site-light.css 版本号 bump 至 aefa8695f2（全站 34 页）。
- 结果与证据：hover 截图确认「出金」卡浅蓝填充 + 彩虹边 + 深色文字清晰；默认态不受影响。仅本地提交，暂不推送。

## 2026-11-13 · 帮助中心 8 张分类卡 hover 改彩虹渐变描边

- 目标与验收：用户要求 help.html 8 张分类导航卡（平台介绍/开户/KYC 认证/入金/交易/出金/账户安全/名词百科）hover 时显示次按钮同款彩虹渐变边（白底），替代原 M-09 深色渐变填充。
- 实施：8 卡移除 `fill-hover` 类并去掉本页 fill-hover.css 引用（M-09 填充不再触发）；site-light.css help 块新增 hover 规则——双层 background-clip 白底 + 彩虹渐变 border-box（与次按钮完全同色 180deg 五停点），描边 1px→2px。坑：`.motion-link:hover b{color:#fff}` 是给深色填充准备的通用规则，白底下文字会消失，已用更高特异性压回 `--site-ink`、图标底压回 surface-blue。site-light.css 版本号 bump 至 e8437057b1（全站 34 页）。
- 结果与证据：hover/focus-visible 截图确认彩虹边 + 深色文字 + 图标正常；默认态 8 卡白底细边无残留。仅本地提交，暂不推送。

## 2026-11-13 · live-quotes 提示行与行情卡左右对齐

- 目标与验收：用户要求提示文字与白色行情卡对齐（此前提示行在外层通用 wrap 1200px，卡片在 workspace 专用 wrap 1112px，左缘差 85px）。验收：三档视口左右偏差为 0。
- 实施：把 `.mkt-links-note` 移入 workspace section 的同一 `.wrap`（`.mkt` 闭合后），去掉负 margin hack 与三档偏移媒体查询，改为正常流 `margin:16px 0 0`——对齐随容器天然成立，不再依赖手工补偿。trading-pages.css 版本号 bump 至 e46bdb86dd。
- 结果与证据：1280/768/390 三档 leftDiff/rightDiff 均为 0、间距 16px、无横向溢出；截图确认对齐与观感。仅本地提交，暂不推送。

## 2026-11-13 · live-quotes 行情卡下提示去框改灰字

- 目标与验收：用户要求「品种代码与参数…详见 交易品种→；影响行情…财经日历→ 查看」提示不再用独立浅蓝信息框，直接以文字显示在 HSB 行情白卡下方。
- 实施：live-quotes.html 该行 `.note.note-info` 改为 `.mkt-links-note`（灰字 12px + 绿色加粗链接，样式加在 trading-pages.css trading-family 层）；外包壳改 `.mkt-links-wrap`，与白卡的贴合偏移从行内样式移入 CSS 分三档（桌面 -80px / ≤1024px -72px / ≤600px -44px，实测间距 16/24/20px，三档均无横向溢出）。trading-pages.css 版本号 bump 至 9a69d3849b（10 个引用页）。
- 结果与证据：三档视口采样间距达标、无重叠无溢出；截图确认灰字直排、链接绿色醒目、无信息框。仅本地提交，暂不推送。

## 2026-11-13 · Real 账户卡改用彩虹渐变描边

- 目标与验收：用户要求把次按钮的彩虹渐变边框应用到「真实账户（Real）」卡的边框，且比按钮更亮丽。验收：渐变贴合 12px 圆角、Demo 卡不受影响、内容清晰。
- 实施：subpages.css 内页主题层新增 `.internal-site .cmp.real` 覆写——双层 background-clip（白底 padding-box + 渐变 border-box，边框透明）保住圆角（border-image 不走圆角所以不用）；渐变取按钮同款五色相（黄→橙→紫→蓝→绿）整体提亮加饱和：`#FFDE59/#FF9A4D/#9A5CF0/#2E9BF0/#4BEFAE`，方向 160deg 对角，描边 1.5px→2px。34 页 subpages.css 版本号 bump 至 e26733b441。
- 结果与证据：截图确认渐变边贴合圆角、Demo 卡与卡内内容不受影响；`.cmp.real` 全站仅 account-real.html 一处使用，无外溢。仅本地提交，暂不推送。

## 2026-11-13 · account-real「真实账户支持」四卡接入 M-05

- 目标与验收：用户指定「HSB 为真实账户提供的支持」区四张 kv 卡（专属促销/账户等级/积分与奖励/1对1导师课）按 M-05 方位移入处理。
- 实施：`.kv-list` 加 `si-group`，四卡加 `slide-in data-dir="bottom"`（R1 同向，与本页既有分组一致）；slide-in css/js 该页已挂载，零新增资源。
- 结果与证据：采样确认依次进场（透明度 0.71/0.36/0/0，位移 18/41/65px，组内错峰 0.4s 摊满）→ 终态四卡全部 `si-done` 归位；终态截图布局无偏移。规范库新增「真实账户页」反查表条目。仅本地提交，暂不推送。

## 2026-11-13 · account-real「Demo vs Real」动效由 M-03+C 改为标准 M-03

- 目标与验收：用户要求把上一轮接入的 M-03+C（clip-path 内容型）调整为标准 M-03（宽度 0→100% 实体展开）。验收：卡片边框随宽度从中心向两侧生长、内容中心对称裁切零重排、终态无残留。
- 实施：新增标准宽度型通用件 `assets/css/scroll-unfold-w.css` + `assets/js/scroll-unfold-w.js`（同节奏：start `top bottom`、end `30% 50%`、scrub 0.8、双向）。两 `.cmp` 卡改挂 `js-m3w`、内容包 `.m3w-body`，替换原 `unfold js-unfold` 与 `scroll-unfold.css/js` 引用。CSS 关键点：`.js-m3w` flex 居中 + `margin:0 auto`（网格轨道不位移，卡片在轨道内居中生长）；`.m3w-body` 兜底 `width:100%` 供无 JS 状态。
- 过程坑：① `load` 重新量宽时窗口处于 0% 宽，`offsetWidth` 量出 0px 锁死——修复为量宽前先把窗口临时置 100%；② flex 容器下 body 初始自然宽变成 max-content（264px）——兜底 `width:100%` 后量得正确内容宽（桌面 538px）。
- 结果与证据：宽度采样 0%→9%→98%→100%（scrub 收敛）；截图确认中间帧两卡以自身中心为轴生长、文字左右对称裁切零重排；移动端 390px 无横向溢出、终态正常。脚本失效 / 减少动效 / motion-off 时内容照常完整显示。
- 决定及理由：标准 M-03 观感为实体卡片从中心摊开（边框随宽度生长），与 M-03+C 的「拉开窗帘」不同；规范库 M-03 条目已更新标准型通用件用法与落地记录。仅本地提交，暂不推送。

## 2026-11-13 · 真实账户页「Demo vs Real」对比区接入 M-03+C 滚动展开

- 目标与验收：用户指定 account-real.html「模拟账户 vs 真实账户」两卡片对比区采用 M-03+C（滚动展开·内容型）动效。验收：滚动时两卡随滚动 1:1 从中心向两侧展开，终态版式零重排、无裁切残留。
- 实施：两张 `.cmp` 卡片（Demo / Real）直接挂 `unfold js-unfold`（clip-path inset 方案，含文字块用内容型适配版）；挂载既有通用资源 `scroll-unfold.css/js?v=20261112a`（与首页同版本，无新增文件）。触发节奏沿用规范：start `top bottom`、end `30% 50%`、scrub 0.8、双向可逆。
- 结果与证据：计算样式采样——入场前 clip `inset(0 50%)`，滚至中线过程中 45.5%→0.9% 渐敛，终态归零；截图确认中间帧两卡中心窄条可见、终态完整无错位。脚本失效 / 减少动效 / motion-off 时内容照常完整显示。
- 决定及理由：未包外层壳而是直接给 `.cmp` 加类——卡片无既有 transform，clip-path 与任何 transform 不冲突；两卡各自从自身中心展开，观感优于整网格单裁切（网格中心落在两卡间隙）。仅本地提交，暂不推送。

## 2026-11-13 · 客户资金保险卡新增 Aswata / WTW 机构标志栏

- 目标与验收：用户要求在入金出金页「客户资金保险」区块体现承保方 Aswata 与保险经纪 WTW 的公司标识。用户给的两个候选位（sec-sub 行内、$1,000,000 卡片下方）空间局限：sec-sub 行高 12px 放不下横长字标；额度卡 180px 宽叠两枚字标会撑破。经用户示意「或更好的位置」，实施第三方案：
- 实施：`.cert-band` 白卡内部底部新增 `.ins-logos` 栏（grid-column:1/-1 + 顶部 1px 分隔线）——「客户资金保险 · 承保与保险经纪」灰色小标签 + 两枚浅蓝圆角芯片（Aswata / WTW 彩色字标，图高 24px）。资源落盘 `assets/img/insurers/aswata.svg`（源自 ASWATA_LOGO.svg）、`wtw.svg`（源自 WTW_LOGO.svg），样式加在 subpages.css 内页主题层。
- 缓存版本：34 页 `subpages.css?v=0745d5d295`。
- 验证：元素截图核验桌面 1280px（两标志清晰、蓝/紫色正常、布局协调）与移动 390px（正常换行无溢出）；图片加载状态核查 naturalWidth/渲染尺寸正常。注：整页截图工具触发 lazy 图时机不稳，出现一次假空白，以滚动后元素截图为准。
- 提交：本地 commit，暂不推送。

## 2026-11-13 · promotions.html 活动安全六卡接入 M-10

- 目标与验收：用户要求优惠活动页「活动安全有保障」监管六卡（`.reg-strip`）按 about.html 同样方式接入 M-10 旋转飞入。
- 实施：`.reg-strip` 加 `.spin-group`、6 个 `.r` 加 `.spin-in`；head 挂 `spin-in.css?v=1dea1efbc5`、body 挂 `spin-in.js?v=21bfd66156`。全站 `.reg-strip` 仅 about / promotions 两处，均已接入。
- 验证：计算样式采样——触发后中间帧 op 0.84 / translateX(36px) / 图标约 -52° 旋转中，终态 6 卡全部 si-done 归位。
- 提交：本地 commit，暂不推送。

## 2026-11-13 · 新增 M-10 旋转飞入 + 修复 12 页缺失 html.js 引导脚本

- 目标与验收：用户要求关于我们页「监管与合规」六枚机构卡（`.reg-strip .r`）加「图标旋转着飞入」动效。
- 新增 M-10「旋转飞入」Spin-Fly-In（登记进 docs/handover-20261113/动效规范库.md 入场类表与 about 反查表）：
  - 新文件 `assets/css/spin-in.css`、`assets/js/spin-in.js`（模式与 M-05 slide-in 一致：组触发一次、motion-off/reduce-motion/无 IO 直落终态、不用 {once:true}、animationName 过滤冒泡）
  - 参数：卡从右 220px 外飞入 900ms expo.out（与 M-04 一致）；卡内 img 同步 rotate(-360deg) scale(.5)→归位，文字保持正立；变体 `data-sp-dir="left"`（M-10+L）、`data-sp-spin="cw"`（M-10+B）；组错峰 70ms/枚（`data-sp-step` 可覆盖）
  - `about.html`：`.reg-strip` 加 `.spin-group`，6 个 `.r` 加 `.spin-in`，head/body 挂载 css/js（版本号 1dea1efbc5 / 21bfd66156）
- **重要根因修复（顺带发现）**：全站动效 CSS 的 `html.js` 作用域依赖根元素 `js` 类，该类由 head 内联脚本 `document.documentElement.className+=" js"` 设置——**只有 23 页有此脚本，12 页缺失**（about/contact/help/news/download/trading-tools/404/customer-complaint/fraud-warning/platform-tutorial/privacy-policy/user-agreement）。缺失页面上 M-05 slide-in、M-06 tilt-up、home-minpilot 的 html.js 规则全部静默失效（动画从未播放，靠回退定时器补 si-done 伪装完成）。已给 12 页补齐同款内联脚本。副作用：这 12 页此前静止的入场动画将开始真实播放，推送前建议做一轮多宽度布局复核。
- 验证（Playwright 系统 Chrome 通道 + 计算样式采样）：
  - about.html 补脚本后：触发后 +200ms 卡片 translateX(41px)/op 0.81/图标约 -68° 旋转中 → +600ms 归位 → si-done，expo.out 曲线符合规范
  - 修复前对照组：si-play 存在但 computed transform 恒为 none（html.js 不匹配，动画未应用），证实根因
  - 整页终态截图：六卡完整正立、图标彩色正常；JS `node --check` 通过
- 范围：新增 2 文件 + about.html + 12 页 head 一行内联脚本 + 规范库文档；不推送。

## 2026-11-13 · 修复保险额度卡片数字压边

- 目标与验收：用户反馈 deposit-withdraw.html 保险额度卡片（`.cert-band .ins-amount`）的 `$1,000,000` 数字压边。
- 根因：subpages.css 把 `.cert-tile` 从 page.css 的 160px 缩到 135px 且无水平内边距，数字 24px + `white-space:nowrap`（约 129px 宽）几乎顶满卡片。
- 实施：subpages.css——`.cert-band` 网格列 `160px 1fr` → `180px 1fr`；`.ins-amount` 加 `width:180px;padding:0 16px`；数字字号 24px → 22px。仅作用于此卡片，licenses.html 的 ISO 徽章 tile（135px）不受影响。
- 缓存版本：34 页 `subpages.css?v=69fce3bd32` → `b3b9b4903e`。
- 验证：截图核验桌面 1280px 与移动 390px，数字四周留白充足、无裁切无横向溢出。
- 提交：本地 commit，按用户要求暂不推送 GitHub。

## 2026-11-13 · 修复内页 CTA 横幅白字不可读

- 目标与验收：用户反馈多个内页 CTA 横幅（「先开模拟账户，选对档位再入金」等）背景过浅且文字为白色，不可读；要求参照首页浅色区（深色文字 + 浅渐变底）统一修复。
- 根因：`style.css` 基础样式 `.cta-banner` 为深蓝底白字（`color:#fff` 在容器上）；此前改版在 `site-light.css` 仅覆写背景为浅色渐变 `#EAF1FF→#E7FFF4→#F4FFE5`，未覆写文字色，白字落在近白底上。
- 实施：`site-light.css` 的 `.internal-site[data-page] .cta-banner` 一组规则补齐——容器 `color:var(--ink)` + 1px `--site-line` 描边；`h2` 深墨色；`p` 改 `--site-muted` 并去掉 0.82 透明度；`::after` 装饰光斑由白色改为淡蓝 `rgba(35,93,254,.10)`。共 34 个内页生效（含 download.html 的 `.lite` 变体，文字同为深色，一并统一）。
- 缓存版本：34 个引用 `site-light.css` 的页面版本号 `08fd13c0a7` → `453d0b6567`（git hash-object 前 10 位）。
- 验证：`git diff --check` 通过；Playwright（系统 Chrome 通道）整页截图抽查 `account-types.html` 与 `deposit-withdraw.html`，横幅标题/副标题均为深色、清晰可读，浅渐变底与右侧渐变按钮正常；未动首页（首页不引用 site-light.css）。
- 范围：仅 `website/assets/css/site-light.css` 与 34 个内页 HTML 的版本号替换，无业务内容改动。
- 下一步：提交、整合远端、推送 main 并跟踪本次 Pages 部署，核验公开页面。

## 2026-11-13 · 接续交接版的全站视觉与动效优化

- 目标与验收：先拉取另一位作者的最新版本，以新版首页与账户类型页为基准，优化其余页面的文字、卡片、悬停与渐变；保留所有文字、数字、链接和内容顺序。完成五档响应式、关键交互、动效开关、减少动效及无脚本检查后发布。
- 开始状态：本地 `main` 为 `9db79e9`，远端为 `8fad486`；已 `git pull --ff-only origin main`，快进完成，无冲突。未跟踪的根目录 `assets/` 与 `.local/` 保留，不加入提交。
- 依据：交接文件实际位于 `docs/handover-20261113/`，已读取站点改动清单、动效规范库与设计约束摘要。新版全息 HERO、账户卡和现有内容作为本轮基线，不按旧版光门回退。
- 决定与理由：复用 M-01/M-02/M-05/M-07/M-09，按页面内容选择；先消除旧通用入场与组件入场的重复，再增强渐变和指针反馈。长文正文保持静态，动效不得成为内容可见的条件。
- 下一步：实施并保存内容一致性与浏览器检查证据，提交、整合远端、推送 `main`，跟踪本次 Pages 并核对公开版本。

- 完成结果：32 个其余内容页按用途扩展 M-02/M-05/M-07/M-09、极光白卡、指针柔光与工具 SVG 扫光；长文正文静态。修正重复入场、脚本缺失隐藏、逐行文本播放后不能重排，以及首页小字和渐变按钮对比度；全息 HERO 构图及时间线保留。同步最新首页的根镜像及资源哈希。
- 验证：35 页五档宽度共 175 项布局、31 项关键交互、70 次 axe 扫描（0 已判定违规）、35 页减少动效、35 页运行文本比对、12 项无脚本/缺组件脚本检查均通过；3,937 项本地引用、CSS/JS 语法、原文/数字/顺序/标识、根镜像和资源版本核对通过。新增渐变白字最低 5.38:1，分类小标签色值采样见报告。
- 证据：`docs/qa/20261113-site-motion/report.md` 与 `checks.json`。发布前再次 fetch，远端仍为 `8fad486`；本地未跟踪目录原状保留。
- 上线结果：内容提交 `8e720d80e8faee5f18d5871deae14c47bfb75ec0` 已推送 main；[Pages 运行 43391819288](https://github.com/MrRoam/smartHSB/actions/runs/43391819288) completed / success。公开首页、34 内页、11 项修改资源共 47 项 HTTP 200，文本按 UTF-8/LF 归一化后与提交一致。线上 390px 模拟页单列与菜单、1440px 资讯卡渐变悬停验证通过，无浏览器错误；证据见同目录 `release.json`。
- 任务结束：本轮视觉与动效需求完成。发布记录提交继续按自身 SHA 等待 Pages，并复核公开页面；根目录未跟踪 assets/ 与 .local/ 保留，不提交。

## 2026-11-11 · 提取 Minpilot 设计规范与改版提示词

- 目标与验收：读取 `https://minpilot.webflow.io/` 的实际页面、样式及动效配置，提取浅色底、亮绿/青/蓝、渐变、布局和交互规则；区分原站实测参数与 SmartHSB 建议参数，交付可复制提示词与公开参考文档。
- 开始状态：工作区仅根目录 `assets/` 未跟踪；保留原状。已读取协作规则、执行记录、经验及实际 Pages 工作流。
- 范围与决定：本轮做设计研究和提示词，不修改现有首页、光门 HERO 或产品内容。报告放入正式发布目录，以独立链接分享；按项目授权完成提交、推送及本次部署验证。
- 结果与证据：新增 `website/design/minpilot/` 独立参考页、`spec.md`、`prompts.md`、`evidence.json` 及独立 CSS/JS。覆盖原站色板、五段虹彩边框、背景图与 SVG 柔光、排版/布局、首屏编排、卡片入场、悬浮/轨道/按钮/Tab 动效；交付总提示词及配色、动效、复核三个专项提示词。结构化摘要包含来源 URL、按 UTF-8/LF 归一化的来源哈希、桌面/手机计算样式及动效采样。
- 关键决定：原站包含大面积黑色区块，按用户要求将其作为可转成浅色的节奏参考；颜色面积比例、原创径向渐变和更克制的 SmartHSB 动效明确标记为建议。首屏柔光是 WebP 背景图，不将其误记为流体动画；共享脚本中的其他页面规则不直接归为当前首页已运行效果。
- 本地验证：320 / 390 / 768 / 1024 / 1440px 均无页面横向溢出；相对资源/文档链接及锚点有效；四段提示词完整；复制成功，键盘 Enter 播放/暂停可用，焦点可见，离屏停止，系统减少动效时动画数为 0。阻止参考页脚本加载后，完整正文和总提示词仍可读，原生折叠项可用。
- 可访问性：按 web-design-guidelines 检查并修复代码区域的 ARIA 标记；桌面 axe 4.12.1 复查为 46 项通过、0 违规、0 待定。手机横向表格的裁切由可聚焦滚动容器承载；人工核对文本配色，正文灰/白 6.27:1、深绿/白 6.50:1、深墨/白 16.83:1、深墨/柠檬绿 14.08:1。
- 范围与未决：首页、根目录镜像、现有资源和 HERO 均无修改；根目录未跟踪 `assets/` 保留。原站视频在本次浏览器内暂停，未把播放成功写为已验证；数字 ease 未擅自映射成具体曲线。后续首页浅色方案需验证光门 Canvas 合成，不能只改背景色。
- 上线结果：内容提交 `a12e62d21d5652219fe8e014522dfcc486480d7d` 已同步 `main`；对应 [Pages 运行 42998325593](https://github.com/MrRoam/smartHSB/actions/runs/42998325593) 为 completed / success。公开参考页 `https://mrroam.github.io/smartHSB/design/minpilot/`、CSS、JS、规范、提示词、采集摘要及原首页均返回 HTTP 200，UTF-8/LF 归一化后与当前提交一致；公开页面上的总提示词复制成功。
- 下一步：本轮研究与提示词已完成。后续先按总提示词评估光门与浅色内容衔接、平台产品区、市场区的方案，再实施首页改版；发布验证记录提交后仍按本次记录提交 SHA 跟踪 Pages。

## 2026-11-11 · 完善项目协作工作流

- 目标与验收：逐项检查 project-init 的五条约定，复用现有规则和 Git，只补缺项；通过差异检查后提交，并按项目授权同步 `main`、跟踪本次 Pages 部署及验证公开页面。
- 开始状态：仓库位于本目录，分支为 `main`；已获取远端，`HEAD` 与 `origin/main` 均为 `a5734eb`。暂存区为空；`AGENTS.md` 显示工作区修改但无内容差异；根目录 `assets/` 未跟踪，保留原状。
- 检查结果：现有项目说明、预览命令、中文表达、设计边界和发布流程可直接复用；Git 提交身份已配置，忽略规则覆盖已有系统杂项、依赖和编辑器目录，无需补充。
- 本次补齐：在 `AGENTS.md` 增加项目用途及执行记录、经验复用、提交范围和日志压缩约定；创建本记录及 `EXPERIENCE.md`。网站文件和发布配置未修改。
- 决定与理由：沿用已有自动发布授权，避免新增相反的“仅本地提交”规则；不新建 README、脚本或定时任务，现有说明已满足本次需要。
- 验证与证据：核对 `.github/workflows/pages.yml`、远端、分支、身份和忽略规则；提交前执行 `git diff --check` 并检查暂存范围。仅修改协作文档，无页面或交互变更，无需重复界面测试。
- 偏离与未决问题：无范围偏离。根目录 `assets/` 的归属不在本次初始化范围，继续保留且不加入提交。
- 下一步：提交本次三个文档，重新获取并整合远端后推送 `main`；以本次提交 SHA 跟踪部署，公开页面及关键资源验证结果见本任务最终交付。后续任务按本记录与相关经验续接。

## 2026-11-11 · 浅色视觉方案（设计审阅，未实施）

- 目标与验收：交付浅色色板及语义、渐变配方、三个重点场景的桌面/手机设计稿、区块编排和动效表；检查五档宽度、键盘、对比度与减少动效。
- 范围：用户明确要求先审阅方案。本轮只创建独立设计资料，不改首页、镜像及正式 CSS/JS，不推送或触发发布；保留根目录未跟踪 assets/。
- 开始核对：已读取实际规则、日志、经验、首页、光门合成及参考研究。参考资料位于 website/design/minpilot/；当前光门 screen 合成与黑色遮罩依赖 #1B1B1B。
- 决定与理由：用实际原光门展示浅色内容衔接；不把未经验证的浅色 Canvas 处理当作已完成设计。所有新增配方和参数明确标为项目建议。
- 下一步：制作独立审阅稿和规范，验证并记录结果；等待用户确定方案后再实施首页。

- 复核完成（2026-11-12）：独立审阅稿位于 docs/design/light-20261111/，包括交互样张、六张桌面/手机关键画面、静态画板、完整规范与复核报告。新增页面均在 docs/，不在 Pages 发布目录。
- 验证：320/390/768/1024/1440px 无页面横向溢出或主要文案裁切；25 品种与原 HTML 一致；Tab 方向键/Home/End、外汇长列表、FAQ Enter/Space、审阅菜单 Escape 回焦点通过。两档 axe 4.12.1 为 0 已判定违规，渐变对比度规则仍需人工判断；125 个真实背景文字区域采样最低 5.06:1。
- 动效证据：默认/手动关闭/系统减少动效时动画数为 0；循环离屏暂停。后台处理通过模拟 hidden/visibilitychange 验证，未声称完成真实设备后台测试。无增强脚本副本在 320px 显示全部 25 品种，导航及原生 FAQ 可用；未将网络拦截尝试当成成功证据。
- 设计差距：推荐保留原炭黑光门、浅色从下一区块开始。全浅色 Canvas 重合成、真实 APP 新素材、完整动效编排和其余区块整合待方案确定后处理；规范逐项保留账户、资金、支付/保险条件、积分、奖项、媒体及风险披露。
- 范围证明：128 个已跟踪正式文件指纹与开始时一致，首页和镜像均未修改；根目录 assets/ 保持原状。仅设计资料和本日志进入本地版本记录，不推送、不触发 Pages。
- 下一步：用户审阅设计方案；确定后再实施首页、完成整合回归并按发布流程交付。

## 2026-11-12 · 发布独立设计审阅分享页

- 目标与授权：用户要求分享设计稿。将审阅资料发布为独立公开链接，不实施首页改版。
- 改动：新增 website/design/light-20261111/ 分享镜像，修正发布目录中的相对路径；增加规范 spec.html 与复核 review.html 阅读页，并保留交互稿、六张画板和证据。同步本地文档的公开状态。
- 验证：全部 HTML 的本地引用存在；四个入口在 320px 无页面横向溢出；1440px 市场切换正常；JS 语法和差异检查通过；开始时记录的 128 个正式文件指纹保持一致，首页、镜像、视频及正式主题资源均未变。根目录 assets/ 不加入提交。
- 发布：已获取远端，main 仅领先上一轮设计资料提交、无落后提交；本次提交后再次获取远端并整合再推送。以本次 SHA 等待 Pages，并核对公开 HTML/CSS/JS/图片及首页；结果在本轮最终答复提供。
- 上线结果：内容提交 7fb203a173e7a8e0288100f7d69754524e3e1c3f 对应 Pages 运行 https://github.com/MrRoam/smartHSB/actions/runs/43130060877 为 completed / success。公开入口 https://mrroam.github.io/smartHSB/design/light-20261111/ 已可访问；21 项公开 HTML/CSS/JS/图片/字体/首页均 HTTP 200，文本按 UTF-8/LF 归一化后与本地一致。公开页 390px 市场切换通过，无横向溢出。仅记录结果的后续提交也按自身 SHA 跟踪部署；首页内容保持原状。

## 2026-11-12 · 按浅色审阅方案实施首页

- 目标与授权：用户确认按公开方案实施。保留原光门构图、视频、文案、六徽章及动画逻辑；完成浅色内容、平台舞台、25 品种市场、其余信息区和动效，再按项目流程同步线上。
- 开始状态：main 与 origin/main 一致，唯一未跟踪项为根目录 assets/，保留原状。已读取实际工作流、设计规范和交互调用；不引入框架或旧主题。
- 验收：保留原业务事实和条件；五档布局、键盘、FAQ、导航、示例声明、动效开关、系统减少动效和无脚本阅读；镜像及资源版本一致；本次部署成功并核对公开版本。
- 实施完成：重写首页专属浅色样式，完成平台大产品舞台、虹彩次行动、白面板市场和其余信息区；保留全部原业务说明。动效使用渐进增强、可取消的 120/280ms Tab 过渡及一组 6s 浮卡；移除滚动自动隐藏导航，避免菜单与焦点位置争抢。原光门仅补两个分组 role，CSS/JS/视频指纹未变。
- 验证通过：五档宽度均无横向溢出或主要文案裁切；键盘、长列表、FAQ、四档移动菜单、快速切换、中断关闭、离屏及减少动效通过。无脚本副本的四组 25 品种可读、FAQ 可用。80 个实际背景区域最低对比度 5.04:1；两档 axe 无已判定违规，最终剩渐变颜色人工复核项；正文条件已结合实底/背景取样核对。原视频解码和开关播放行为正常。
- 内容及证据：docs/design/light-20261111/IMPLEMENTATION.md 与 implementation-checks.json；资金/保险条件、监管、奖项、媒体、FAQ、法律披露与原 HTML 文字比对一致；临时无脚本文件已删除。全部新增规则限定首页，镜像与资源哈希版本已同步。未跟踪 assets/ 保留。
- 下一步：提交本次文件并再次获取远端、推送 main；等待本次 Pages，核验公开首页和新 CSS/JS。发布结果随后记录。
- 上线验证：内容提交 b581224f997d0982b707b5e91b7d50bebaaa8d4b 对应 Pages https://github.com/MrRoam/smartHSB/actions/runs/43133398560 为 completed / success。公开首页 https://mrroam.github.io/smartHSB/ 已应用新方案；25 项首页/主题/脚本/光门资源/审阅资料与本地版本一致，文本按 UTF-8/LF 归一化。首次一张 PNG 请求出现 SSL EOF，单独重试 HTTP 200、字节哈希一致。公开 390px 切到外汇后显示 17 项，页面无横向溢出，未出现 JS 错误。仅记录结果的后续提交仍按本次 SHA 等待 Pages 并复核公开版本。

## 2026-11-12 · 首页修复与全站浅色动效统一

- 目标与验收：六年荣誉在桌面单行，窄屏保留单行横向浏览；恢复手机悬停摆正；页脚 SmartHSB 加流光。业务内页沿用首页蓝、青、薄荷绿、浅底与留白，保留并补充现有动效。
- 开始状态：main 与 origin/main 一致；仅根目录 assets/ 未跟踪，保留。已读取实际发布工作流、历史记录与当前样式归属。
- 决定：在现有页面与交互基础上统一主题，不改变业务事实、光门构图或视频。动效统一响应手动开关、系统减少动效、离屏与后台状态，默认正文保持可读。
- 下一步：定位覆盖规则，参考原站页脚与动效，实施后验证全部业务页面五档布局及关键操作；按本次提交发布并核验公开版本。
- 实施结果：首页六荣誉改为单行及窄屏键盘横向浏览；在原样式处恢复手机悬停摆正；页脚增加蓝绿流光。34 个内页使用共享浅色语义色板、柔光首屏、统一按钮与页脚，保留原业务文本及图表、路线和步骤动效，并增加浮层、错峰、切换与 FAQ 过渡。
- 根因修复：新首页覆盖了旧手机 hover 角度和六列荣誉；旧内页灰蓝色值分散在各家族样式中，已归到同一色板。桌面菜单原通配过渡延迟 visibility，使方向键无法将焦点移入链接，现仅过渡 opacity/transform。另修内页手机导航溢出、表格键盘访问、页脚对比度，以及系统设置变化覆盖手动动效偏好的问题。
- 验证：35 页 × 五档宽度共 175 用例无横向溢出或主文案越界；23 个关键交互通过；35 页系统减少动效无运行中动画；70 次 axe 4.10.3 扫描为 0 已判定违规，渐变背景另作人工复核。320px 无脚本四页可读，首页 25 品种完整。后台暂停通过事件模拟验证，未将其记作真实设备后台测试。
- 内容与资源：全部原业务正文逐项顺序比对一致；光门 CSS/JS/视频指纹一致；3,655 个本地引用有效；JS 语法、CSS 解析、根镜像与变更资源哈希引用通过。证据见 docs/qa/20261112-site-motion/。根目录 assets/ 保留且不提交；本地 .local/ 为本轮浏览器与验证临时产物，不进入发布。
- 发布前状态：已获取 origin/main，当前无落后提交。GitHub CLI 的历史工作流查询出现连接 EOF，准备对本次提交重试或通过公开 Actions API 核验；不能以历史运行代替本次发布结果。
- 下一步：提交完整改动，重新获取并整合远端后推送 main，等待本次 Pages 部署并核对公开 HTML、CSS、JS 与关键交互。

- 上线结果：内容提交 `15bb48f1ef1269db7ca4036273f07f345dbdca25` 对应 [Pages 运行 43150557972](https://github.com/MrRoam/smartHSB/actions/runs/43150557972) 为 completed / success。公开首页 https://mrroam.github.io/smartHSB/ 及全部 34 内页、17 项关键资源共 52 项 HTTP 200，文本按 UTF-8/LF 归一化后与提交一致。线上六荣誉完整、流光背景位置持续变化、390px 品种页无横向溢出，无浏览器错误。证据见 docs/qa/20261112-site-motion/release.json。
- 任务结束：本轮需求与验证已完成。内页原下滑收起导航保留，另验证焦点进入时可唤回。仅记录发布结果的后续提交继续按自身 SHA 等待 Pages 并抽验公开入口；根目录 assets/ 与本地 .local/ 均不提交。

## 2026-11-16 · 首页新增 CFD 风险提示

- 目标与验收：将首页 CFD 风险提示放在 HERO 内的右下角，以白色文字贴近边缘显示；不与开户 CTA 或监管徽章同行。
- 实施：在 `website/index.html` 的 HERO 内加入独立文字提示；使用绝对定位、右下安全边距、白色低调文字及右对齐。同时同步根目录 `index.html` 预览镜像；手机端保持右下定位并自然换行。
- 决定与理由：用户审阅后确认浅琥珀色横条与全息首屏不协调，且进一步要求提示脱离按钮组。将文字锚定在 HERO 右下角可维持全息画面的完整性，同时将风险说明保留在首屏。
- 验证：核对两份首页均只出现一次完整文案，旧 `.cfd-risk-banner` 与 CTA 下方提示均已移除；CSS 缓存版本更新至 `9ea16239b3`；`git diff --check` 通过。Chrome 无头截图在当前受限环境中未能启动，未将其作为视觉验证证据。

## 2026-11-16 · HERO 监管及会员图标视觉校正

- 目标与验收：以共享资料 `ICON图标文件/03.6大监管及会员单位` 的原始文件为准，统一 HERO 下方六枚图标的视觉量感；将 OJK 右侧灰色文字调整为白色，以适配深色背景。
- 实施：确认当前 `ojk_dark.svg` 与共享资料原文件 SHA-256 一致；为六枚图标加入独立的尺寸调节类和统一徽章槽位，按各自原始画布比例分别校正高度。OJK 叠加同一 SVG 的右侧裁切白色版本，保留左侧官方彩色图形。
- 验证：两份首页镜像均使用同一组六个来源文件和尺寸类；OJK 仅有一个可访问名称，叠加副本对辅助技术隐藏；CSS 缓存版本更新至 `c7b1382160`，`git diff --check` 通过。

- 后续微调：按用户要求将 OJK 的桌面、平板、手机显示高度分别由 48px、36px、31px 调整为 43px、32px、28px，约缩小 10%；白色文字叠层随同缩放。缓存版本更新为 `16ea6a7679`。

- 后续微调：按用户标注将 ICDX 的桌面、平板、手机显示高度分别由 42px、33px、28px 调整为 38px、30px、25px；ASPEBTINDO 分别由 54px、42px、36px 调整为 49px、38px、32px，均约缩小 10%。缓存版本更新为 `04aab1b274`。

## 2026-11-16 · HERO 徽章行与风险提示位置调整

- 目标与验收：将六枚徽章的视觉间距缩小约 30%，整体上移约一个字体高度；将风险提示移动到第一屏最底部，使用黄色文字并右对齐。
- 实施：桌面徽章槽位由 142px 收紧为 124px，平板及手机槽位同步收紧；徽章行增加 `-1em` 上边距。风险提示由 HERO 主画面内移至徽章条之后，作为 `.holo-viewport` 的最后一个元素；采用黄色 `#ffd35c`，因此固定显示在第一屏底部。
- 验证：两份首页镜像风险提示均位于徽章条闭合标签之后；CSS 缓存版本更新至 `4db2027119`；`git diff --check` 通过。

- 后续微调：保持风险提示字号不变；字重由 300 调为 500，取消透明度淡入，将黑色阴影改为轻微黄色光晕，以增强深色背景中的字形清晰度。缓存版本更新为 `37578931d0`。

- 根因修复：`home-minpilot.css` 的 `.home-minpilot p` 选择器优先级高于 `.holo-risk`，将风险提示覆盖为灰色。新增更具体的 `.home-minpilot .holo-risk` 规则，恢复高对比黄色；字号不变。缓存版本更新为 `0fbf2f4bea`。

- 后续微调：在风险提示前加入黄色线框三角警示图标；图标对辅助技术隐藏，不重复朗读提示内容。

## 2026-11-16 · 停止离屏页脚点阵 Canvas 动画帧

- 目标与验收：用户选定动效基线审查项 A。首页页脚 `#footer-dots` Canvas 离开视口时不再持续请求动画帧；回到视口或页面从后台返回后恢复绘制；不修改 `#intro-portal`。
- 实施：`column-home.js` 的点阵渲染器增加单一调度、停止与重启路径。交叉观察器离屏时取消当前帧，调度器在离屏、后台、动效关闭或已有待执行帧时不再排队；页面可见性变化时同步两个点阵实例。
- 验证：新增零依赖 Node 回归测试 `tests/point-map-scheduler.test.cjs`，覆盖离屏取消与重新进入后恢复排帧；`node --test` 两项通过，`node --check` 与 `git diff --check` 通过。首页正式入口和根目录预览镜像均更新 `column-home.js?v=050db7b9fd` 缓存版本。

## 2026-11-16 · 内页改用语义化区块背景

- 目标与验收：用户选定视觉基线审查建议 4。内页默认使用白色内容背景；连续操作流程使用浅蓝或浅薄荷表面；每页末尾行动区使用品牌色系强调。不得再按区块奇偶位置自动切换背景。
- 实施：移除 `site-light.css` 与 `subpages.css` 的 `main > .sec:nth-of-type(...)` 背景规则，新增 `surface-flow--blue`、`surface-flow--mint` 和 `surface-action` 语义表面。为真实账户开户、下载、模拟账户、投诉处理与平台学习路径五个实际步骤区标记流程表面；33 个含 CTA 横幅的内页末段均标记行动表面。原有 CTA 横幅和其蓝绿主按钮保留，形成由页面级浅底到组件级品牌行动的层次。
- 验证：已确认旧的按位置背景选择器不再存在；33 个 CTA 页面与行动表面一一对应，5 个流程表面只落在指定的流程页面；34 个内页均更新为 `site-light.css?v=b17b67a1f4`，无旧缓存引用；`git diff --check` 通过。

## 2026-11-16 · 首页与内页统一顶部浮层导航

- 首页行为：首页在 `#intro-portal` HERO 可见时保留既有的深色内嵌导航；HERO 底边离开顶部 96px 后才切换为固定顶部白色浮层，回到 HERO 时自动还原。
- 内页行为：所有内页从首屏开始固定显示顶部浮层，滚动不再自动隐藏；桌面端使用白色长胶囊、细边框、柔和阴影和深色行动按钮，移动端展开菜单以独立圆角卡片显示。
- 实施与验证：更新首页/内页导航调度、`home-minpilot.css`、`site-light.css` 与移动端导航样式；36 个 HTML 导航样式引用和相应脚本/样式缓存版本已同步。新增 `tests/navigation-float-mode.test.cjs`，与既有点阵测试共 5 项通过；JS 语法检查及 `git diff --check` 通过。

## 2026-11-16 · 悬浮导航高度与下拉菜单修正

- 首页高度：修复首页浮层继承 HERO 的 16px 上下内边距且内容栏为 70px 的问题，现与内页统一为无额外内边距、66px 内容栏。
- 下拉菜单：移除浮层下拉面板与触发菜单间的 8px 空隙，面板改为紧贴触发项；鼠标可稳定从“市场”等一级项移入子菜单。

## 2026-11-16 · 内页浮层导航叠放于 HERO 之上

- 修复：取消固定导航导致的 `main` 顶部白色预留区，让各内页的 HERO 背景从页面顶部开始延伸；白色胶囊菜单仅作为叠放其上的导航控件。
- 布局：将原先的内容避让空间转移至 HERO 本身，桌面、平板、手机分别保留 168px、137px、126px 的首屏上内边距，避免面包屑和标题被菜单遮挡。

## 2026-11-16 · 内页 HERO 蓝绿亮色光场

- 视觉：全站内页 HERO 改为浅蓝至薄荷绿的明亮基底，叠加左下蓝色、右上绿色和中央青绿色光场；移除白灰渐变造成的泛白、发灰观感。
- 层级：文字保持深色，白色只用于信息卡和浮层导航；内容容器位于光场之上，确保可读性和页面整体的金融科技质感。

## 2026-11-16 · 内页 HERO 底部模拟账户提示条去底色

- 问题：HERO 改为蓝绿光场后，`.hero-ticker` 提示条仍自带淡蓝白渐变底色（`rgba(237,242,255)` 系），与 HERO 底色不一致，提示条区域呈现一条明显异色带。
- 修复：`site-light.css` 中移除提示条自带的 `background` 渐变与顶部 `mask-image` 渐隐（后者仅为融合色带而设），文字直接悬浮在 HERO 光场底色上。
- 缓存：34 个内页 HTML 的 `site-light.css` 引用版本 `v=457` → `v=458`；首页不引用该文件，根目录镜像无需变更。
- 发布：提交 `0261ca8` 推送 `main`，本次 Pages 工作流部署成功；已验证 `about.html` HTTP 200 且线上 CSS 含 `background: none` 新规则。

## 2026-11-16 · learn.html 高频术语数量修正

- 问题：用户反馈知识中心页 HERO 元信息「高频术语 10 个」与下方实际 9 个术语卡不符。
- 排查：全站核对了 learn/platform-tutorial/news/rewards/account-types/demo/products/account-real/customer-complaint/about/licenses 等页的数量声明（板块数、模块数、FAQ 数、材料数、渠道数等），仅 learn.html 存在 2 处不一致。
- 修复：learn.html HERO 元信息与学习路径第 1 步的「10 个」均改为「9 个」，与术语卡数量及区块副标题「9 个最常用交易术语」对齐。
- 发布：提交 `c965ed5` 推送 `main`，本次 Pages 部署成功；已验证线上 learn.html 两处文本均为「9 个」。

## 2026-11-16 · 顶部“下载 APP”按钮统一品牌主行动色

- 视觉：移除首页浮层和内页顶部导航中的黑色按钮，统一使用网站蓝绿主渐变（蓝 → 青蓝 → 深绿），文字与箭头固定为白色。
- 一致性：首页 HERO 内、首页滚动后的浮层，以及下载页和其他内页均使用同一套按钮底色、文字色与悬停深色渐变，避免下载页出现黑底绿字。
- 修复：下载页按钮因携带当前页标记而被通用 `.current-page` 绿字规则覆盖；现仅对导航内该按钮显式保持白字，其他菜单当前页状态不受影响。

## 2026-11-17 · 平台下载入口拆分与双页面重设计

- 目标：将原“下载中心”替换为 `SmartHSB APP` 与 `MetaTrader 5` 两个独立入口；全站“下载 APP”按钮统一指向 SmartHSB APP。
- 页面：基于 TMP 中经确认的产品文案创建 `download-app.html` 和 `download-mt5.html`。APP 页聚焦开户、KYC、出入金与移动交易；MT5 页聚焦 Windows/iOS/Android 终端、专业分析与 HSB 账户登录。
- 设计：新增受限作用域的 `download-platforms.css`，以蓝、青蓝、薄荷绿和浅色光场组织页面；设备模拟图使用既有轻浮动，流程/下载卡提供交互反馈，并支持 `prefers-reduced-motion` 与站内动效开关。
- 导航：桌面与移动端平台菜单均替换为两个独立链接；旧 `download.html` 仍保留为历史地址，当前站内不再链接。

## 2026-11-17 · 双下载页文本留白修正

- 修复：下载页功能卡受内页通用规则影响，左右内边距被重置为零，导致标题和正文贴近边框。现为两页卡片设置稳定的 32px 左右留白，并在手机端降为 24px。
- 修复：MT5 页面产品说明区扩展至内容容器全宽，以匹配页面版心并消除右侧空白。
- 发布策略：按用户要求，后续改动仅完成本地提交存档；收到明确发布指令前，不推送 GitHub 或触发 Pages 部署。

## 2026-11-17 · SmartHSB APP 与 MT5 功能关系修正

- 事实校正：SmartHSB APP 支持注册开户、身份验证、入金出金、账户管理、行情查看与下单交易；MetaTrader 5 是可选的专业分析与交易终端，其限制仅为不提供注册功能。
- 修复：两页删除“需通过 MT5 下单”“必须配合使用”及“APP 不能交易”等错误表述；改为两端可独立使用、可登录同一 HSB 账户，用户可按需要选择。
- 验证：新增内容回归测试，确保后续修改不会重新引入上述错误口径。

## 2026-11-17 · MT5 Hero 设备示意层级修正

- 问题：MetaTrader 5 Hero 中的设备图标组覆盖笔记本键盘区域，两个视觉组件发生不必要的重叠。
- 修复：Windows、iOS、Android 图标组移至右下角独立区域，避免覆盖笔记本键盘区域。

## 2026-11-17 · 双下载页 Hero 居中与 APP 说明区视觉补全

- 根因：旧下载页的双列 Grid 轨道与子项定位被新视觉样式继承；虽然容器设置为居中，手机仍固定在左列，笔记本则落在自动布局列。
- 修复：Hero 视觉容器重置为单一 Grid 区域，手机与笔记本均以大卡片中心定位；下载平台图标保持右下角浮层，避免再次挤偏主设备。
- 修复：SmartHSB APP 的“什么是”说明区原本保留了右侧视觉栏却未放置内容。现以居中的账户概览卡补全该栏，并在 900px 以下改为单列，避免文字与图形互相压迫。
- 验证：下载页回归测试覆盖主设备居中规则、图标位置、说明区账户卡与产品功能口径。

## 2026-11-17 · 首页 HERO 市场信号

- 目标：在现有 K 线交易大厅中表达贵金属、股指、外汇与能源四类交易产品，不改变当前 Canvas、中心品牌字、CTA、风险提示和机构徽章构成。
- 实施：四个低饱和线框信号直接绘制在既有 Canvas 中，绑定同一透视投影与景深，沿 K 线通道从远景推进；桌面端显示短中文标签，移动端仅显示图形。
- 约束：信号只使用左右外侧通道，并在靠近镜头或过远时淡出，以避开中心品牌区；系统减少动效与站内动效关闭时，Canvas 继续显示静态终态。
- 视觉调整：按用户确认，四个标签统一改为 `Metals`、`Indices`、`Forex`、`Energy`；图形与标签统一为风险提示同款琥珀黄 `#FFD35C`，提高深色背景中的辨识度。
- 偏离修正：此前误将项目规则中的旧版“光门、人物”描述用于当前页面判断；经核实，当前首屏为 K 线交易大厅 Canvas，后续以当前代码与页面为准。

## 2026-11-17 · 联系我们页删除留言表单与社媒关注模块

- 需求：用户要求去掉「联系我们」页的「给我们留言」（Message 表单）与「关注我们」（Follow Us 社媒卡片）两个模块。
- 实施：删除 contact.html 中两个 section；HERO 主按钮原锚点 `#message` 失效，改为「帮助中心」主按钮 +「入金出金帮助」次按钮；CTA 区块前残留注释同步修正。
- 检查：HTML 解析通过，`git diff --check` 无空白错误，页面内无 `#message` / 给我们留言 / 关注我们 残留引用。
- 状态：提交后仅本地存档，未推送（遵照 2026-11-16 发布流程规则）。

## 2026-11-17 · 联系我们页渠道卡占位链接删除

- 需求：接上轮删除留言/社媒模块后，继续去掉客服热线、WhatsApp、邮箱三张渠道卡片中的占位操作链接「拨号 →」「发起聊天 →」「写信 →」（均指向"即将开放" toast）。
- 实施：仅删除三个 `<a class="link">` 元素，号码与邮箱本体保留。
- 检查：HTML 解析通过，无残留引用，`git diff --check` 干净。
- 状态：提交 `2dfd5d2`，仅本地存档未推送（main 领先远端 3 个提交）。

## 2026-11-17 · 真实账户页 CTA 改为模拟账户

- 背景：网站暂不能开通真实账户，真实账户页的开通按钮指向"请在 APP 内开户"提示，与 CTA 语义不符。
- 改动（account-real.html）：HERO 主按钮「立即开通真实账户」→「立即开通模拟账户」（href 改为 demo.html）；次按钮「先开模拟账户练手」→「查看账户类型」（href 改为 account-types.html）；页底 CTA 按钮同步改为「立即开通模拟账户」；「3 步开通」第 1 步说明文字同步改为 APP 内开户表述。
- 全站排查：其余「开通真实账户」出现处均为 FAQ 标题或说明文字（account-real FAQ、about、learn-basic、tutorial-open），非操作按钮，予以保留。
- 状态：仅本地存档未推送。

## 2026-11-17 · 积分奖励模块整体下线

- 需求：删除积分奖励模块及全站相关内容。
- 实施：删除 `website/rewards.html` 整页；34 个内页 + 首页镜像的桌面导航、移动导航、页脚链接移除 rewards 入口；promotions 页删除 HERO 次按钮、「积分兑换专场」活动卡及积分相关文案；account-types 三张账户对比表删除「HSB 积分奖励」行；account-real 删除「积分与奖励」权益行并调整 FAQ 文案；根目录 index.html 镜像同步删除历史遗留的 rewards-section 区块（此前 8daddee 删除首页区块时镜像未同步）。
- 排查确认：design/ 目录下设计规范文档中的积分提法为内部过程文档，未改动。
- 检查：全部 HTML 解析通过，全站无 rewards/积分 残留引用（design/ 除外）。
- 状态：提交 `b6bfa4e`，仅本地存档未推送。

## 2026-11-17 · 真实账户页权益卡改单行三列

- 背景：积分奖励行删除后 kv-list 仅剩 3 项，原 1fr 1fr 两列网格呈现 2+1 两行，观感失衡。
- 修复：site-light.css 新增 account-real 页专属规则 `.kv-list{grid-template-columns:repeat(3,1fr)}`，桌面单行三列；移动端仍走 page.css 既有单列断点。learn-risk 页仍用两列，不受影响。
- 缓存：site-light.css 版本号按内容哈希更新 69740f2e5e → 4597614283（35 个内页）。
- 状态：仅本地存档未推送。

## 2026-11-17 · MT5 下载页占位二维码换为真实码

- 背景：download-mt5.html 的 iPhone / Android 两卡此前为手绘 SVG 示意占位，不可扫。用户提供两张带 UTM 归因的真实二维码（App Store / Google Play，400×400 PNG）。
- 实施：新图覆盖 assets/img/qr/qr_mt5_ios.png 与 qr_mt5_android.png（下载中心 download.html 同名引用随之统一为同一套真实码）；download-mt5.html 两处占位 SVG 替换为 img 引用；download-platforms.css 补 .mt5-qr-ph img 填充样式。
- 检查：HTML 解析通过、图片校验通过、无「示意图」残留。
- 状态：仅本地存档未推送。

## 2026-11-17 · MT5 下载页二维码悬停放大

- 需求：82px 二维码扫码不便，悬停需自动放大、离开恢复，放大时隐藏鼠标指针。
- 实施：download-platforms.css 为 .mt5-qr-ph 增加 transform-origin 100% 100%（右下角原点，放大向卡片内部延伸，不受卡片 overflow:hidden 裁切）+ 0.25s 过渡；卡片悬停放大 2.4 倍（约 197px）并投影、置顶；悬停在码上时 cursor:none；prefers-reduced-motion 下关闭过渡。
- 触发区域用整卡悬停而非仅码体，避免放大后指针落点在元素外造成缩放闪烁循环。
- 缓存：download-platforms.css 版本 fe9fefb799 → 按内容哈希更新（download-mt5 / download-app 两页引用）。
- 状态：仅本地存档未推送。

## 2026-11-17 · 促销活动页整体下线

- 需求：删除促销活动模块，并清理其它页面的对应信息。
- 实施：删除 `website/promotions.html` 整页；36 个页面（34 内页 + 网站首页 + 根目录镜像）移除桌面导航「交易」下拉、移动导航、页脚「关于」列的促销活动入口；account-types 三张对比表删除「新客活动」行；account-real 删除「专属促销」权益行并调整 FAQ 答案；fraud-warning 官方渠道提示改为「所有官方公告」。
- 连带：account-real 权益卡由 3 项降为 2 项，site-light.css 页级网格 3 列回调 2 列，避免留空位；CSS 版本哈希 4597614283 → 0e5ff37172。
- 未改（待定）：user-agreement.html 整页为促销活动条款（页脚「条款与条件」指向它，37 处）；news 页「活动预告」栏目；help 页违规条款中的促销滥用表述。
- 检查：全量 HTML 解析通过，全站无 promotions 残留引用。
- 状态：仅本地存档未推送。

## 2026-11-17 · 促销清理范围修正（恢复新客活动）

- 背景：促销活动页删除是因为「仅有新客活动（首次入金最高赠 $350）、其它促销尚未上线」，而上一轮清理把新客活动一并删掉，范围过大。
- 恢复：account-types 三张对比表「新客活动 支持」行 ×3；account-real 权益卡恢复为首位（表述具体化为「首次入金最高赠 $350」）并恢复 FAQ 中的新客活动提法；fraud-warning 恢复「所有活动与促销信息」原表述（新客活动仍在，该提示成立）。
- 连带：account-real 权益卡回到 3 项，site-light.css 网格恢复单行三列；CSS 版本哈希 0e5ff37172 → 91347ec348。
- 维持删除：promotions.html 整页及全站导航/页脚入口。
- 判定保留：user-agreement.html（促销条款仍适用于新客活动）、news「活动预告」栏目、help 违规条款中的促销滥用表述。
- 检查：全量 HTML 解析通过。状态：仅本地存档未推送。

## 2026-11-17 · 促销页重构（仅保留新客赠金）

- 依据：HSB 官网促销页（hsb.co.id/promo）与条款页（syarat-ketentuan）的公开规则，重写为仅含「首次入金最高赠 $350」单一活动。
- 页面结构：HERO（最高 $350 / 真实账户 / 交易赠金）→ 本期活动 4 项要点 → 5 步领取（下载 APP · 开户 KYC · 首次入金 · APP Promo 菜单领取 · 满足手数后提取）→ 四条关键规则 → 为什么放心参与 → 7 条 FAQ → CTA + S&K 脚注。
- 规则来源：赠金不可直接提取、需满足最低手数；仅限真实账户；每人限一次；不可与其它促销同享；刷单/锁单/凑量/多账户/虚假信息/滥用赠金取消资格；条款页 user-agreement.html。
- 入口：36 个页面恢复导航「交易」下拉、移动导航与页脚「交易」列入口，标签为「新客赠金」；促销页自身标记 current-page；sitemap lastmod 更新为 2026-11-17。
- 检查：全站 HTML 解析通过，页内链接全部存在，正文校对通过。
- 状态：仅本地存档未推送。

## 2026-11-17 · 首页模拟账户按钮文案更新

- 需求：首页平台区虹彩胶囊按钮「试用模拟账户」改为「开通模拟账户」。
- 实施：website/index.html 与根目录镜像 index.html 各改 2 处（按钮翻转正/背面各一份文字）。
- 状态：仅本地存档未推送。

## 2026-11-17 · 下载中心删除 MT5 Windows 二维码占位框

- 判断：Windows 用户在桌面端直接点「立即下载」获取 .exe，扫码无意义（手机扫到的安装包不可用），无需预留二维码。
- 实施：download.html MT5 Windows 卡删除 144×144 虚线占位框（含「安装包二维码预留」文案）；platform-pages.css 删除两条 .download-qr-slot 规则（仅此处使用）。
- 缓存：platform-pages.css 版本 5cb2b14061 → a193dbdaa7（9 个引用页面）。
- 检查：HTML 解析通过，全站无 download-qr-slot 残留；该卡为 flex 列布局、无固定高度，删除后不留空档。
- 状态：仅本地存档未推送。

## 2026-11-17 · 批量发布（30 个提交）

- 发布内容：积分奖励模块下线、促销页重构为「首次入金最高赠 $350」、联系我们页删留言与社媒模块、真实账户页 CTA 改模拟账户、MT5 页真实二维码与悬停放大、下载中心删 Windows 二维码占位、首页「开通模拟账户」文案、learn 术语数量修正等。
- 发布：`37f970d..4fc92c3` 推送 main，本次 Pages 工作流 success。
- 验证：线上 promotions.html 三处「参照活动规则，在 APP 首次入金后领取」、无 Promo 残留；download-mt5.html 新文案上线；download.html 无 download-qr-slot 且 CSS 版本 a193dbdaa7；首页「开通模拟账户」2 处；页面均 200。

## 2026-11-17 · 页脚应用商店二维码预览

- 需求：在全站页脚「下载 APP」内，悬停或键盘聚焦 App Store / Google Play 徽章时，右侧二维码应切换为对应渠道的大尺寸二维码；当前保留可替换占位码。
- 实施：`column-home.css` 在共用 `.dl-box` 上增加双渠道状态。App Store 对应 `assets/img/qr/qr_appstore.png`，Google Play 对应 `assets/img/qr/qr_googleplay.png`；常态仍显示「待上线」占位，激活时 QR 框扩至 152px（手机 132px）并在框内显示对应码。未来上架时覆盖同名文件即可，无须修改交互代码。
- 可访问性与动效：`:hover` 和 `:focus-visible` 均触发；`prefers-reduced-motion` 与现有 `body.motion-off` 禁用过渡。
- 缓存：`column-home.css` 内容哈希更新为 `99e8d0fa83`，37 个正式页面及根目录预览镜像同步更新引用。
- 检查：全量 18 项 Node 回归测试通过，`git diff --check` 通过。状态：仅本地存档未推送。

## 2026-11-17 · 删除孤儿页 download.html

- 排查：全站 36 页 + 根镜像中仅 download.html 自身（canonical/og:url）与 sitemap.xml 引用它，导航/页脚/内容均无入口，内容已被 download-app 与 download-mt5 两页覆盖。
- 实施：删除 website/download.html；sitemap.xml 移除该条；tutorial-install.html 3 处「下载中心」文字改为具体页名（前往 SmartHSB APP 下载页 / SmartHSB APP 下载页 / MT5 下载页）。
- 连带：占位审计文档 5.1/5.3 与汇总表同步更新（占位 39→38）。
- 检查：全站无 download.html 残留引用；HTML/XML 解析通过。
- 状态：仅本地存档未推送。

## 2026-11-17 · 交易工具页删除汇率换算计算器

- 需求：去掉「汇率换算计算器」功能卡（该功能原为占位，点击弹「计算器即将开放」）。
- 实施：删除卡 02 整卡，卡 03（经济新闻与趋势）编号改 02；HERO lead 去掉「200+ 货币汇率换算」、元信息删「汇率 200+ 货币」、副标题改「信号 · 财经资讯」；卡片网格 g3 → g2。
- 连带：占位审计文档同步（交易工具占位 2 → 1，toast 合计 48 处）。
- 检查：HTML 解析通过，页面无「汇率」残留。
- 状态：仅本地存档未推送。

## 2026-11-18 · 开户与入金文案统一调整

- 需求：按用户 8 条指定文案修改，统一「注册 / KYC / 最低入金 / MT5 标题」表述。
- 实施：
  - download-app.html：「手机号或邮箱快速注册」→「手机号快速注册」；「入金出金与多币种」→「入金出金」；「多币种账户余额管理」→「账户余额管理」。
  - account-real.html：步骤 3 标题与正文「选择账户并入金 / 选择最符合您需求的账户类型…」→「开户完成并入金 / 开户完成后并入金…」；HERO 流程节点 03 同步改为「开户完成并入金」。
  - tutorial-open.html：开户步骤「选择账户并入金」→「开户完成并入金」。
  - deposit-withdraw.html：统计卡与 HERO 提示、FAQ 答案共 3 处「最低入金」→「首次最低入金」。
  - download-mt5.html：标题「下载 MetaTrader 5 HSB」→「下载 MetaTrader 5」（含注释）。
  - sitemap.xml：account-real / deposit-withdraw / tutorial-open lastmod 更新为 2026-11-18。
- 未动（非本次指定字符串）：download-app.html 两处「手机号或邮箱注册」描述、download-mt5.html meta description「MetaTrader 5 HSB 官方下载」，待用户确认是否同步。
- 检查：5 个页面 HTML 解析通过，git diff --check 通过。
- 状态：仅本地存档未推送（commit b441b9a）。

## 2026-11-18 · 全站同类文案同步（承接上一轮 8 条指定修改）

- 范围（用户确认：一、二、四全改 + 三中仅叙述句与渠道页统计卡）：
  - 注册方式 3 处「手机号或邮箱注册」→「手机号注册」（download-app 流程节点 02 + FAQ、download-mt5 FAQ）。
  - download-mt5.html meta/og description「MetaTrader 5 HSB 官方下载」→「MetaTrader 5 官方下载」。
  - 「最低入金」加「首次」共 15 处叙述句与统计卡：account-real HERO/FAQ、demo 3 处、learn-basic 2 处、products HERO 信息条/FAQ、首页信息条（website + 根镜像）、deposit-bank/ewallet/va 统计卡、deposit-withdraw HERO lead/统计卡。
  - account-real FAQ ③「选择账户类型并通过官方隔离账户入金」→「开户完成并入金，即可开始交易」。
  - sitemap lastmod：demo / learn-basic / products / deposit-bank / deposit-ewallet / deposit-va 更新为 2026-11-18。
- 保留不改（口径确认）：账户对比表列头及卡片（account-types、tutorial-open、tutorial-manage、help A12 表头）、products「最低入金」小节标题、deposit 渠道页费用表行标签——均为门槛概念/表格标签；help D3 原文已是「首次最低入金」。
- 检查：12 个 HTML 解析通过，git diff --check 通过，全站无「手机号或邮箱 / MetaTrader 5 HSB / 选择账户」残留。
- 状态：仅本地存档未推送（commit a85d818）。

## 2026-11-18 · 存档并推送发布（含首页恢复原样）

- 背景：推送前发现工作区有一批未提交改动，内容为撤销 ddd7c66（首页市场面板重构）与 62ac00a（标题居中）——恢复世界地图/统计模块、.overview 内边距 106px 0 0、sitemap 首页 lastmod 2026-11-04，CSS 内容哈希同步再生成（home-minpilot 2d804ac11b、hero-holo 0fbf2f4bea）。经用户确认按「先提交恢复改动，再推送」执行。
- 实施：7bd5f39 提交恢复改动 → 推送 main（364d0d7..7bd5f39，共 14 个提交，含本轮全站文案同步与首页两个改动的历史提交）。
- 部署跟踪：Actions run #38（对应 7bd5f39）completed success，https://github.com/MrRoam/smartHSB/actions/runs/44216109158 。
- 线上验证：首页 HTTP 200；包含「首次最低入金门槛约 $25」（文案同步已生效）、overview-world（原始首页结构已恢复）、home-minpilot.css?v=2d804ac11b（恢复版 CSS）；account-real.html 含「开户完成并入金」「首次最低入金 Rp400.000（约 $25）即可开始真实交易」。
- 状态：已推送并部署成功，origin/main = 7bd5f39，工作区干净。

## 2026-11-18 · 首页概览改为市场品种面板

- 需求：将「一个账户，打开全球市场」下的世界地图、四个浮动标签和统计栏替换为四类交易品种面板；删除「市场各有节奏。选择你的关注。」标题模块。
- 实施：复用此前已存档的市场面板结构与交互，保留贵金属、股指、外汇、能源四个切换标签、示例报价、非实时标注、图表展示声明及全品种入口。首页概览只保留主标题；市场面板顶部保留「贵金属 2 · 股指 5 · 外汇 17 · 能源 1 · 共 25 个品种」摘要。
- 同步：正式首页 `website/index.html` 与根目录预览镜像 `index.html` 均更新；sitemap 首页 lastmod 更新为 2026-11-18。
- 检查：新增首页市场面板位置回归测试；全量 19 项 Node 测试与 `git diff --check` 通过。状态：仅本地存档未推送。
