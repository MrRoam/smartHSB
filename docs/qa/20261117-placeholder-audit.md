# SmartHSB 网站占位入口审计（2026-11-17 首查 / 2026-11-18 全站复查）

- **范围**：`website/` 全部页面 + 根目录 `index.html` 预览镜像 + `assets/js/`、`assets/css/` + `sitemap.xml`。
- **方法**：全站扫描 `href="#"`、死锚点、缺失目标文件、`toast()` 占位提示、待上线/待接入文案、占位图形与死代码；逐项核对引用关系；2026-11-18 复查新增：sitemap 与实际页面比对、缓存版本参数核对、根目录镜像一致性比对、外链清单。
- **最新结论（2026-11-18）**：占位入口共 6 类 43 处；无死链、无死锚点、无缺失资源（唯一例外见 5.4 死属性）；发现 4 项与占位无关但值得优化的全站性问题（见第十一节）。

## 一、占位入口汇总（2026-11-18 复查口径）

| # | 类别 | 位置 | 数量 | 当前行为 |
|---|---|---|---|---|
| 1 | 语言开关 | 全部 35 页（含 404.html）导航右上角 `.language-placeholder` | 35 | 点击弹「多语言即将开放」 |
| 2 | 资讯文章详情 | `news.html` 8 张文章卡 | 8 | `href="#"`，点击弹「文章详情即将开放」，无详情页 |
| 3 | 交易工具 | `trading-tools.html` | 1 | 「查看信号 →」（交易信号 · Trading Central）弹「信号即将开放」 |
| 4 | APP 下载二维码（下载页） | `download-app.html` | 2 | 手绘 SVG 示意图（App Store / Google Play），不可扫 |
| 5 | APP 上架状态（下载页 + 页脚） | `download-app.html`、全站页脚 | 见 5.2 | 见下方 5.1 / 5.2 |
| 6 | 数据与业务接口 | `live-quotes` / `products` / `economic-calendar` / `demo` | 4 页 | 见第六节 |

- toast 占位提示合计 **44 处**（35 语言 + 8 文章详情 + 1 信号）；2026-11-17 首查为 48 处，减少 4 处：`download.html` 删除（语言开关 ×1）、汇率换算计算器卡删除（×3）。
- 另有 36 处 `data-qr` 死属性指向不存在的 `qr_app_download.png`（非交互入口，见 5.4）。

## 二、语言开关（35 页 × 1，含 404.html）

- 位置：每页导航 `<button class="language-placeholder" onclick="toast('多语言即将开放')">中文</button>`。
- 计划：按三语规范（中文 / EN / ID）上线后整体替换，占位期间保留。

## 三、资讯文章详情（8 篇）

- 位置：`news.html` 第 80、85 行等 8 张 `<a class="art">` 文章卡。
- 现状：`href="#"` + toast，无 `news-detail` 页面；文章标题、分类、日期已在卡片上完整展示。
- 计划：等详情接口/内容生产后再建详情页；占位期间保留。

## 四、交易工具（1 个入口）

| 入口 | 区块标题 | 行为 |
|---|---|---|
| 查看信号 → | 交易信号 · Trading Central | toast「信号即将开放」 |

- 变更：汇率换算计算器卡片已于 2026-11-17 应用户要求整体删除（含 HERO 文案与元信息），工具集剩信号、财经资讯两项，网格 g3 → g2。
- 计划：等信号源对接后替换为真实工具页；占位期间保留。

## 五、APP 下载链路（APP 未上架期间）

### 5.1 下载页（`download-app.html` 2 处）

- `download-app.html`：iPhone / Android 两卡二维码为 SVG 示意图（`aria-label` 含「示意图」）。
- 页内商店按钮与页脚徽标均指向 `download-app.html`（内部页），不指向商店，无死外链。
- 原下载中心页 `download.html` 为孤儿页面（全站无入口），已于 2026-11-17 删除，并同步移除 sitemap 条目、修正 `tutorial-install.html` 中 3 处「下载中心」文字表述。

### 5.2 全站页脚「下载 APP」盒（35 页 × 1，含 404.html）

- 结构：`.dl-box` 内两个商店徽标（指向 `download-app.html`）+ `.dl-qr` 二维码位。
- 默认态（2026-11-18 更新，提交 `c531b5c`）：二维码图标 + 「扫码下载」文字（原「待上线」已改）。
- 交互（提交 `364d0d7`，后经 `98af188` / `ec3a043` 优化）：悬停/键盘聚焦 App Store 徽标时，二维码放大并预览 `assets/img/qr/qr_appstore.png`；聚焦 Google Play 徽标预览 `qr_googleplay.png`（纯 CSS `:has()` 实现，`prefers-reduced-motion` 下关闭过渡）。
- 占位性质：`qr_appstore.png` / `qr_googleplay.png` 指向应用商店 SmartHSB 搜索页，APP 上架后需用真实商店链接重新生成（脚本约定：`08-脚本工具/make_qr.py`）。

### 5.3 上架后待办

