# aptos 前端开发脚手架

一个 基于 next.js Tailwind 的 move 应用脚手架。

本项目参考自：

> https://github.com/Amovane/aptos-NFT-marketplace

## 启动运行

1. git clone <https://github.com/NonceGeek/scaffold-move.git>
2. cd scaffold-move/scaffold-aptos
3. yarn # 安装必须的前端包，注意自己本地的网络环境
4. 环境配置，部分全局变量在 .env.local 中,该变量会默认 注入到 yarn 启动的进程当中。初学者注意，aptos官网提供的testnet faucet 的 url 不能直接使用。
4. yarn dev
5. yarn build #编译完成的 next.js 应用

本项目合约基于 MoveDID 。 项目地址 <https://github.com/NonceGeek/MoveDID>。

本项目由 [NonceGeek DAO](https://noncegeek.com/#/) 维护。
