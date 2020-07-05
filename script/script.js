document.addEventListener("DOMContentLoaded", ready);
function ready() {
    let icons = {'general': document.getElementById('general'),
        'ship': document.getElementById('ship'),
        'team': document.getElementById('team'),
        'weather': document.getElementById('weather')};

    icons.general.active=true;

    let generalHtml=document.getElementById('main-content').innerHTML;
    let generalBack='url("img/023-astronomy.png")';
    let shipHtml=document.createElement('h2');
    shipHtml.textContent='Выбор корабля';
    shipHtml=shipHtml.outerHTML;
    let teamHtml=document.createElement('h2');
    teamHtml.textContent='Сбор команды';
    teamHtml=teamHtml.outerHTML;
    let weatherHtml=document.createElement('h2');
    weatherHtml.textContent='Проверка погоды';
    weatherHtml=weatherHtml.outerHTML;

    icons.general.addEventListener('click', () => {
        changeMainContent('general', icons, generalHtml, generalBack);
    });
    icons.ship.addEventListener('click', () => {
        changeMainContent('ship', icons, shipHtml);
    });
    icons.team.addEventListener('click', () => {
        changeMainContent('team', icons, teamHtml);
    });
    icons.weather.addEventListener('click', () => {
        changeMainContent('weather', icons, weatherHtml);
    });
    icons.general.onmouseover = icons.general.onmouseout =
        icons.ship.onmouseover = icons.ship.onmouseout =
            icons.team.onmouseover = icons.team.onmouseout =
                icons.weather.onmouseover = icons.weather.onmouseout = mouseHover;

    changeMainContent('general', icons);
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

function changeMainContent(buttonName, icons, content, background) {
    for(key in icons){
        if(key!==buttonName) {
            icons[key].style.opacity = '0.75';
            icons[key].active=false;
        }
        else {
            icons[key].style.opacity = '1';
            icons[key].active = true;
        }
    }
    if(content) {
        let main = document.getElementById('main-content');
        main.innerHTML = content;
        if (background)
            main.style.backgroundImage = background;
        else
            main.style.backgroundImage = 'none';
    }
}