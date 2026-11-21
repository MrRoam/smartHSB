# SmartHSB 执行记录

## 2026-11-21 · 公司名称与监管分工文案核查

- 确认 download-app.html 有 1 处 Semasta 拼写错误，已统一为 PT Handal Semesta Berjangka。
- 官方依据：HSB https://www.hsb.co.id/about 仍披露 BAPPEBTI、OJK、Bank Indonesia 资格；OJK 与央行 2025-01-10 联合公告明确证券类及货币/外汇市场衍生品的监管移交范围，不能由此推断 BAPPEBTI 商品期货牌照自动失效。
- 调整 APP 下载、关于、账户类型、真实账户、牌照、产品、活动页的笼统监管表述；首页及根镜像的结构化描述改为按适用业务范围监管。牌照页补充分工解释及官方来源链接，纠正央行编号被误称为系统重要性机构备案的问题。
- 保留既有资格编号与历史评级；未采用截图中未经核实的“原持牌/全部职责移交”表述。
- 验证：全站正式 HTML 无 Semasta、3 家监管、系统重要性机构备案残留；git diff --check 通过。全量测试 27/28 通过；既有财经日历测试因 HEAD 的 market-content.css 已缺少 .calendar-filter-row 失败，本次未改日历代码。
- 按用户既有先存档、按要求再发布的偏好，仅本地提交。本次核查前工作区干净。
