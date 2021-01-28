const { ipcRenderer } = require('electron');

const DarkReader = {
    enableJsFileUrl: `https://cdn.jsdelivr.net/gh/CheckCoder/youdao-note-electron@master/app/libs/DarkReader/enable.js`,
    disableJsFileUrl: `https://cdn.jsdelivr.net/gh/CheckCoder/youdao-note-electron@master/app/libs/DarkReader/disable.js`
}

let config = {
    nightMode: {
        enable: true
    }
};

ipcRenderer.on('changeWindowSize', (event, size) => {
    document.getElementsByClassName('resize-window-icon')[0].setAttribute('src', `./../../res/icon/window-${size}.svg`);
    document.getElementsByClassName('resize-window-icon')[1].setAttribute('src', `./../../res/icon/window-${size}.svg`);
});

/**
 * 处理 iframe-container onload 事件
 */
async function handleIframeContainerOnload () {
    setLoading(true);

    let iframeContainer = document.getElementById('iframe-container');
    let { href } = iframeContainer.contentWindow.location;
    if (href.includes('note.youdao.com/signIn')) {
        // 登录页
        console.log('进入 signin 页');
        emitEvent('intoLoginPage');

        setCssForIframeContainer('.hd { display: none; } ');
        setCssForIframeContainer('.bd .login-main { margin: unset!important; padding: 30px 0 20px 0;} ');
        setCssForIframeContainer('::-webkit-scrollbar { display: none }');
        setCssForIframeContainer('body { overflow:hidden } ');
    } else if (href.includes('note.youdao.com/web')) {
        // 首页
        console.log('进入 web 页');
        emitEvent('intoMainPage');

        // 设置顶部区域可见性
        setCssForIframeContainer('.top-banner { display: none; }');
        // 设置主区域上移
        setCssForIframeContainer('.main-container { top: 0; }');
        // 移除不需要的元素
        setCssForIframeContainer('.top-right > a { display: none!important; }');
        setCssForIframeContainer('.top-right > i { display: none!important; }');
        setCssForIframeContainer('.top-right > span {display: none!important; }');
        setCssForIframeContainer('.arrow-line-down { visibility: hidden; }');
        // 设置头像框
        setCssForIframeContainer('.top-right { position: relative!important; right: unset!important; }');
        setCssForIframeContainer('.top-banner .top-right .own-info .own-photo { width: 46px; height: 46px; border-radius: 23px; }');
        setCssForIframeContainer('.top-banner .top-right .info-more { position: absolute; left: 0; width: 50px; }');
        // 清除头像框底部 border
        setCssForIframeContainer('.sidebar .hd { box-shadow: none; border-bottom: none; }');

        // 设置 create top
        setCssForIframeContainer('.sidebar .hd .create { top: 41px; border-radius: 25px; border: 1.5px solid #398dee; margin:0 20px; width:unset; display: flex; flex-direction: row; justify-content: center; align-items: center;}');
        setCssForIframeContainer('.sidebar .hd .create:hover { background: #e4edf8; }');
        setCssForIframeContainer('.sidebar .hd .create .arrow-down { display:none; }');
        setCssForIframeContainer('.sidebar .hd .create .icon-creates { background-position: 74.35897435897436% 15.445845272206304%; transform: scale(0.8); }');
        setCssForIframeContainer('.sidebar .hd .create .create-text { margin-left:unset; font-size:13px; color:#398dee; }');

        // 设置鼠标样式
        setCssForIframeContainer('img, a, i, span, div, li { cursor: default!important; }');
        // 侧边栏下移
        setCssForIframeContainer('.sidebar .sidebar-content { top:170px; bottom:26px!important; border-top: 1px solid #e0e1e5; }');
        // 移除 sidebar-ft
        setCssForIframeContainer('.sidebar .sidebar-ft { display: none; }');

        // 顶部留空
        // 文件列表
        setCssForIframeContainer('.list-hd { border-bottom: none!important; top: 20px; }');
        setCssForIframeContainer('.list-bd { top: 90px!important; border-top: 1px solid #e0e1e5; }');
        // 内容区域
        setCssForIframeContainer('.file-detail .hd{ border-bottom: none!important; top: 20px; }');
        setCssForIframeContainer('.content-container{ margin-top: 30px!important; border-top: 1px solid #e0e1e5; }');
        // 设置 empty 时背景色
        setCssForIframeContainer('drag-component .empty{ background-color: #ffffff; }');

        // 放置头像框
        let topRightElement = null;
        let createElement = null;
        let hdElement = null;
        do {
            topRightElement = getIframeContainerDocument().getElementsByClassName('top-right')[0]
            createElement = getIframeContainerDocument().getElementsByClassName('create')[0];
            hdElement = getIframeContainerDocument().getElementsByClassName('hd')[0];
            await later(500);
        } while( !topRightElement || !createElement || !hdElement);

        // 放置头像框
        let avatarContainerElement = document.createElement('div');
        avatarContainerElement.classList.add('top-banner');
        avatarContainerElement.style.cssText = 'width:100%; display:flex; flex-direction: row; justify-content: center; position: relative; top:15px; height: unset; background: unset; min-width: unset;';
        avatarContainerElement.appendChild(topRightElement);
        hdElement.insertBefore(avatarContainerElement, createElement);

        // 夜间模式
        setNightMode(config.nightMode.enable);
    }
    setLoading(false);
}

