let ej_frame = null;

export default {
    open: (html, w = '50vw', h = '40vh', parent = document.body) => {
        ej_frame = document.createElement('div');
        ej_frame.id = 'ej-frame';
        ej_frame.innerHTML = `<div class='ej-frame-box' style='width: ${w}; height: ${h}'>${html}</div>`;
        
        parent.appendChild(ej_frame);
    },
    remove: () => {
        ej_frame.remove();
    },
    hidden: () => {
        ej_frame.style.display = 'none';
    },
    visity: () => {
        ej_frame.style.display = 'block';
    }
    
}