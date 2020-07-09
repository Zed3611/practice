class Rocket{
    constructor(teamNumber, speed, name, icon) {
        this.teamNumber=teamNumber;
        this.speed=speed;
        this.name=name;
        this.icon=icon;
    }
    teamNumber;
    speed;
    name;
    icon;
    launch(){

    }
}
document.addEventListener("DOMContentLoaded", ready);
let g_chosenShip;
let g_lastSection;
let g_lastIcon;
function ready() {
    let icons = document.getElementsByClassName('icon');
    let sections = document.getElementsByClassName('main-content');

    document.querySelector('#main-rocket button').addEventListener('click', () => {
        let rocket=document.getElementById('main-rocket');
        let stats=getShipStats(rocket);
        g_chosenShip=new Rocket(stats['teamNumber'], stats['speed'], stats['name'], stats['icon']);
    });

    let rockets=document.querySelectorAll('#ship-content .inner-content .content-block');
    for(rocket of rockets){
        rocket.getElementsByTagName('input')[0].addEventListener('change', (event) => {
            let mainRocket = document.getElementById('main-rocket');
            let rocket=Array.from(document.querySelectorAll('#ship-content .inner-content .content-block')).find((item) => {
                return item.getElementsByTagName('input')[0].checked;
            });
            let stats=getShipStats(rocket);
            mainRocket.getElementsByTagName('img')[0].src=stats['icon'];
            for(stat of mainRocket.querySelectorAll('.string')) {
                let name = stat.getElementsByClassName('name')[0].textContent;
                stat.getElementsByClassName('value')[0].textContent=stats[name==='Имя' ? 'name':
                                                                                    name==='Скорость' ? 'speed' :
                                                                                    name==='Экипаж' ? 'teamNumber' : ''];
            }
        });
    }
    rockets[0].getElementsByTagName('input')[0].click();

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

function getShipStats(rocket) {
    let stats={};
    stats['icon'] = rocket.getElementsByTagName('img')[0].src;
    for(stat of rocket.querySelectorAll('.string')) {
        let str = stat.getElementsByClassName('name')[0].textContent;
        stats[str === 'Имя' ? 'name' :
            str === 'Скорость' ? 'speed' :
                str === 'Экипаж' ? 'teamNumber' : ''] = stat.getElementsByClassName('value')[0].textContent;
    }
    return stats;
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
    g_lastIcon.active=false;
    g_lastIcon.style.opacity='0.75';
    icon.active=true;
    icon.style.opacity='1';
    g_lastIcon=icon;
    g_lastSection.hidden=true;
    section.hidden=false;
    g_lastSection=section;
}