/**
 * 设置 iframe container 夜间模式
 * @param {boolean} enable 是否启动夜间模式
 */
let iframeLocationHash = '';
let iframeContainerClickListenerForNightMode = async (event) => {
    await later(100);
    let nowLocationHash = getIframeContainerWindow().location.hash;
    if (nowLocationHash !== iframeLocationHash) {
        iframeLocationHash = nowLocationHash;
        setNightModeScriptToDocument(getIframeContainerChildIframeDocument());
        await later(500);
        setNightModeScriptToDocument(getIframeContainerChildIframeDocument());
        await later(1500);
        setNightModeScriptToDocument(getIframeContainerChildIframeDocument());
    }
};
async function setNightMode ( enable = true) {
    if (enable) {
        config.nightMode.enable = true;
        document.getElementById('top-right-container').style.display = 'none';
        document.getElementById('top-right-container-night').style.display = '';
        iframeLocationHash = getIframeContainerWindow().location.hash;
        getIframeContainerDocument().addEventListener('click', iframeContainerClickListenerForNightMode, true);
        setNightModeScriptToDocument(getIframeContainerDocument());
        setNightModeScriptToDocument(getIframeContainerChildIframeDocument());
        await later(500);
        setNightModeScriptToDocument(getIframeContainerChildIframeDocument());
        await later(1500);
        setNightModeScriptToDocument(getIframeContainerChildIframeDocument());
        await later(1500);
        setNightModeScriptToDocument(getIframeContainerChildIframeDocument());
    } else {
        config.nightMode.enable = false;
        document.getElementById('top-right-container').style.display = '';
        document.getElementById('top-right-container-night').style.display = 'none';
        setNightModeScriptToDocument(getIframeContainerDocument(), false);
        setNightModeScriptToDocument(getIframeContainerChildIframeDocument(), false);
    }
}

/**
 * 给文档设置夜间模式脚本
 * @param {document} document 文档
 * @param {boolean} enable 是否启用夜间模式
 */
function setNightModeScriptToDocument (document, enable = true) {
    if (!document || !document.body) return;
    if (config.nightMode.enable === enable) {
        let scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', enable ? DarkReader.enableJsFileUrl : DarkReader.disableJsFileUrl);
        document.body.appendChild(scriptElement);
    }
}

/**
 * 设置 loading 状态
 * @param {boolean} state 
 */
function setLoading (state) {
    if (state) {
        document.getElementById('loading-container').style.opacity = "1";
    } else {
        document.getElementById('loading-container').style.opacity = "0";
    }
    setElementVisibilityById('loading-container', state);
}

/**
 * 等待
 * @param {int} delayTime 等待时间
 */
function later (delayTime) {
    return new Promise((resolve) => {
        setTimeout(resolve, delayTime);
    });
}

/**
 * 通过元素id设置可见性
 * @param {string} id 元素id
 * @param {boolean} visible 可见性
 */
function setElementVisibilityById (id, visible) {
    let element = document.getElementById(id);
    if (visible) {
        element.style.visibility = 'visible';
    } else {
        element.style.visibility = 'hidden';
    }
}

/**
 * 获取 iframe-container document
 */
function getIframeContainerDocument () {
    return document.getElementById('iframe-container').contentWindow.document;
}

/**
 * 获取 iframe-container 子 iframe document
 */
function getIframeContainerChildIframeDocument () {
    let element = getIframeContainerDocument().querySelector('.detail-container iframe');
    if (!element) return null;
    return element.contentWindow.document;
}
/**
 * 获取 iframe-container window
 */
function getIframeContainerWindow () {
    return document.getElementById('iframe-container').contentWindow;
}

/**
 * 对 iframe-container 设置css
 * @param {string} rule css
 */
function setCssForIframeContainer (rule) {
    getIframeContainerDocument().styleSheets[getIframeContainerDocument().styleSheets.length - 1].insertRule(rule, 0);
}

function setStyleFromComputedStyle (element) {
    element.style.cssText = window.getComputedStyle(element, null).cssText;
    let childrenLength = element.children.length;
    for (let i = 0; i < childrenLength; i++) {
        setStyleFromComputedStyle(element.children[i]);
    }
}

function emitEvent (...args) {
    ipcRenderer.invoke('mainPageEvent', ...args);
}