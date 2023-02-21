document.querySelector('nav').innerHTML = `
<div class="container">
    <div class="left">
        <button id="menu-btn">
            <span class="material-symbols-sharp">menu</span>
        </button>
        <a class="logo" href="/lion-rock/">
            <picture>
                ${pathname == "home" 
                ? '<source media="(max-width:900px)" srcset="./assets/img/logo.png"><img src="./assets/img/LR-CP-SF.png"">' 
                : '<source media="(max-width:900px)" srcset="./../assets/img/logo.png"><img src="./../assets/img/LR-CP-SF.png">'}
            </picture>
        </a>
        
    </div>
    <div class="theme-btn">
        <span class="material-symbols-sharp active">light_mode</span>
        <span class="material-symbols-sharp">dark_mode</span>
    </div>
</div>`

document.querySelector('head').innerHTML += `${pathname == "home" 
                                                ? '<link rel="icon" type="image/x-icon" href="./assets/img/L_R-BRASAO.ico">' 
                                                : '<link rel="icon" type="image/x-icon" href="./../assets/img/L_R-BRASAO.ico">'}
`

const themeToggler = document.querySelector(".theme-btn");

let TogglerTheme = () => {
    document.body.classList.toggle('dark-theme-variables');
    if(document.body.classList.value !== ''){
        localStorage.setItem('theme','dark')
    }else{
        localStorage.setItem('theme','white')
    }

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
}

themeToggler.addEventListener('click', TogglerTheme);

if(localStorage.getItem("theme") === 'dark'){
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.remove('active');
    themeToggler.querySelector('span:nth-child(2)').classList.add('active');
}

