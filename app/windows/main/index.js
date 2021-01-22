const electron = require('electron');
const { ipcRenderer } = require('electron');

/**
 * 处理 iframe-container onload 事件
 */
function handleIframeContainerOnload () {
    console.log('handle iframe-container onload');
    setTimeout(()=>{
        let iframeContainer = document.getElementById('iframe-container');
        let { href } = iframeContainer.contentWindow.location;
        console.log(href);
        if (href.includes('note.youdao.com/signIn')) {
            // 登录页
            console.log('进入 signin 页');
            getIframeContainerDocument().getElementsByClassName('hd')[0].style.display = "none";
        } else if (href.includes('note.youdao.com/web')) {
            // 首页
            console.log('进入 web 页');
            // 设置顶部区域可见性
            getIframeContainerDocument().getElementsByClassName('top-banner')[0].style.display = "none";
            // 设置主区域上移
            getIframeContainerDocument().getElementsByClassName('main-container')[0].style.top = "0";
            // 移除不需要的元素
            let originalAvatarElement = getIframeContainerDocument().getElementsByClassName('top-right')[0];
            originalAvatarElement.removeChild(originalAvatarElement.children[2]);
            originalAvatarElement.removeChild(originalAvatarElement.children[2]);
            originalAvatarElement.removeChild(originalAvatarElement.children[2]);
            originalAvatarElement.removeChild(originalAvatarElement.children[2]);
            // 设置头像框
            // setStyleFromComputedStyle(originalAvatarElement);
            originalAvatarElement.style.position = "relative";
            originalAvatarElement.style.right = "unset";
            getIframeContainerDocument().getElementsByClassName('own-photo')[0].style.width = '44px';
            getIframeContainerDocument().getElementsByClassName('own-photo')[0].style.height = '44px';
            getIframeContainerDocument().getElementsByClassName('own-photo')[0].style.borderRadius = '22px';
            getIframeContainerDocument().getElementsByClassName('info-more')[0].style.position = 'absolute';
            getIframeContainerDocument().getElementsByClassName('info-more')[0].style.left = '0';
            getIframeContainerDocument().getElementsByClassName('info-more')[0].style.width = '50px';
            
            // 删除部分菜单子项
            let menuElement = getIframeContainerDocument().getElementsByClassName('widget-menu')[0];
            menuElement.removeChild(menuElement.children[2]);
            menuElement.removeChild(menuElement.children[2]);
            menuElement.removeChild(menuElement.children[2]);
            menuElement.removeChild(menuElement.children[2]);
            menuElement.removeChild(menuElement.children[2]);
            menuElement.removeChild(menuElement.children[2]);
            // 还原菜单子项 hover 颜色
            getIframeContainerDocument().getElementsByClassName('widget-menu-item')[0].style.background = ""
            getIframeContainerDocument().getElementsByClassName('widget-menu-item')[2].style.background = ""
            // 放置头像框
            let avatarContainerElement = document.createElement('div');
            avatarContainerElement.style.cssText = 'width:100%; display:flex; flex-direction: row; justify-content: center;top: 8px;position: relative; top:23px';
            avatarContainerElement.appendChild(getIframeContainerDocument().getElementsByClassName('top-right')[0]);
            let createDocumentElement = getIframeContainerDocument().getElementsByClassName('create')[0];
            getIframeContainerDocument().getElementsByClassName('hd')[0].insertBefore(avatarContainerElement, createDocumentElement);
            // 清除头像框底部 border
            setCssForIframeContainer('.sidebar .hd{box-shadow: none; border-bottom:none}');

            // 设置 create top
            setCssForIframeContainer('.sidebar .hd .create{top: 41px; border-radius: 25px; border: 1.5px solid #398dee; margin:0 20px; width:unset;display: flex; flex-direction: row;justify-content: center;}');
            setCssForIframeContainer('.sidebar .hd .create:hover{background:#e4edf8}');
            setCssForIframeContainer('.sidebar .hd .create .arrow-down{display:none}');
            setCssForIframeContainer('.sidebar .hd .create .icon-creates{display:none}');
            setCssForIframeContainer('.sidebar .hd .create .create-text{margin-left:unset; font-size:13px; color:#398dee}');
            getIframeContainerDocument().getElementsByClassName('create-text')[0].innerText = '新建文档';

            // 设置鼠标样式
            setCssForIframeContainer('img, a, i, span, div, li{cursor: default!important}');
            // 侧边栏下移
            setCssForIframeContainer('.sidebar .sidebar-content{top:170px; bottom:26px;border-top: 1px solid #e0e1e5; }');
            // getIframeContainerDocument().getElementsByClassName('sidebar-content')[0].style.top = "160px";
            // getIframeContainerDocument().getElementsByClassName('sidebar-content')[0].style.bottom = "26px";
            // 移除 sidebar-ft
            getIframeContainerDocument().getElementsByClassName('sidebar-ft')[0].style.display = "none";

            // 顶部留空
            // 文件列表
            setCssForIframeContainer('.list-hd{border-bottom: none!important; top: 20px}');
            setCssForIframeContainer('.list-bd{top: 90px!important; border-top: 1px solid #e0e1e5;}');
            // 内容区域
            setCssForIframeContainer('.file-detail .hd{border-bottom: none!important; top: 20px}');
            setCssForIframeContainer('.content-container{margin-top: 30px!important; border-top: 1px solid #e0e1e5;}');
            // 设置 empty 时背景色
            setCssForIframeContainer('drag-component .empty{background-color: #ffffff}');
        }
        setElementVisibilityById('iframe-container', true);
        document.getElementById('loading-container').style.opacity = "0";
        document.getElementById('top-grow-container').style.cssText = "-webkit-app-region: no-drag";
        document.getElementById('top-grow-container').style.cssText = "-webkit-app-region: drag";
        setElementVisibilityById('loading-container', false);
    }, 1500);
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

function handleTopIconClick (type) {
    ipcRenderer.invoke('handleTopIconClick', type);
}