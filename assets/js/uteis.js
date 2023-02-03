let BusarUsuario = () =>{
    if(localStorage.getItem('login')){
        return localStorage.getItem('login')
    }else if(sessionStorage.getItem('login')){
        return sessionStorage.getItem('login')
    }
}

let Dadoslogin = BusarUsuario()

let pathname = location.pathname.split('/')[2]
pathname === 'index.html' || pathname === "" ? pathname = 'home' : ''

let ConsoltarBaseUsuario = ()=>{
    let test = {user:false, senha: false}
    usuarios.usuarios.forEach(usuario =>{
        
        if(usuario.user.nome === user.usuario || usuario.user.email === user.usuario){
            test.user = true
        }
        if(usuario.senha === user.senha){
            test.senha = true
        }
    })
    return test
}

let VerificarErro = (valor, local, erro) => !valor ? local.innerText = erro : ''

let ConsoltarBaseUsuarioResources = (Dadoslogin)=>{
    for (const usuario of usuarios.usuarios) {
        if((usuario.user.nome === Dadoslogin.usuario || usuario.user.email === Dadoslogin.usuario)&&(usuario.senha === Dadoslogin.senha)){
            return [usuario.resources,usuario.user.nome]
        }
    }
}

let ShowHidePassword = (box)=>{
    if (box.querySelector('input').type === "password") {
        box.querySelector('input').type = "text"
        box.querySelector('span').innerText = 'visibility_off'
    } else {
        box.querySelector('input').type = "password";
        box.querySelector('span').innerText = 'visibility'
    }
}

let GetHTML = (url, method, callback, params = null)=>{
    let obj;
    try { 
        obj = new XMLHttpRequest();  
    }catch(e){   
        try {     
            obj = new ActiveXObject("Msxml2.XMLHTTP");     
        } catch(e) {     
            try { 
            obj = new ActiveXObject("Microsoft.XMLHTTP");       
            } catch(e) {       
            console.log("Your browser does not support Ajax.");       
            return false;       
            }     
        }   
    }
    obj.open(method, url, true);
    obj.setRequestHeader("Content-Type", "text/html");
    obj.onreadystatechange = function() {
        if(obj.readyState == 4) {
            callback(obj);
        } 
    }
    obj.send(JSON.stringify(params));
    return obj; 
}

let Capitalize = str => {
	if (typeof str !== 'string') {
		return '';
	}
    str = str.split(" ")
    let newStr = ''
    for (let [i,nome] of str.entries()) {
        nome = nome.charAt(0).toUpperCase() + nome.substr(1)
        newStr += i === 0 ? nome : " "+nome
    }
	return newStr
}

let StringtoSearch = str => {
    str = str.replace(/[ÀÁÂÃÄÅ]/,"A");
    str = str.replace(/[àáâãäå]/,"a");
    str = str.replace(/[ÈÉÊË]/,"E");
    str = str.replace(/[èéêë]/,"e");
    str = str.replace(/[ÍÌÎÏ]/,"I");
    str = str.replace(/[íìïî]/,"i");
    str = str.replace(/[ÓÒÔÕÖ]/,"O");
    str = str.replace(/[óòõöô]/,"o");
    str = str.replace(/[ÚÙÛÜ]/,"U");
    str = str.replace(/[úùûü]/,"u");
    str = str.replace(/[Ç]/,"C");
    str = str.replace(/[ç]/,"c");

    return str; 
}

let leftPad = (value, totalWidth)=>{
    var length = totalWidth - value.toString().length + 1;
    return Array(length).join('0') + value;
};

let dateTimeToUTC = (date,params) =>{
    var offset = (new Date().getTimezoneOffset() / 60);
    var data = new Date(date.replace('T',' ') + "  " + (offset > 0 ? "-" + offset : (offset * -1)));
    return !!params ? data.toLocaleString('pt-BR', { timeZone: 'UTC' }).replace(/(\d*)\/(\d*)\/(\d*)\s(\d*):(\d*):(\d*).*/, '$1/$2/$3 às $4:$5') : data.toLocaleString('pt-BR', { timeZone: 'UTC' }).replace(/(\d*)\/(\d*)\/(\d*)\s(\d*):(\d*):(\d*).*/, '$1/$2/$3 às $4:$5:$6');
}

let dateToUTC = (date,params) =>{
    var offset = (new Date().getTimezoneOffset() / 60);
    var data = new Date(date.replace('T',' ') + "  " + (offset > 0 ? "-" + offset : (offset * -1)));
    return !!params ? data.toLocaleString('pt-BR', { timeZone: 'UTC' }).replace(/(\d*)\/(\d*)\/(\d*)\s(\d*):(\d*):(\d*).*/, '$1/$2/$3') : data.toLocaleString('pt-BR', { timeZone: 'UTC' }).replace(/(\d*)\/(\d*)\/(\d*).*/, '$1/$2/$3');
}

const handlePhone = (event) => {
    let input = event.target
    input.value = phoneMask(input.value)
}
  
const phoneMask = (value) => {
    if (!value) return ""
    value = value.replace(/\D/g,'')
    value = value.replace(/(\d{2})(\d)/,"($1) $2")
    value = value.replace(/(\d)(\d{4})$/,"$1-$2")
    return value
}

const handle_cpf_cnpj = (event) => {
    let input = event.target
    input.value = cpf_cnpj_mask(input.value)
}
  
const cpf_cnpj_mask = (value) => {
    if (!value) return ""
    value = value.replace(/\D/g,'');
    if (value.length <= 11) { 
        value=value.replace(/(\d{3})(\d)/,"$1.$2")
        value=value.replace(/(\d{3})(\d)/,"$1.$2")
        value=value.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
 
    } else {
        value=value.replace(/^(\d{2})(\d)/,"$1.$2")
        value=value.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3")
        value=value.replace(/\.(\d{3})(\d)/,".$1/$2")
        value=value.replace(/(\d{4})(\d)/,"$1-$2")
    }
    return value
}

let Aparecer_obj = obj => obj.classList.remove("hidden");

let Esconder_obj = obj => obj.classList.add("hidden");

let limpar_inputs = box => {
    for (const iterator of box.querySelectorAll('input')) {
        iterator.value = ''
        iterator.checked = false
        iterator.classList.remove('error');
    }
    for (const iterator of box.querySelectorAll('textarea')) {
        iterator.value = ''
        iterator.classList.remove('error');
    }
    for (const iterator of box.querySelectorAll('select')) {
        iterator.value = 0
    }
}

let validar_dados_inputs = (element, erro) => {
    if(element.value.length <= 0){
        element.classList.add('error')
        return true
    }
    element.classList.remove('error')
    return erro
}

let vh = window.innerHeight * 0.01;

document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});
