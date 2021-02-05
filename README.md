# youdao-note-electron

## 软件简介

有道云笔记 electron 版，支持 Windows、Linux、Mac 平台。在网页版基础上，进行界面的优化，并支持切换日/夜间模式。

不知从什么时候开始，我使用 Windows 有道云笔记同步笔记内容的时候，经常出现下面这种情况：
    
![](http://check-note-image.scauhelper.club/a39bb1369093c39856656f0b28458383)

同步失败，换了别的电脑/重装软件也是不行，偶然间发现网页版的有道云笔记可以正常同步，于是就打算使用 electron 包装下网页版，并且在网页版的基础上，实现一些一直想要的功能。

目前以支持：
- 简化界面
- 切换日/夜间模式

将来打算支持：
- 集成 [markdown-image-tool](https://github.com/CheckCoder/markdown-image-tool)，通过快捷键粘贴图片时，自动上传到图床，并生成 Markdown
- 通过快捷键粘贴链接时，自动获取标题，并生成 Markdown
- 编辑区 ctrl + 鼠标滚轮进行缩放

## 界面

- 日间模式

    ![](http://check-note-image.scauhelper.club/f3d42a8556bf5b74460db81d35391c57)

- 夜间模式
    
    ![](http://check-note-image.scauhelper.club/f61f13a44174dd9a77903945a2de7ab9)

- 右上方按钮说明

    ![](http://check-note-image.scauhelper.club/fb8ba555a13250140f54bedb3a202af6)

## 使用

本软件仅供学习使用！

1. 安装 [Node.js](https://nodejs.org/zh-cn/)
2. 拉取代码

    `git pull https://github.com/CheckCoder/youdao-note-electron.git` 或 [直接下载 zip](https://github.com/CheckCoder/youdao-note-electron/archive/master.zip)

3. 切换目录

    `cd youdao-note-electron`

4. 安装依赖

    `npm install`

5. 调试

    `npm run dev` 或 `npm run start`

6. 打包

    `npm run dist`
    
    执行打包后文件存放在 dist 文件夹中

有问题欢迎 [提issue](https://github.com/CheckCoder/youdao-note-electron/issues/new)

## 特别感谢

- 项目中使用到 [Joan Leon](https://codepen.io/nucliweb) 开源的 [加载动画](https://codepen.io/nucliweb/pen/VYQzvR)
- 项目中夜间模式使用到了 [DarkReader](https://github.com/darkreader/darkreader)

## LICENSE

[MIT License](https://github.com/CheckCoder/youdao-note-electron/blob/master/LICENSE)

Copyright (c) 2021 CheckCoder