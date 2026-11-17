# SmartHSB 网站占位入口审计（2026-11-17）

- **范围**：`website/` 全部 36 个页面 + 根目录 `index.html` 预览镜像 + `assets/js/`、`assets/css/`。
- **方法**：全站扫描 `href="#"`、死锚点、缺失目标文件、`toast()` 占位提示、待上线/待接入文案、占位图形与死代码；逐项核对引用关系。
- **结论**：占位入口共 6 类 58 处；无死链、无死锚点、无禁用控件；MT5 Windows 二维码占位已于当日删除。

## 一、占位入口汇总

| # | 类别 | 位置 | 数量 | 当前行为 |
|---|---|---|---|---|
| 1 | 语言开关 | 全部 36 页导航右上角 `.language-placeholder` | 36 | 点击弹「多语言即将开放」 |
| 2 | 资讯文章详情 | `news.html` 8 张文章卡 | 8 | `href="#"`，点击弹「文章详情即将开放」，无详情页 |
| 3 | 交易工具 | `trading-tools.html` | 2 | 「查看信号 →」（交易信号 · Trading Central）弹「信号即将开放」；「打开计算器 →」（汇率换算计算器）弹「计算器即将开放」 |
| 4 | APP 下载二维码（下载页） | `download-app.html` | 2 | 手绘 SVG 示意图（App Store / Google Play），不可扫 |
| 5 | APP 上架状态（下载中心 + 页脚） | `download.html`、全站页脚 | 39 | 见下方 5.1 / 5.2 |
| 6 | 数据与业务接口 | `live-quotes` / `products` / `economic-calendar` / `demo` | 4 页 | 见下方第六节 |

合计 toast 占位提示 49 处、占位图形/文案 9 处。

## 二、语言开关（36 页 × 1）

- 位置：每页导航 `<button class="language-placeholder" onclick="toast('多语言即将开放')">中文</button>`。
- 计划：按三语规范（中文 / EN / ID）上线后整体替换，占位期间保留。

## 三、资讯文章详情（8 篇）

- 位置：`news.html` 第 80、85 行等 8 张 `<a class="art">` 文章卡。
- 现状：`href="#"` + toast，无 `news-detail` 页面；文章标题、分类、日期已在卡片上完整展示。
- 计划：等详情接口/内容生产后再建详情页；占位期间保留。

## 四、交易工具（2 个入口）

| 入口 | 区块标题 | 行为 |
|---|---|---|
| 查看信号 → | 交易信号 · Trading Central | toast「信号即将开放」 |
| 打开计算器 → | 汇率换算计算器 | toast「计算器即将开放」 |

- 计划：等信号源/计算器功能对接后替换为真实工具页；占位期间保留。

## 五、APP 下载链路（APP 未上架期间）

### 5.1 下载页（`download-app.html` 2 处 + `download.html` 3 处文案）

- `download-app.html`：iPhone / Android 两卡二维码为 SVG 示意图（`aria-label` 含「示意图」）。
- `download.html` APP 区两卡：文案「上架后开放下载」；APP 区底部注明「正在上架审核中，正式商店链接将在上线后第一时间更新」。
- 页内商店按钮与页脚徽标均指向 `download-app.html`（内部页），不指向商店，无死外链。

### 5.2 全站页脚「下载 APP」盒（36 页 × 1）

- 结构：`.dl-box` 内两个商店徽标（指向 `download-app.html`）+ `.dl-qr` 二维码位。
- 默认态：二维码图标 + 「待上线」文字。
- 交互（2026-11-17 新增，提交 `364d0d7`）：悬停/键盘聚焦 App Store 徽标时，二维码放大并预览 `assets/img/qr/qr_appstore.png`；聚焦 Google Play 徽标预览 `qr_googleplay.png`（纯 CSS `:has()` 实现，`prefers-reduced-motion` 下关闭过渡）。
- 占位性质：`qr_appstore.png` / `qr_googleplay.png` 指向应用商店 SmartHSB 搜索页，APP 上架后需用真实商店链接重新生成（脚本约定：`08-脚本工具/make_qr.py`）。
- 遗留小问题：`.dl-qr` 的 `data-qr="assets/img/qr_app_download.png"` 指向**不存在的文件**，且无任何 JS/CSS 消费该属性，属无效残留，可择机清理。

### 5.3 上架后待办

1. 用真实 App Store / Google Play 链接重新生成两张二维码，覆盖 `qr_appstore.png` / `qr_googleplay.png`；
2. 替换 `download-app.html` 两张 SVG 示意图为真实码；
3. 页脚 `.dl-qr` 默认态改为显示真实码、移除「待上线」标签；
4. `download.html` 删除「上架后开放下载 / 正在上架审核中」文案，商店徽标改指向真实商店页。

## 六、数据与业务接口（4 页）

| 页面 | 占位内容 | 页内说明 |
|---|---|---|
| `live-quotes.html` | 行情为静态示例数据 | 「示例数据，实时行情接口预留」 |
| `products.html` | 品种行情为静态示例 | 「示例数据，实时行情接口预留」 |
| `economic-calendar.html` | 日历事件为原稿示例 | 「财经日历数据接口待接入」 |
| `demo.html` | 申请表单被 JS 拦截（`assets/js/trading-pages.js`），不发送短信、不创建账户 | 「短信验证与开户接口待接入」 |

- 计划：等真实行情源、日历源、开户/短信接口对接后替换；当前均有明确用户可见的说明，风险可控。

## 七、死代码（1 处）

- `assets/js/subpages.js` 的留言表单分支（`.page-contact form.form-grid` 绑定、「留言接口待接入」提示）。
- 背景：2026-11-17 已删除 `contact.html` 留言表单，该分支不再被任何页面触发。
- 建议：下次触及该文件时一并清理。

## 八、健康项（本次复查确认）

- 全站无失效站内链接（所有 `href` 目标文件存在）；
- 全站无死锚点（`#xxx` 均能找到对应 `id`）；
- 无 `javascript:void(0)`、无 `aria-disabled` 禁用控件；
- MT5 Windows 卡二维码占位框已删除（Windows 端直接下载 `.exe`，无需扫码）。

## 九、决策记录

2026-11-17 用户确认：

1. 语言开关：保留占位，最后处理；
2. APP 下载链路：当前指向合理，上架后补两条商店链接即可；
3. news 8 篇详情：等实际接口对接，暂保留占位；
4. MT5 Windows 二维码：不需要，已删除占位框（提交 `chore: drop MT5 Windows QR placeholder slot`）；
5. 行情 / 日历 / 开户·短信：等实际接口对接。
