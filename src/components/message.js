const style = {
    position: 'fixed',
    top: '40px',
    left: 0,
    right: 0,
    margin: 'auto',
    width: '320px',
    height: '56px',
    background: 'white',
    boxShadow: '0 5px 10px rgba(0,0,0,.2)',
    borderRadius: '10px',
    textAlign: 'center',
    lineHeight: '56px',
    transition: 'all .4s ease-out',
    opacity: 0,
    zIndex: 9999,
}

export default (text, time = 2600) => {
    if (document.getElementById('message')) {
        return;
    }
    const dom = document.createElement('div');
    dom.id = 'message';
    dom.innerText = `消息提示：${text}`
    for (const prop of Object.entries(style)) {
        dom.style[prop[0]] = prop[1];
    }
    document.body.appendChild(dom);
    setTimeout(() => {
        dom.style.transform = 'translateY(20px)';
        dom.style.opacity = 1;
    }, 200)

    setTimeout(() => dom.style.opacity = 0, time)
    setTimeout(() => dom.remove(), time + 400)
}