const style = {
    position: 'fixed',
    top: '40px',
    left: 0,
    right: 0,
    margin: 'auto',
    width: '300px',
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
    if (document.getElementById('ej-message')) {
        return;
    }
    const ej_msg = document.createElement('div');
    ej_msg.id = 'ej-message';
    ej_msg.innerText = `消息提示：<span>${text}</span>`
    for (const prop of Object.entries(style)) {
        ej_msg.style[prop[0]] = prop[1];
    }
    document.body.appendChild(ej_msg);
    setTimeout(() => {
        ej_msg.style.transform = 'translateY(20px)';
        ej_msg.style.opacity = 1;
    }, 200)

    setTimeout(() => ej_msg.style.opacity = 0, time)
    setTimeout(() => ej_msg.remove(), time + 400)
}