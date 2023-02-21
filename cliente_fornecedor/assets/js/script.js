let Fornecedor_Cliente = [], id_Fornecedor_Cliente = undefined

let Verificar_select_situacao = (params)=>{
    if(!!params.select.value){
        return params.valor === JSON.parse(params.select.value)
    }
    return true
}

let Verificar_select = (params)=>{
    if(!!params.select.value){
        return params.valor == params.select.value
    }
    return true
}

let Listar_fornecedor_cliente = ()=>{
  if((!!JSON.parse(localStorage.getItem("Fornecedor_Cliente")) && JSON.parse(localStorage.getItem("Fornecedor_Cliente")).length)){
    Fornecedor_Cliente = JSON.parse(localStorage.getItem("Fornecedor_Cliente"))
    document.querySelector(".table .body_table").innerHTML = ''
    Fornecedor_Cliente = Fornecedor_Cliente.filter(item=> {
        return StringtoSearch(item.fornecedor_cliente.toLowerCase()).includes(StringtoSearch(document.querySelector('.box_search input[type=search]').value.toLowerCase())) 
        && Verificar_select_situacao({select: document.querySelector(".box_filtros #situacao"), valor: item.situacao_cadastro})
        && Verificar_select({select: document.querySelector(".box_filtros #tipo"), valor: item.tipo_cadastro})
    })
    if(Fornecedor_Cliente.length > 0){
        for (var for_cli of Fornecedor_Cliente) {
            
            document.querySelector(".table .body_table").innerHTML +=   
            `
                <div>
                    <a onclick="Show_box_fornecedor_cliente(${for_cli.id})">${for_cli.situacao_cadastro ? 'Ativo' : 'Inativo'}</a>
                    <a onclick="Show_box_fornecedor_cliente(${for_cli.id})">${for_cli.tipo_cadastro == 0 ? 'Ambos' : for_cli.tipo_cadastro == 1 ? 'Fornecedor' : 'Cliente'}</a>
                    <a class="nome_fornecedor_cliente" onclick="Show_box_fornecedor_cliente(${for_cli.id})">${for_cli.fornecedor_cliente}</a>
                    <a>
                        <span class="material-symbols-sharp editar" onclick="Show_box_fornecedor_cliente(${for_cli.id})" data-texto="Editar">edit_square</span>
                        <span class="material-symbols-sharp deletar" onclick="Deletar_fornecedor_cliente(${for_cli.id})" data-texto="Excluir">delete</span>
                        <div onclick="Acoes_fornecedor_cliente(${for_cli.id},this)">
                            <span class="material-symbols-sharp acoes" data-texto="Ações">expand_circle_down</span>
                        </div>
                    </a>
                </div>
            `
        }
        Esconder_obj(document.querySelector(".vazio"))
        Aparecer_obj(document.querySelector(".table"))
    }else{
        Aparecer_obj(document.querySelector(".vazio"))
        Esconder_obj(document.querySelector(".table"))
    }
  }else{
    Aparecer_obj(document.querySelector(".vazio"))
    Esconder_obj(document.querySelector(".table"))
  }
}

document.querySelector('.show_filtros').addEventListener('click',()=>{
    document.querySelector('.show_filtros .icon_arrow').classList.toggle('collapsed')
    document.querySelector('.box_filtros').classList.toggle('ativo')
})

document.querySelector('.box_search input').addEventListener('keypress',(e)=>{if (e.keyCode === 13 || e.which === 13) {Listar_fornecedor_cliente()}})
document.querySelector('.box_search span.search').addEventListener('click',()=>{Listar_fornecedor_cliente()})

document.querySelector(".box_btn button").addEventListener("click",()=>{
    id_Fornecedor_Cliente = undefined
    Show_box_fornecedor_cliente()
})

document.querySelector(".vazio button").addEventListener("click",()=>{
    id_Fornecedor_Cliente = undefined
    Show_box_fornecedor_cliente()
})

