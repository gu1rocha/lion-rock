let showMenuLateral = ()=> {
    GetHTML('/lion&rock/menu/index.html', 'get',  function(obj) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(obj.responseText, "text/html");

        if(!!document.querySelector('aside'))
        document.querySelector('aside').remove()

        let aside = doc.querySelector('aside')

        document.querySelector('body').insertBefore(aside, document.querySelector('body').firstChild)

        const menuBtn = document.querySelector("#menu-btn");
        const closeBtn = document.querySelector("#close-btn");

        menuBtn.addEventListener('click', () =>{
            aside.style.display = 'block';
        });
        
        closeBtn.addEventListener('click', () => {
            aside.removeAttribute('style')
        });

        Show_drop = element => {
            element.querySelector('span').classList.toggle('collapsed')
            element.nextElementSibling.classList.toggle('hidden')
        }

         /* if(!!JSON.parse(Dadoslogin)){ */
            //let resources = ConsoltarBaseUsuarioResources(JSON.parse(Dadoslogin))
            //aside.querySelector('h2').innerText = Capitalize(resources[1])
            for (const link of aside.querySelectorAll('a')) {
                /* if(!(link.className.includes('home') || link.className.includes('logout'))){
                    link.remove()
                } */
                if(pathname.includes(link.className)){
                    link.classList.add('active')
                }
            }
            aside.querySelector('#logout').addEventListener('click',()=>{
                
                showMessageBox().showMessage({
                    type: 'warning',
                    title: 'Logout',
                    text: `Realmente deseja <strong>sair</strong> do sistema?`,
                    accept:{
                        function : function(){sessionStorage.removeItem('login')
                        window.location.href = '/lion&rock/'},
                        text: 'Sair'
                    }
                })
            })
       /*  }else{
            for (const link of aside.querySelectorAll('a')) {
                if(!(link.className.includes('home') || link.className.includes('login'))){
                    link.remove()
                }

                if(pathname.includes(link.className)){
                    link.classList.add('active')
                }
            }
            
            showLogin.addEventListener('click',()=>{
                var ajax = GetHTML('./login/index.html', 'get',  function(obj) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(obj.responseText, "text/html");
                    document.querySelector('body').classList.add('noScrool')
                    document.querySelector('body').appendChild(doc.querySelector('.boxLogin'))
                    document.querySelector('body').querySelector('.boxLogin').querySelector('.close').addEventListener('click',()=>{
                        document.querySelector('body').querySelector('.boxLogin').remove()
                        document.querySelector('body').classList.remove('noScrool')
                    })
                    ShowLogin()
                })
            })
        }  */
    })
}

showMenuLateral()

window.addEventListener('mouseup', (e)=>{
    if (!(e.target == document.querySelector('aside') || document.querySelector('aside').contains(e.target)) 
        && !document.querySelector('aside').classList.value.includes('hidden') 
        && e.target != document.querySelector("#menu-btn span")){
            document.querySelector('aside').removeAttribute('style');
    }
});