1. 用真实 App Store / Google Play 链接重新生成两张二维码，覆盖 `qr_appstore.png` / `qr_googleplay.png`；
2. 替换 `download-app.html` 两张 SVG 示意图为真实码；
3. 页脚 `.dl-qr` 默认态改为显示真实码、移除「扫码下载」占位文字；
4. 商店徽标（页脚与 `download-app.html`）改指向真实商店页。

### 5.4 `.dl-qr` 死属性（已清理，2026-11-18）

- 原状：每页页脚 `.dl-qr` 均带 `data-qr="assets/img/qr_app_download.png"`（35 页 + 404.html = 36 处），文件不存在且无消费方。
- 处理（2026-11-18，用户确认）：全站 36 处属性已批量删除，无任何功能影响；全站 `data-qr` 引用清零。

## 六、数据与业务接口（4 页）

| 页面 | 占位内容 | 页内说明 |
|---|---|---|
| `live-quotes.html` | 行情为静态示例数据 | 「示例数据，实时行情接口预留」 |
| `products.html` | 品种行情为静态示例 | 「示例数据，实时行情接口预留」 |
| `economic-calendar.html` | 日历事件为原稿示例 | 「财经日历数据接口待接入」 |
| `demo.html` | 申请表单被 JS 拦截（`assets/js/trading-pages.js`），不发送短信、不创建账户 | 「短信验证与开户接口待接入」 |

- 计划：等真实行情源、日历源、开户/短信接口对接后替换；当前均有明确用户可见的说明，风险可控。

## 七、死代码（已清理，2026-11-18）

- `assets/js/subpages.js` 的留言表单分支（原第 56–65 行）已于 2026-11-18 删除；`subpages.css` 中孤立的 `.contact-interface-status` 规则一并删除；`node --check` 通过。

## 八、健康项（2026-11-18 复查确认）

- 全站无失效站内链接（所有 `href` 目标文件存在）；
- 全站无死锚点（`#xxx` 均能找到对应 `id`）；
- 除 5.4 死属性外，所有 `img/script/link` 引用的本地资源文件均存在；
- 无 `javascript:void(0)`、无 `aria-disabled` 禁用控件；
- MT5 Windows 卡二维码占位框已删除（Windows 端直接下载 `.exe`，无需扫码）；
- 缓存正确性：所有 CSS/JS 内容变更均伴随引用版本号更新，无「改文件不换版本」导致的旧缓存风险；
- 外链：全站 39 个外部 URL 中，沙箱网络仅能验证 `hsb.co.id`（200）；`download.mql5.com`、`wa.me` 等因沙箱网络限制无法验证，非死链结论，建议浏览器人工抽查。

## 九、决策记录

2026-11-17 用户确认：

1. 语言开关：保留占位，最后处理；
2. APP 下载链路：当前指向合理，上架后补两条商店链接即可；
3. news 8 篇详情：等实际接口对接，暂保留占位；
4. MT5 Windows 二维码：不需要，已删除占位框（提交 `chore: drop MT5 Windows QR placeholder slot`）；
5. 行情 / 日历 / 开户·短信：等实际接口对接。
6. 下载中心孤儿页 `download.html`：确认全站无入口后删除，连带移除 sitemap 条目并修正 `tutorial-install.html` 表述。

## 十、2026-11-17 之后的占位相关变更（截至 2026-11-18 复查）

1. `download.html` 孤儿页删除（页面数 36 → 35，语言开关占位 36 → 35）；
2. 交易工具页汇率换算计算器卡删除（toast 48 → 44）；
3. 页脚 `.dl-qr` 新增商店徽标悬停二维码预览（`364d0d7`），默认文案「待上线」→「扫码下载」（`c531b5c`），徽标样式两轮优化（`98af188`、`ec3a043`）；
4. 全站开户/入金文案统一调整（「手机号注册」「首次最低入金」「开户完成并入金」「下载 MetaTrader 5」），不改变占位性质；
5. 首页市场面板重构后按用户要求恢复原样（提交/撤销均未影响占位清单）。

## 十一、2026-11-18 全站复查新发现（均已处理）

1. **sitemap 死条目（已处理）**：移除已删页 `rewards.html` 条目；同时补录 `download-app.html`、`download-mt5.html`（提交 `3e71d9d`）。现 sitemap 34 条与 website/ 34 个正式页面一一对应。
2. **根目录镜像落后（已处理）**：已按 `website/index.html` 重新生成根镜像，`site-motion.css` / `tilt-up.css` / `type-in.js` 版本参数、H2 响应式换行 `br.h2-br-m`、`.market-explorer` 的 `aurora-frame` 结构差异全部消除；前缀规范化后逐行 diff 为 0。
3. **版本参数不统一（已处理）**：全部 40 个版本化 CSS/JS 的引用参数已统一重建为部署内容 md5（LF 归一化）前 10 位，`subpages.js`、`pop-in.js` 两套 URL 分裂问题随之消除；全站 661 处版本引用与文件内容哈希比对 0 差异。
4. **死代码（已处理）**：见第七节。
