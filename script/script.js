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
let g_team = {};    //Кнопка готово будет активна только когда ракета собрана и выбрана команда
let g_chosenShip;   //Заполняется только при сборке ракеты
let g_lastSection;
let g_lastIcon;
let g_weather;
function ready() {
    const icons = document.getElementsByClassName('icon');
    const sections = document.getElementsByClassName('main-content');

    icons[0].classList.add('active');
    g_lastIcon=icons[0];
    sections[0].hidden=false;
    g_lastSection=sections[0];

    for(let i=0; i<icons.length; i++)
        icons[i].addEventListener('click', () => changeMainContent(icons[i], sections[i]));

    document.querySelector('#main-rocket button').addEventListener('click', () => {
        const rocket=document.getElementById('main-rocket');
        const stats=getShipStats(rocket);
        g_chosenShip=new Rocket(stats['teamNumber'], stats['speed'], stats['name'], stats['icon']);
    });

    const rockets=document.querySelectorAll('#ship-content .inner-content .content-block');
    for(rocket of rockets){
        rocket.getElementsByTagName('input')[0].addEventListener('change', (event) => {
            const mainRocket = document.getElementById('main-rocket');
            const rocket=Array.from(document.querySelectorAll('#ship-content .inner-content .content-block')).find((item) => {
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
            const teamRocket = document.getElementById('team-rocket');
            teamRocket.innerHTML=mainRocket.innerHTML;
            teamRocket.getElementsByTagName('button')[0].remove();
        });
    }
    rockets[0].getElementsByTagName('input')[0].click();

    const team=document.querySelector('#team-content .inner-content');
    for(let role of team.getElementsByClassName('content-block')){
        const roleName=role.getElementsByClassName('top-line')[0].textContent;
        for(let person of role.getElementsByClassName('string')){
            let teamMember={
                role: roleName,
                icon: person.getElementsByTagName('img')[0].src,
                name: person.getElementsByClassName('name')[0].textContent
            }
            const checkbox=person.getElementsByTagName('input')[0];
            checkbox.dataset.person=JSON.stringify(teamMember);
            checkbox.addEventListener('change', (event)=>{
                if(event.target.checked)
                    addImage(event.target);
                else
                    deleteImage(event.target);
                let length=0;
                for(let key in g_team){
                    length+=g_team[key].length;
                }
                document.querySelector('#team-content .top-content .content-block:not(#team-rocket) button')
                    .disabled = length !== Number(g_chosenShip.teamNumber);
            });
        }
    }
    const weatherButton = document.querySelector('#weather-content .top-content button');
    weatherButton.addEventListener('click', async ()=>{
        const data = await getWeatherData(document.querySelector('#weather-content .top-content input').value);
        if(!data.ok)
            return alert(`Ошибка\nСтатус: ${data.status}`);
        const weatherBlock = document.querySelector('#weather-content .top-content .content');
        for(let str of weatherBlock.getElementsByClassName('string')){
            switch (str.getElementsByClassName('name')[0].textContent) {
                case 'Температура':
                    const temp=(data['temp']-273.15).toFixed(2);
                    str.getElementsByClassName('value')[0].textContent=temp < 0 ? temp.toString() : `+${temp}`;
                    break
                case 'Влажность':
                    str.getElementsByClassName('value')[0].textContent=`${data['humidity']}%`;
                    break
                case 'Ветер':
                    let dir;
                    if(data['wind']['deg']>337.5 || data['wind']['deg']<22.5)
                        dir='С';
                    else if(22.5<=data['wind']['deg'] && data['wind']['deg']<67.5)
                        dir='СВ';
                    else if(67.5<=data['wind']['deg'] && data['wind']['deg']<112.5)
                        dir='В';
                    else if(112.5<=data['wind']['deg'] && data['wind']['deg']<157.5)
                        dir='ЮВ';
                    else if(157.5<=data['wind']['deg'] && data['wind']['deg']<202.5)
                        dir='Ю';
                    else if(202.5<=data['wind']['deg'] && data['wind']['deg']<247.5)
                        dir='ЮЗ';
                    else if(247.5<=data['wind']['deg'] && data['wind']['deg']<292.5)
                        dir='З';
                    else if(292.5<=data['wind']['deg'] && data['wind']['deg']<337.5)
                        dir='СЗ';
                    str.getElementsByClassName('value')[0].textContent=`${data['wind']['speed']}м\\с, ${dir}`;
            }
        }
    });
    weatherButton.click();
}

function addImage(checkbox) {
    const data=JSON.parse(checkbox.dataset.person);
    const str=Array.from(document.querySelectorAll(
        '#team-content .top-content .content-block:not(#team-rocket) .string')).find((item) => {
            return item.getElementsByClassName('name')[0].textContent===data.role;
    });
    let icon=document.createElement('img');
    icon.src=data.icon;
    str.getElementsByClassName('value')[0].append(icon);
    if(!g_team[data.role])
        g_team[data.role]=[];
    g_team[data.role].push(data);
}

function deleteImage(checkbox) {
    const data=JSON.parse(checkbox.dataset.person);
    const str=Array.from(document.querySelectorAll(
        '#team-content .top-content .content-block:not(#team-rocket) .string')).find((item) => {
        return item.getElementsByClassName('name')[0].textContent===data.role;
    });
    const img=Array.from(str.getElementsByTagName('img')).find((item) => {
        return item.src===data.icon;
    });
    img.remove();
    g_team[data.role].splice(g_team[data.role].findIndex((item) => {
        return JSON.stringify(item)===checkbox.dataset.person;
    }),1);
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

function changeMainContent(icon, section) {
    g_lastIcon.classList.remove('active');
    icon.classList.add('active');
    g_lastIcon=icon;
    g_lastSection.hidden=true;
    section.hidden=false;
    g_lastSection=section;
}

async function getWeatherData(cityName) {
    let response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=67131bb1d6060b17c06dd1ea51d47a3b`);
    if(response.ok) {
        response = await response.json();
        g_weather = {
            ok: true,
            temp: response['main']['temp'],
            wind: {
                speed: response['wind']['speed'],
                deg: response['wind']['deg']
            },
            humidity: response['main']['humidity']
        };
        return g_weather;
    }
    else
        return {
            ok: false,
            status: response.status
        }
}