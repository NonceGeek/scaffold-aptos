# sui 前端开发脚手架

一个 基于 next.js Tailwind 的 sui move 应用脚手架。

## 启动运行

1. git clone <https://github.com/v1xingyue/scaffold-move.git>
2. cd scaffold-move
3. yarn # 安装必须的前端包，注意自己本地的网络环境
4. 环境配置，部分全局变量在 .env.local 中,该变量会默认 注入到 yarn 启动的进程当中。
    其中两个参数需要注意:
    NEXT_PUBLIC_DAPP_PACKAGE 为合约发布的包地址
    NEXT_PUBLIC_DAPP_MODULE 为需要调用的模块名
    这个两个参数在dapp 内部调用合约的时候需要添加到调用参数里边。
4. yarn dev
5. yarn build #编译完成的 next.js 应用
6. 合约代码在 move_package 中

本项目由 [NonceGeek DAO](https://noncegeek.com/#/) 维护。
