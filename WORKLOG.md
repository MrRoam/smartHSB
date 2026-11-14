# SmartHSB 执行记录

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
