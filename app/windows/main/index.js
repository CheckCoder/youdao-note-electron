/**
 * 处理 iframe-container onload 事件
 */
function handleIframeContainerOnload () {
    console.log('handle iframe-container onload');
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
        getIframeContainerDocument().getElementsByClassName('top-banner')[0].style.visibility = "hidden";
        // 设置头像区域可见性
        getIframeContainerDocument().getElementsByClassName('top-right')[0].style.visibility = "visible";
        getIframeContainerDocument().getElementsByClassName('info-more')[0].style.visibility = "visible";
        // 移除不需要的元素
        getIframeContainerDocument().getElementsByClassName('to-website')[0].style.display = "none";
        getIframeContainerDocument().getElementsByClassName('top-line')[0].style.display = "none";
        getIframeContainerDocument().getElementsByClassName('update-vip')[0].style.display = "none";
        getIframeContainerDocument().getElementsByClassName('top-line')[1].style.display = "none";
        getIframeContainerDocument().getElementsByClassName('top-btns')[0].style.display = "none";
        // 设置主区域
        getIframeContainerDocument().getElementsByClassName('main-container')[0].style.top = "0";
        // 设置头像框
        let avatarContainerElement = document.createElement('div');
        avatarContainerElement.style.cssText = 'margin:0 auto; width:100%';
        avatarContainerElement.appendChild(getIframeContainerDocument().getElementsByClassName('top-right')[0]);
        let createDocumentElement = getIframeContainerDocument().getElementsByClassName('create')[0];
        getIframeContainerDocument().getElementsByClassName('hd')[0].insertBefore(avatarContainerElement, createDocumentElement);
        getIframeContainerDocument().getElementsByClassName('own-photo')[0].style.cssText = 'width:38px; height:38px; border-radius:19px';
        getIframeContainerDocument().getElementsByClassName('info-more')[0].style.cssText = 'z-index:1; font-size:14px; line-height:50px';
        // getIframeContainerDocument().getElementsByClassName('hd')[0].style.paddingTop = "50px";
        // getIframeContainerDocument().getElementsByClassName('sidebar-content')[0].style.top = "111px";


    }
    setElementVisibilityById('iframe-container', true);
    document.getElementById('loading-container').style.opacity = "0";
    setElementVisibilityById('loading-container', false);
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