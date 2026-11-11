# SmartHSB 已验证经验

## Pages 发布目录与触发条件

- 适用条件：仓库仍使用 `.github/workflows/pages.yml` 中的现有发布配置。
- 做法：正式页面与资源放在 `website/`；最终改动同步至 `main`，再按本次提交 SHA 检查部署结果。根目录首页仅用于本地预览。
- 依据：工作流监听 `main` 的 push，并支持手动触发；上传路径明确为 `./website`。根目录文件不在 Pages 上传目录内，仅推送其他分支不会触发现有 push 发布流程。
- 验证：2026-11-11，北京时间；Windows / PowerShell，本地 `main` 基于 `a5734eb`，已读取实际工作流并获取 `origin/main`。
- 复用前核对：检查当前工作流、远端及发布目录；配置发生变化时更新本条。
