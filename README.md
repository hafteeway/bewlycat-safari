# BewlyCat Safari

[BewlyCat](https://github.com/keleus/BewlyCat) 的 macOS Safari 适配版，为 Bilibili 官网提供自定义首页、顶栏、播放器设置和亮暗主题。

本仓库维护 Safari 兼容性修改，基于上游 BewlyCat 1.8.0。浏览和播放仍在 Safari 中进行。原项目功能、作者归属及许可保留；Chrome、Edge、Firefox 用户请使用[上游项目](https://github.com/keleus/BewlyCat)。

## 下载与安装

**[前往 Releases 下载](https://github.com/hafteeway/bewlycat-safari/releases)** · **[完整安装与签名指南](SAFARI.md)**

| 安装方式 | 要求 | 使用期限 |
| --- | --- | --- |
| 扩展 ZIP 临时试用 | Safari 27 | 退出 Safari 或 24 小时后移除，需要重新加载 |
| 本机开发签名 | Xcode、自己的 Apple Account、Safari 18+ | 可在本机保留启用，需维护签名证书和配置有效期 |

### 先试用

1. 在 Releases 下载 `BewlyCat-Safari-WebExtension.zip`。
2. Safari → Settings（设置）→ Advanced（高级），开启 Show features for web developers（显示网页开发者功能）。
3. 在 Developer（开发者）中选择 Add Temporary Extension…（添加临时扩展），加载 ZIP。
4. 在 Extensions（扩展）中启用 BewlyCat，允许访问所需的 B 站相关站点，再刷新页面。

**这个 ZIP 是临时试用包，不能直接永久安装。** 想在自己的 Mac 长期使用，请按 [SAFARI.md](SAFARI.md) 构建并开发签名。无需使用 Allow unsigned extensions（允许未签名扩展）作为长期安装方案。

当前提供 macOS Safari 扩展；没有 iPhone/iPad 版、App Store 版或通用的已公证应用安装包。

## Safari 适配内容

- 保留 BewlyCat 的自定义推荐首页、顶栏、视频卡片、播放器设置和快捷键等功能。
- 修复视频评论区的暗色模式：评论正文、楼中楼、输入框及底部回复栏随主题切换更新颜色。
- 适配 Safari 登录状态更新，替代 Safari 不支持的 `cookies.onChanged` 事件。
- 禁用 Safari 不支持的跨设备云同步，保留本地设置及导入／导出。
- 提供网页扩展构建和 Xcode 工程生成命令，便于使用自己的 Apple Account 签名安装。

Safari 修复版已在本机验证：签名安装后重启 Safari，扩展仍可使用；视频评论和两处回复框的暗色→亮色→暗色切换正常。全部上游功能及历史系统版本尚未逐项验证。

## 从源码构建

要求：macOS 13+、Safari 18+、完整 Xcode、Node.js 和 pnpm。当前实际编译环境为 Xcode 27。

```bash
git clone https://github.com/hafteeway/bewlycat-safari.git
cd bewlycat-safari
pnpm install --frozen-lockfile
pnpm build-safari
pnpm convert-safari
```

网页扩展输出到 `extension-safari/`。转换命令生成：

```text
safari-native-macos/BewlyCat Safari/BewlyCat Safari.xcodeproj
```

在 Xcode 中打开工程，为应用与扩展两个 Targets（目标）选择自己的 Team（团队），构建后将应用放到 Applications（应用程序），再到 Safari 中启用扩展。详细的签名、授权和更新步骤见 [Safari 安装指南](SAFARI.md#方式二在自己的-mac-上开发签名)。

Safari 的 `.app` 仅为浏览器扩展安装外壳，不提供独立 B 站客户端。公开源码不包含个人签名证书、私钥或团队配置。

## 更新与问题反馈

更新前保留当前可用版本；重新构建时保留同一组 Bundle Identifier（包标识）和 Team（团队）。更新扩展后刷新 B 站标签页，并检查退出重开 Safari 后是否仍启用。

Safari 适配问题请在[本仓库 Issues](https://github.com/hafteeway/bewlycat-safari/issues) 中反馈，附 Safari/macOS 版本、安装方式、扩展版本和复现步骤。截图中请遮住个人信息。上游功能说明可查阅 [BewlyCat README](https://github.com/keleus/BewlyCat#readme)；局部音量均衡说明见[算法与资源管理](docs/local-loudness.md)。

## 来源与许可

本项目继承自 [keleus/BewlyCat](https://github.com/keleus/BewlyCat)，BewlyCat 基于 [BewlyBewly/BewlyBewly](https://github.com/BewlyBewly/BewlyBewly) 开发。原作者及[上游贡献者](https://github.com/keleus/BewlyCat/graphs/contributors)的代码与贡献记录保留。

沿用原项目的 [LICENSE](LICENSE)，包含在 MIT 基础上增加的用途限制。请阅读完整许可；本项目仅用于浏览器扩展，不用于独立客户端产品。

上游引用及参考项目：

- [vitesse-webext](https://github.com/antfu/vitesse-webext)
- [UserScripts/bilibiliHome](https://github.com/indefined/UserScripts/tree/master/bilibiliHome)
- [bilibili-app-recommend](https://github.com/magicdawn/bilibili-app-recommend)
- [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved)
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)
