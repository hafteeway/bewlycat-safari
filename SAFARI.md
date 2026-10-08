# Safari 安装与签名指南

本 fork 将 BewlyCat 作为 Safari Web Extension 使用。Safari 的 `.app` 只是扩展安装外壳，不提供独立 B 站客户端。保留原项目 [LICENSE](LICENSE) 及原作者、贡献者信息。

## 选择安装方式

| 方式 | 适合谁 | 退出 Safari 后 |
| --- | --- | --- |
| Safari 27 临时加载扩展 ZIP | 先试用，不想安装 Xcode | 扩展被移除，需要重新加载 |
| 本机 Xcode 开发签名 | 长期在自己的 Mac 使用 | 本机验证可保留启用；仍受签名证书和配置有效期限制 |
| Developer ID 签名及公证 / App Store | 面向其他用户正式分发 | 本仓库暂未提供 |

**Releases 中的 Web Extension ZIP 是临时试用包，不是永久安装包。** 没有提供携带维护者个人开发签名的公开应用包。

## 方式一：Safari 27 临时试用

1. 从本仓库 Releases 下载 `BewlyCat-Safari-WebExtension.zip`。
2. 打开 Safari → Settings（设置）→ Advanced（高级），开启 Show features for web developers（显示网页开发者功能）。
3. 在 Developer（开发者）中点击 Add Temporary Extension…（添加临时扩展），选择下载的 ZIP。按 Safari 提示由本人完成认证。
4. 在 Extensions（扩展）中启用 BewlyCat，允许访问需要使用的 `bilibili.com` 和 `hdslb.com` 站点。
5. 刷新 B 站标签页。

Apple 的临时加载机制会在退出 Safari 或 24 小时后移除扩展。适合试用；长期使用请采用下面的开发签名方式。

## 方式二：在自己的 Mac 上开发签名

要求：macOS 13 及以上、Safari 18 及以上、完整 Xcode、Node.js 与 pnpm。当前实际编译环境为 Xcode 27，历史系统版本未全部验证。

1. 安装并打开 Apple 官方 Xcode，完成其要求的组件安装。
2. 在 Xcode → Settings（设置）→ Accounts（账户）登录你自己的 Apple Account。密码、验证码与 Keychain（钥匙串）授权必须本人完成。
3. 下载本仓库源码，或克隆后进入目录，执行：

```bash
git clone https://github.com/hafteeway/bewlycat-safari.git
cd bewlycat-safari
pnpm install --frozen-lockfile
pnpm build-safari
pnpm convert-safari
```

4. 打开生成的 `safari-native-macos/BewlyCat Safari/BewlyCat Safari.xcodeproj`。
5. 在项目设置中，分别选中 **BewlyCat Safari** 与 **BewlyCat Safari Extension** 两个 Targets（目标）。在 Signing & Capabilities（签名与功能）中勾选 Automatically manage signing（自动管理签名），将 Team（团队）设为自己的团队；两个目标必须一致。若默认 Bundle Identifier 已被占用，为应用和扩展选择你自己的唯一前缀，扩展标识必须以应用标识加 `.` 开头。
6. 选择 My Mac（我的 Mac）并构建。若 Keychain 请求 `codesign` 使用开发签名私钥，由本人允许。不要将私钥、证书导出包或账户凭据上传到 GitHub。
7. 在 Xcode 的 Products（产品）中对 BewlyCat Safari.app 选择 Show in Finder（在访达中显示）。把应用复制到 Applications（应用程序），打开一次。
8. Safari → Settings（设置）→ Extensions（扩展），勾选 BewlyCat并完成本人认证；允许 B 站相关站点访问。开发签名完整时不需要启用 Allow unsigned extensions（允许未签名扩展）。
9. 刷新 B 站，检查首页及视频评论区。最后退出并重新打开 Safari，确认扩展仍启用。

建议把构建缓存放到 `/private/tmp`，避免同步服务给应用包添加扩展属性导致签名失败。也可使用命令行构建；将 `YOUR_TEAM_ID` 替换为自己的团队标识：

```bash
xcodebuild \
  -project "safari-native-macos/BewlyCat Safari/BewlyCat Safari.xcodeproj" \
  -scheme "BewlyCat Safari" -configuration Release \
  -destination 'platform=macOS' \
  -derivedDataPath /private/tmp/bewlycat-safari-build \
  CODE_SIGN_STYLE=Automatic CODE_SIGN_IDENTITY="Apple Development" \
  DEVELOPMENT_TEAM=YOUR_TEAM_ID -allowProvisioningUpdates build
```

构建产物位于 `/private/tmp/bewlycat-safari-build/Build/Products/Release/BewlyCat Safari.app`。

开发签名需要按自己的证书/配置有效期维护；它不等于 Developer ID 分发签名或 App Store 上架。不要假定其他人的开发签名包能在自己的电脑长期工作。

## 更新已有安装

保留同一组 Bundle Identifier 和 Team，重新构建签名后替换 Applications 中的应用并刷新 B 站。保留旧版本备份，验证后再处理。只保留一个正式安装副本，避免临时构建副本被 Safari 重复识别。

Safari 扩展资源是打包时复制到 Xcode 工程内的。源码修改后需重新构建网页扩展，并重新生成工程或更新 Extension/Resources，不能只修改源码就以为已更新安装。

## 已适配的内容

- Safari 登录状态：使用标签页激活与 B 站页面加载事件代替不可用的 `cookies.onChanged`。
- Safari `storage.sync` 不提供跨设备同步：禁用云同步开关；保留本地设置和导入／导出。
- 原生评论区：给嵌套 Shadow DOM 注入主题样式，正文、楼中楼、评论输入框与底部回复栏使用当前主题颜色。
- 清理不适用于 Safari 的 Manifest 配置，并兼容新旧 Apple 打包工具。

## 常见问题

**退出 Safari 后扩展消失：** 临时扩展到期，或使用了未签名版本。Allow unsigned extensions 会在退出 Safari 后重置；长期使用请配置开发签名。

**Xcode 显示签名错误：** 检查两个目标的 Team、应用与扩展标识前缀、Apple Account 状态。账户验证与协议由本人完成，不要把密码写进脚本。

**签名出现 resource fork / Finder information 错误：** 将构建缓存放到 `/private/tmp`，重新构建；不要在同步目录内给已签名应用重新写资源。

**暗色正文仍不可读：** 刷新已打开的视频标签页，确认安装的是本 fork 最新版本，并检查是否同时启用了其他暗色扩展；请提供实际截图和版本号。

## Apple 官方参考

- [运行与临时加载 Safari Web Extension](https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension)
- [正式分发、Developer ID 签名及公证](https://developer.apple.com/documentation/safariservices/distributing-your-safari-web-extension)