document.querySelector(".box_fornecedor_cliente .close").addEventListener("click",()=>{
  Esconder_obj(document.querySelector(".back_box_fornecedor_cliente"))
  limpar_inputs(document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente"))
})

document.querySelector(".box_fornecedor_cliente .cancelar").addEventListener("click",()=>{
  Esconder_obj(document.querySelector(".back_box_fornecedor_cliente"))
  limpar_inputs(document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente"))
})

let preencher_box_fornecedor_cliente = (id) =>{
    let for_cli = Fornecedor_Cliente.find(for_cli => id == for_cli.id)
    document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #situacao_cadastro").checked = for_cli.situacao_cadastro;
    document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #tipo_cadastro").value = for_cli.tipo_cadastro
    document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #nome").value = for_cli.fornecedor_cliente
    document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #cpf_cnpj").value = for_cli.cpf_cnpj
    document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #telefone").value = for_cli.telefone
    document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #email").value = for_cli.email
    document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #obs_fornecedor_cliente").value = for_cli.obs_fornecedor_cliente
}

let Show_box_fornecedor_cliente = (id) => {
    document.querySelector('body').classList.add('noScrool');
    id_Fornecedor_Cliente = id;
    if(!!id){
        preencher_box_fornecedor_cliente(id);
        document.querySelector('.back_box_fornecedor_cliente .adicionar').innerText = "Editar"
        Aparecer_obj(document.querySelector(".back_box_fornecedor_cliente"))
    }else{
        document.querySelector('.back_box_fornecedor_cliente .adicionar').innerText = "Adicionar"
        Aparecer_obj(document.querySelector(".back_box_fornecedor_cliente"))
    }
}

document.querySelector(".box_fornecedor_cliente").addEventListener("submit",(e)=>{
    e.preventDefault()
    if (e.keyCode === 13) { e.preventDefault(); return false; }
    if(!!id_Fornecedor_Cliente){
        if(!validar_dados_inputs(document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #nome"), false)){
            showMessageBox().showMessage({
                type: 'warning',
                title: 'Editar Cadastro',
                text: `Realmente deseja <strong>editar</strong> este cadastro?`,
                accept:{
                    function : ()=>{
                        let new_Fornecedor_Cliente = Fornecedor_Cliente.map(forn_cli=>{
                            if(id_Fornecedor_Cliente == forn_cli.id){
                                return {
                                    id: forn_cli.id,
                                    situacao_cadastro: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #situacao_cadastro").checked,
                                    tipo_cadastro: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #tipo_cadastro").value,
                                    fornecedor_cliente: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #nome").value,
                                    cpf_cnpj: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #cpf_cnpj").value,
                                    telefone: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #telefone").value,
                                    email: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #email").value,
                                    obs_fornecedor_cliente: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #obs_fornecedor_cliente").value,
                                }
                            }else{
                                return forn_cli
                            }
                        })
                        localStorage.setItem('Fornecedor_Cliente',JSON.stringify(new_Fornecedor_Cliente))
                        Esconder_obj(document.querySelector(".back_box_fornecedor_cliente"))
                        limpar_inputs(document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente"))
                        Listar_fornecedor_cliente();
                    },
                    text: 'Editar'
                }
            })
        }
    }else{
        if(!validar_dados_inputs(document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #nome"), false)){
            showMessageBox().showMessage({
                type: 'warning',
                title: 'Adicionar cadastro',
                text: `Realmente deseja <strong>adicionar</strong> este cadastro?`,
                accept:{
                    function : ()=>{
                        let new_id = !!Fornecedor_Cliente ? Fornecedor_Cliente.reduce((acc, {id})=> acumulador = Math.max(acc, id),0) : 0
                        
                        let dados = {
                            id: ++new_id,
                            situacao_cadastro: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #situacao_cadastro").checked,
                            tipo_cadastro: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #tipo_cadastro").value,
                            fornecedor_cliente: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #nome").value,
                            cpf_cnpj: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #cpf_cnpj").value,
                            telefone: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #telefone").value,
                            email: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #email").value,
                            obs_fornecedor_cliente: document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente #obs_fornecedor_cliente").value,
                        }
                        Fornecedor_Cliente.push(dados)
                        localStorage.setItem('Fornecedor_Cliente',JSON.stringify(Fornecedor_Cliente))
                        Esconder_obj(document.querySelector(".back_box_fornecedor_cliente"))
                        limpar_inputs(document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente"))
                        Listar_fornecedor_cliente();
                    },
                    text: 'Adicionar'
                }
            })
        }
    }
})

let Deletar_fornecedor_cliente = id =>{
    if(!!id){
            showMessageBox().showMessage({
                type: 'danger',
                title: 'Excluir cadastro',
                text: `Realmente deseja <strong>excluir</strong> este cadastro?`,
                accept:{
                    function : ()=>{
                        Fornecedor_Cliente = Fornecedor_Cliente.filter((item) => item.id !== id)
                        localStorage.setItem('Fornecedor_Cliente',JSON.stringify(Fornecedor_Cliente))
                        Listar_fornecedor_cliente();
                    },
                    text: 'Excluir'
                }
            })
    }else{
        showMessageBox().showMessage({
            type: 'danger',
            title: 'ERRO DESCONHECIDO',
            text: `ERRO DESCONHECIDO AO TENTAR EXCLUIR CADASTRO!`
        })
    }
}

let Acoes_fornecedor_cliente = (id, obj) =>{
    if(document.querySelector('.more-actions')){
        document.querySelector('.more-actions').remove()
    }
    if(!!id){
        let for_cli = Fornecedor_Cliente.find(for_cli => id == for_cli.id).tipo_cadastro        
        obj.innerHTML += `
        <div class="more-actions">
            <ul>
                ${for_cli == 0 
                    ? `
                        <li>
                            <a href="#">
                                <span class="material-symbols-sharp acoes" data-texto="Add recebimento">add_circle</span>Novo recebimento
                            </a>
                        </li>
                        <li>
                            <a href="/lion-rock/contas_pagar/?f=${id}">
                                <span class="material-symbols-sharp acoes" data-texto="Add pagamento">add_circle</span>Novo pagamento
                            </a>
                        </li>
                    `  
                    : for_cli == 1 
                        ? `
                            <li>
                                <a href="/lion-rock/contas_pagar/?f=${id}">
                                    <span class="material-symbols-sharp acoes" data-texto="Add pagamento">add_circle</span>Novo pagamento
                                </a>
                            </li>
                        ` 
                        : `
                            <li>
                                <a href="#">
                                    <span class="material-symbols-sharp acoes" data-texto="Add recebimento">add_circle</span>Novo recebimento
                                </a>
                            </li>
                        `
                }
            </ul>
        </div>`
    }else{
        showMessageBox().showMessage({
            type: 'danger',
            title: 'ERRO DESCONHECIDO',
            text: `ERRO DESCONHECIDO AO TENTAR EXCLUIR CADASTRO!`
        })
    }
} 

window.addEventListener('mouseup', function(e) {
    if(e.target == document.querySelector('.back_box_fornecedor_cliente') && !document.querySelector('.back_box_fornecedor_cliente').classList.value.includes('hidden')){
        Esconder_obj(document.querySelector(".back_box_fornecedor_cliente"))
        limpar_inputs(document.querySelector(".back_box_fornecedor_cliente .box_fornecedor_cliente"))
    }
    if(document.querySelector('.more-actions') && !document.querySelector('.more-actions').contains(e.target)){
        document.querySelector('.more-actions').remove()
    }
});

Listar_fornecedor_cliente();