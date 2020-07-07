document.addEventListener("DOMContentLoaded", ready);
let g_lastSection;
let g_lastIcon;
function ready() {
    let icons = document.getElementsByClassName('icon');
    let sections = document.getElementsByClassName('main-content');

    icons[0].active=true;
    g_lastIcon=icons[0];
    sections[0].hidden=false;
    g_lastSection=sections[0];

    for(let i=0; i<icons.length; i++){
        icons[i].addEventListener('click', () => changeMainContent(icons[i], sections[i]));
        icons[i].onmouseover = icons[i].onmouseout = mouseHover;
        if(!icons[i].active){
            icons[i].active=false;
            icons[i].style.opacity='0.75';
        }
    }
}

function mouseHover(event) {
        switch (event.type) {
            case 'mouseover':
                event.target.style.opacity = '1';
                break;
            case 'mouseout':
                if(!event.target.active)
                    event.target.style.opacity = '0.75';
                break;
        }
}

function changeMainContent(icon, section) {
    icon.active=true;
    icon.style.opacity='1';
    g_lastIcon.active=false;
    g_lastIcon.style.opacity='0.75';
    g_lastIcon=icon;
    g_lastSection.hidden=true;
    section.hidden=false;
    g_lastSection=section;
}