const tabela = document.querySelector(".table");
const cabecalho_tabela = tabela.querySelector(".head_table");
const corpo_tabela = tabela.querySelector(".body_table");

const vazio = document.querySelector('.vazio')

const box_compra = document.querySelector('.box_compra');
const valor_total = box_compra.querySelector('.valor_total');
const close_box_compra = box_compra.querySelector('.close');
const cancel_box_compra = box_compra.querySelector('.cancelar');

const show_box_compra = document.querySelector('.show_box_compra');
const box_pagamento = document.querySelector('.back_box_pagamento');
const box_grafico = document.querySelector(".box_grafico")

let id_compra = undefined, id_pagamento = undefined, pagamentos = [], contas_pagar = [], hoje = new Date(), pago = ""

let Verificar_select_boolean = (params)=>{
    if(!!params.select.value){
        return params.valor === JSON.parse(params.select.value)
    }
    return true
}

let Verificar_data = params =>{
    if(!!params.input.value){
        return params.verificador == 'maior' 
        ? (new Date(params.valor) >= new Date(new Date(params.input.value).setHours(new Date(params.input.value).getHours() + 3))) 
        : (new Date(params.valor) <= new Date(new Date(params.input.value).setHours(new Date(params.input.value).getHours() + 3)))
    }
    return true
}

let Verificar_valor = params =>{
    if(!!params.input.value){
        return params.verificador == 'maior' 
        ? +params.valor >= +params.input.value
        : +params.valor <= +params.input.value
    }
    return true
}

let Verificar_select_ul = params =>{
    if(!!params.select.value){
        let selecteds = [...params.select.options].filter(option => option.selected).map(option => option.value)
        if(selecteds.length === params.select.options.length){
            return true
        }else{
            return selecteds.includes(params.valor)
        }
    }
    return true
}

let Listar_compras = ()=>{
    if(!!JSON.parse(localStorage.getItem("Contas_pagar")) && JSON.parse(localStorage.getItem("Contas_pagar")).length) {
        contas_pagar = JSON.parse(localStorage.getItem("Contas_pagar"));
        corpo_tabela.innerHTML = ''
        contas_pagar = contas_pagar.filter(item=> {
            return StringtoSearch(item.fornecedor.toLowerCase()).includes(StringtoSearch(document.querySelector('.box_search input[type=search]').value.toLowerCase())) 
            && Verificar_select_boolean({select: document.querySelector(".box_filtros #situacao"), valor: item.situacao_pagamento})
            && Verificar_data({input:document.querySelector(".box_filtros #emissao_inicio"), valor: item.data_emissao, verificador: 'maior'})
            && Verificar_data({input:document.querySelector(".box_filtros #emissao_fim"), valor: item.data_emissao, verificador: 'menor'})
            && Verificar_data({input:document.querySelector(".box_filtros #vencimento_inicio"), valor: item.data_vencimento, verificador: 'maior'})
            && Verificar_data({input:document.querySelector(".box_filtros #vencimento_fim"), valor: item.data_vencimento, verificador: 'menor'})
            && Verificar_data({input:document.querySelector(".box_filtros #pagamento_inicio"), valor: item.data_pagamento, verificador: 'maior'})
            && Verificar_data({input:document.querySelector(".box_filtros #pagamento_fim"), valor: item.data_pagamento, verificador: 'menor'})
            && Verificar_valor({input:document.querySelector(".box_filtros #valor_inicio"), valor: item.valor_total, verificador: 'maior'})
            && Verificar_valor({input:document.querySelector(".box_filtros #valor_fim"), valor: item.valor_total, verificador: 'menor'})
            && Verificar_select_ul({select: document.getElementById('multiple_select_categoria'), valor: item.id_categoria})
            //&& Verificar_select({select: document.querySelector(".box_filtros #tipo"), valor: item.tipo_cadastro})
        })
        if(contas_pagar.length > 0){
            for (const compra of contas_pagar) {
                corpo_tabela.innerHTML +=   `
                                            <div>
                                                <a>${dateToUTC(compra.data_vencimento)}</a>
                                                <a>${compra.fornecedor}</a>
                                                <a>${compra.categoria}</a>
                                                <a>${compra.ocorrencia == 0 ? 'Unica' : compra.n_parcela+' / '+compra.qtd_parcelas}</a>
                                                <a>${(+compra.valor_total).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</a>
                                                <a>
                                                    ${!compra.situacao_pagamento ? `<span class="material-symbols-sharp pagar" onclick="Show_box_pagamento(${compra.id})" data-texto="Pagar">payments</span>` : `<span class="material-symbols-sharp estornar" onclick="Estornar_pagamento(${compra.id})" data-texto="Estornar">payments</span>`}
                                                    <span class="material-symbols-sharp editar" onclick="Editar_compra(${compra.id})" data-texto="Editar">edit_square</span>
                                                    <span class="material-symbols-sharp deletar" onclick="Deletar_compra(${compra.id})" data-texto="Excluir">delete</span>
                                                </a>
                                            </div>
                                        `
            }
            Esconder_obj(vazio);
            Aparecer_obj(tabela);
            Aparecer_obj(box_grafico);
        }else{
            Esconder_obj(tabela);
            Aparecer_obj(vazio);
            Esconder_obj(box_grafico);
        }
    }else{
        Esconder_obj(tabela);
        Aparecer_obj(vazio);
        Esconder_obj(box_grafico);
    }
    legenda_grafico.value == 1 ? Pegar_valores_fornecedor() : Pegar_valores_mes()
}

for (const categoria of categorias_despesas.categorias_despesas) {
    var opt = document.createElement('option');
    opt.value = categoria.id;
    opt.innerHTML = categoria.descricao;
    document.querySelector("#multiple_select_categoria").appendChild(opt);

    document.querySelector(".box_lista_categoria ul").innerHTML += `
        <li data-id="${categoria.id}"><a>${categoria.descricao}</a></li>
    `
}

let Selecionar_todas_opcoes = (select, valor) => {
    !!valor ? document.querySelector('.filter_option').innerText = "Todos" : document.querySelector('.filter_option').innerText = "Selecione"
    for (const iterator of select.options) {
        iterator.selected = valor
    }
    for (const iterator of document.querySelectorAll(".box_lista_categoria ul li")) {
        !!valor ? iterator.classList.add("checked") : iterator.classList.remove("checked")
    }
}

let Verificar_selecionados = (select, box_ul) =>{
    let selecteds = [...select.options].filter(option => option.selected).map(option => option.innerText)
    if(select.options.length === selecteds.length){
        Selecionar_todas_opcoes(document.querySelector("#multiple_select_categoria"),true)
    }else{
        selecteds.length > 0 ? box_ul.innerText = "" : box_ul.innerText = "Selecione"
        for (let index = 0; index < selecteds.length; index++) {
            index > 0 ? box_ul.innerText += `, ${selecteds[index]}` : box_ul.innerText += `${selecteds[index]}`
        }
    }
}

for (const iterator of document.querySelectorAll(".box_lista_categoria ul li")) {
    iterator.addEventListener('click',(e)=>{
        let valor_id = e.target.localName == 'li' ? e.target.dataset.id : e.target.parentElement.dataset.id
        
        if(!!valor_id){
            if(iterator.classList.contains("checked")) document.querySelector(".box_lista_categoria ul li").classList.remove('checked')
            iterator.classList.toggle("checked")
            document.querySelector("#multiple_select_categoria").options[valor_id].selected = iterator.classList.contains("checked"); 
            
            Verificar_selecionados(document.querySelector("#multiple_select_categoria"),document.querySelector('.filter_option'))
        }else{
            Selecionar_todas_opcoes(document.querySelector("#multiple_select_categoria"),!iterator.classList.contains("checked"))
        }
    })
}

document.querySelector('.btn_dropdown').addEventListener('click',()=>{
    document.querySelector('.box_lista_categoria').classList.toggle('hidden')
})

document.querySelector('.show_filtros').addEventListener('click',()=>{
    document.querySelector('.show_filtros .icon_arrow').classList.toggle('collapsed')
    document.querySelector('.box_filtros').classList.toggle('ativo')
})

document.querySelector('.box_search input').addEventListener('keypress',(e)=>{if (e.keyCode === 13 || e.which === 13) {Listar_compras()}})
document.querySelector('.box_search span.search').addEventListener('click',()=>{Listar_compras()})

let preencher_box_compra = (id) =>{
    let conta = contas_pagar.find(conta => id == conta.id)
    console.log(conta)
    box_compra.querySelector('#nome_fornecedor').value = conta.fornecedor;
    box_compra.querySelector('#id_fornecedor').value = conta.id_fornecedor;
    box_compra.querySelector('#categoria').value = conta.categoria;
    box_compra.querySelector('#id_categoria').value = conta.id_categoria;
    box_compra.querySelector('#data_emissao').valueAsDate = new Date(conta.data_emissao);
    box_compra.querySelector('#qtd_parcela').value = conta.qtd_parcelas;
    box_compra.querySelector('#valor_total').value = conta.valor_total;
    box_compra.querySelector('#obs_pagamento').value = conta.obs;
    Esconder_obj(box_compra.querySelector('.box_ocorrencia'))
}

let Estornar_pagamento = id =>{
    if(!!id){
        showMessageBox().showMessage({
            type: 'warning',
            title: 'Estornar pagamento',
            text: `Realmente deseja <strong>estornar pagamento</strong> desta conta?`,
            accept:{
                function : ()=>{
                    let new_compras = contas_pagar.map(compra=>{
                        if(id == compra.id){
                            return {
                                id: compra.id,
                                fornecedor: compra.fornecedor,
                                id_fornecedor: compra.id_fornecedor,
                                categoria: compra.categoria,
                                id_categoria : compra.id_categoria,
                                situacao_pagamento: false,
                                valor_total : compra.valor_total,
                                data_emissao: compra.data_emissao,
                                data_vencimento: compra.data_vencimento,
                                numero_documento: compra.numero_documento,
                                obs: compra.obs,
                                ocorrencia: compra.ocorrencia,
                                qtd_parcelas: compra.qtd_parcelas,
                                n_parcela: compra.n_parcela,
                                valor_baixa: '',
                                data_pagamento: '',
                                valor_juros : '',
                                valor_desconto: '',
                                valor_taxa: ''
                            }
                        }else{
                            return compra
                        }
                    })
                    localStorage.setItem('Contas_pagar',JSON.stringify(new_compras))
                    corpo_tabela.innerHTML = '';
                    Listar_compras();
                },
                text: 'Estornar'
            }
        })
    }else{
        showMessageBox().showMessage({
            type: 'danger',
            title: 'Erro',
            text: `Erro desconhecido!`
        })
    }
}

let Show_box_pagamento = id =>{
    let conta = contas_pagar.find(conta => id == conta.id)
    if(!conta.situacao_pagamento){
        id_pagamento = id;
        document.querySelector('.back_box_pagamento #valor_baixa').value = conta.valor_total;
        document.querySelector('.back_box_pagamento #valor_baixa').setAttribute('min', conta.valor_total);
        document.querySelector('.back_box_pagamento #valor_pago').value = conta.valor_total;
        document.querySelector('.back_box_pagamento #data_pagamento').valueAsDate = new Date(hoje.setHours(hoje.getHours() - 3))
        Aparecer_obj(box_pagamento)
    }else{
        showMessageBox().showMessage({
            type: 'danger',
            title: 'Erro',
            text: `Está conta já teve pagamento efetivado!`
        })
    }
}

box_pagamento.querySelector(".cancelar").addEventListener('click',(e)=>{
    e.preventDefault()
    Esconder_obj(box_pagamento);
})

box_pagamento.querySelector(".top .close").addEventListener('click',(e)=>{
    e.preventDefault()
    Esconder_obj(box_pagamento);
})

let Alterar_valor_pagamento = (input)=>{
    if(input.value < +input.min || !input.value){
        input.value = input.min
    }
    box_pagamento.querySelector("#valor_pago").value 
    = parseFloat(box_pagamento.querySelector("#valor_baixa").value)
    + parseFloat(box_pagamento.querySelector("#valor_juros").value)
    + parseFloat(box_pagamento.querySelector("#valor_taxa").value)
    - parseFloat(box_pagamento.querySelector("#valor_desconto").value)
}

box_pagamento.addEventListener('submit',(event)=>{
    event.preventDefault();
    if(!!id_pagamento){
        showMessageBox().showMessage({
            type: 'warning',
            title: 'Efetivar pagamento',
            text: `Realmente deseja <strong>efetivar pagamento</strong> desta conta?`,
            accept:{
                function : ()=>{
                    let new_compras = contas_pagar.map(compra=>{
                        if(id_pagamento == compra.id){
                            return {
                                id: compra.id,
                                fornecedor: compra.fornecedor,
                                id_fornecedor: compra.id_fornecedor,
                                categoria: compra.categoria,
                                id_categoria : compra.id_categoria,
                                situacao_pagamento: true,
                                valor_total : compra.valor_total,
                                data_emissao: compra.data_emissao,
                                data_vencimento: compra.data_vencimento,
                                numero_documento: compra.numero_documento,
                                obs: compra.obs,
                                ocorrencia: compra.ocorrencia,
                                qtd_parcelas: compra.qtd_parcelas,
                                n_parcela: compra.n_parcela,
                                valor_baixa: box_pagamento.querySelector("#valor_baixa").value,
                                data_pagamento: new Date(box_pagamento.querySelector("#data_pagamento").valueAsDate.setHours(box_pagamento.querySelector("#data_pagamento").valueAsDate.getHours() + 3)),
                                valor_juros : box_pagamento.querySelector("#valor_juros").value,
                                valor_desconto: box_pagamento.querySelector("#valor_desconto").value,
                                valor_taxa: box_pagamento.querySelector("#valor_taxa").value
                            }
                        }else{
                            return compra
                        }
                    })
                    localStorage.setItem('Contas_pagar',JSON.stringify(new_compras))
                    corpo_tabela.innerHTML = '';
                    Listar_compras();
                    Esconder_obj(box_pagamento)
                },
                text: 'Pagar'
            }
        })
    }else{
        showMessageBox().showMessage({
            type: 'danger',
            title: 'Erro',
            text: `Erro desconhecido!`
        })
    }
})

let Editar_compra = id =>{
    if(!contas_pagar.find((item) => item.id == id).situacao_pagamento){
        id_compra = id
        Show_box_compra({id})
    }else{
        showMessageBox().showMessage({
            type: 'danger',
            title: 'Editar Compra',
            text: `Está compra não pode ser editada por já ter pagamentos efetivados!`
        })
    }
}

let Show_box_compra = (params) => {
    box_compra.querySelector("#data_vencimento").valueAsDate = new Date(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).setHours(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getHours() - 3))
    box_compra.querySelector('#data_emissao').valueAsDate = new Date(hoje.setHours(hoje.getHours() - 3))
    document.querySelector('body').classList.add('noScrool');
    box_compra.querySelector("#valor_baixa").value= 0
    box_compra.querySelector("#valor_juros").value= 0
    box_compra.querySelector("#valor_taxa").value= 0
    box_compra.querySelector("#valor_desconto").value = 0
    
    box_compra.querySelector('.box_parcelas').innerHTML = ''
    Aparecer_obj(box_compra.querySelector('.situacao_pagamento'))
    Aparecer_obj(box_compra.querySelector('.box_ocorrencia'))
    Esconder_obj(box_compra.querySelector('.qtd_parcela'))
    Esconder_obj(box_compra.querySelector('.box_pago'))
    if(params?.id){
        preencher_box_compra(params.id);
        box_compra.querySelector('.adicionar').innerText = "Editar"
        Aparecer_obj(box_compra.parentElement)
    }else{
        if(params?.fornecedor){
            let for_cli = JSON.parse(localStorage.getItem("Fornecedor_Cliente")).find(for_cli => params.fornecedor == for_cli.id)
            box_compra.querySelector('#nome_fornecedor').value = for_cli.fornecedor_cliente;
        }
        box_compra.querySelector('.adicionar').innerText = "Adicionar"
        Aparecer_obj(box_compra.parentElement)
    }
}

let Hide_box_compra = () => {
    Esconder_obj(box_compra.parentElement)
    id_compra = undefined;
    limpar_inputs(document.querySelector('.back_box_compra .box_compra'))
    document.querySelector('body').classList.remove('noScrool');
}

box_compra.querySelector('#situacao_pagamento').addEventListener('change',(e)=>{
    if(!!e.target.checked){
        Aparecer_obj(box_compra.querySelector('.box_pago'))
        box_compra.querySelector('#ocorrencia').value = 0
        box_compra.querySelector('#data_pagamento').valueAsDate = new Date(hoje.setHours(hoje.getHours() - 3))
        Esconder_obj(box_compra.querySelector('.box_ocorrencia'))
    }else{
        Esconder_obj(box_compra.querySelector('.box_pago'))
        if(!id_compra) Aparecer_obj(box_compra.querySelector('.box_ocorrencia'))
    }
})

box_compra.querySelector('#ocorrencia').addEventListener('change',(e)=>{
    e.target.value == 0
    ? (
        Aparecer_obj(box_compra.querySelector('.situacao_pagamento')),
        Esconder_obj(box_compra.querySelector('.qtd_parcela')),
        box_compra.querySelector('.box_parcelas').innerHTML = '',
        box_compra.querySelector('#qtd_parcela').value = ''
        )
    : (
        Esconder_obj(box_compra.querySelector('.situacao_pagamento')),
        Esconder_obj(box_compra.querySelector('.box_pago')),
        Aparecer_obj(box_compra.querySelector('.qtd_parcela'))
    )
})

let Alterar_valor_pago = (input)=>{
    if(!input.value) input.value = 0
    box_compra.querySelector("#valor_pago").value 
    = parseFloat(box_compra.querySelector("#valor_baixa").value)
    + parseFloat(box_compra.querySelector("#valor_juros").value)
    + parseFloat(box_compra.querySelector("#valor_taxa").value)
    - parseFloat(box_compra.querySelector("#valor_desconto").value)
}

let Alterar_valor_baixa = (input)=>{
    box_compra.querySelector("#valor_baixa").value = input.value
    box_compra.querySelector("#valor_pago").value = input.value
}

show_box_compra.addEventListener('click',()=>Show_box_compra());

document.querySelector('.vazio button').addEventListener('click',()=>Show_box_compra());

cancel_box_compra.addEventListener('click',(e)=>{
  e.preventDefault()
  Hide_box_compra()
});

close_box_compra.addEventListener('click',Hide_box_compra);

let validar_dados = () =>{
    erro = false;
    erro = validar_dados_inputs(box_compra.querySelector('#nome_fornecedor'), erro);
    erro = validar_dados_inputs(box_compra.querySelector('#categoria'), erro);
    erro = validar_dados_inputs(box_compra.querySelector('#data_emissao'), erro);
    if(box_compra.querySelector('#ocorrencia').value > 0)
    erro = validar_dados_inputs(box_compra.querySelector('#qtd_parcela'), erro);
    if(!!box_compra.querySelector('#situacao_pagamento').checked){
        erro = validar_dados_inputs(box_compra.querySelector('#data_pagamento'), erro);
        erro = validar_dados_inputs(box_compra.querySelector('#valor_baixa'), erro);
    }
    erro = validar_dados_inputs(box_compra.querySelector('#valor_total'), erro);
    erro = validar_dados_inputs(box_compra.querySelector('#data_vencimento'), erro);
    return erro;
}

box_compra.addEventListener('submit',(event)=>{
    event.preventDefault();
    if(!!id_compra){
        if(!validar_dados()){
            showMessageBox().showMessage({
                type: 'warning',
                title: 'Editar Compra',
                text: `Realmente deseja <strong>editar</strong> está compra?`,
                accept:{
                    function : ()=>{
                        pago = box_compra.querySelector("#situacao_pagamento").checked;
                        let new_compras = contas_pagar.map(compra=>{
                            if(id_compra == compra.id){
                                return {
                                    id: compra.id,
                                    fornecedor: box_compra.querySelector("#nome_fornecedor").value,
                                    id_fornecedor: box_compra.querySelector("#id_fornecedor").value,
                                    categoria: box_compra.querySelector("#categoria").value,
                                    id_categoria : document.querySelector("#id_categoria").value,
                                    situacao_pagamento: pago,
                                    valor_total : box_compra.querySelector("#valor_total").value,
                                    data_emissao: new Date(box_compra.querySelector("#data_emissao").valueAsDate.setHours(box_compra.querySelector("#data_emissao").valueAsDate.getHours() + 3)),
                                    data_vencimento: new Date(box_compra.querySelector("#data_vencimento").valueAsDate.setHours(box_compra.querySelector("#data_vencimento").valueAsDate.getHours() + 3)),
                                    numero_documento: box_compra.querySelector("#n_documento").value,
                                    obs: box_compra.querySelector("#obs_pagamento").value,
                                    ocorrencia: compra.ocorrencia,
                                    qtd_parcelas: compra.qtd_parcelas,
                                    n_parcela: compra.n_parcela,
                                    valor_baixa:
                                    !!pago ? box_compra.querySelector("#valor_baixa").value : '',
                                    data_pagamento: !!pago ? new Date(box_compra.querySelector("#data_pagamento").valueAsDate.setHours(box_compra.querySelector("#data_pagamento").valueAsDate.getHours() + 3)) : "",
                                    valor_juros : !!pago ? box_compra.querySelector("#valor_juros").value : "",
                                    valor_desconto: !!pago ? box_compra.querySelector("#valor_desconto").value : "",
                                    valor_taxa: !!pago ? box_compra.querySelector("#valor_taxa").value : ""
                                }
                            }else{
                                return compra
                            }
                        })
                        localStorage.setItem('Contas_pagar',JSON.stringify(new_compras))
                        corpo_tabela.innerHTML = '';
                        Listar_compras();
                        Hide_box_compra();
                    },
                    text: 'Editar'
                }
            })
        }
    }else{
        if(!validar_dados()){
            showMessageBox().showMessage({
                type: 'warning',
                title: 'Adicionar Compra',
                text: `Realmente deseja <strong>adicionar</strong> está compra?`,
                accept:{
                    function : ()=>{
                        pago = box_compra.querySelector("#situacao_pagamento").checked;
                        let dados = {}
                        let new_id = !!contas_pagar ? contas_pagar.reduce((acc, {id})=> acumulador = Math.max(acc, id),0) : 0
              
                        if(box_compra.querySelector("#ocorrencia").value == 1 && box_compra.querySelector("#qtd_parcela").value > 1 && box_compra.querySelectorAll(".box_parcelas .linha_parcela").length > 1){
                        
                            let i = 0
                            for (const box_input of box_compra.querySelectorAll(".box_parcelas .linha_parcela")) {
                            dados = {
                                id: ++new_id,
                                fornecedor: box_compra.querySelector("#nome_fornecedor").value,
                                id_fornecedor: box_compra.querySelector("#id_fornecedor").value,
                                categoria: box_compra.querySelector("#categoria").value,
                                id_categoria : document.querySelector("#id_categoria").value,
                                situacao_pagamento: pago,
                                valor_total : box_input.querySelector('input[type="number"]').value,
                                data_emissao: new Date(box_compra.querySelector("#data_emissao").valueAsDate.setHours(box_compra.querySelector("#data_emissao").valueAsDate.getHours() + 3)),
                                data_vencimento: new Date(box_input.querySelector('input[type="date"]').valueAsDate.setHours(box_input.querySelector('input[type="date"]').valueAsDate.getHours() + 3)),
                                numero_documento: box_compra.querySelector("#n_documento").value,
                                obs: box_compra.querySelector("#obs_pagamento").value,
                                ocorrencia: box_compra.querySelector("#ocorrencia").value,
                                qtd_parcelas: box_compra.querySelector("#qtd_parcela").value,
                                n_parcela: ++i,
                                valor_baixa: !!pago ? box_compra.querySelector("#valor_baixa").value : '',
                                data_pagamento: !!pago ? new Date(box_compra.querySelector("#data_pagamento").valueAsDate.setHours(box_compra.querySelector("#data_pagamento").valueAsDate.getHours() + 3)) : "",
                                valor_juros : !!pago ? box_compra.querySelector("#valor_juros").value : "",
                                valor_desconto: !!pago ? box_compra.querySelector("#valor_desconto").value : "",
                                valor_taxa: !!pago ? box_compra.querySelector("#valor_taxa").value : "",
                            }
                            contas_pagar.push(dados)
                        }
                        }else{
                            dados = {
                                id: ++new_id,
                                fornecedor: box_compra.querySelector("#nome_fornecedor").value,
                                id_fornecedor: box_compra.querySelector("#id_fornecedor").value,
                                categoria: box_compra.querySelector("#categoria").value,
                                id_categoria : document.querySelector("#id_categoria").value,
                                situacao_pagamento: pago,
                                valor_total : box_compra.querySelector("#valor_total").value,
                                data_emissao: new Date(box_compra.querySelector("#data_emissao").valueAsDate.setHours(box_compra.querySelector("#data_emissao").valueAsDate.getHours() + 3)),
                                data_vencimento: new Date(box_compra.querySelector("#data_vencimento").valueAsDate.setHours(box_compra.querySelector("#data_vencimento").valueAsDate.getHours() + 3)),
                                numero_documento: box_compra.querySelector("#n_documento").value,
                                obs: box_compra.querySelector("#obs_pagamento").value,
                                ocorrencia: box_compra.querySelector("#ocorrencia").value,
                                qtd_parcelas: box_compra.querySelector("#qtd_parcela").value,
                                n_parcela: 0,
                                valor_baixa:
                                !!pago ? box_compra.querySelector("#valor_baixa").value : '',
                                data_pagamento: !!pago ? new Date(box_compra.querySelector("#data_pagamento").valueAsDate.setHours(box_compra.querySelector("#data_pagamento").valueAsDate.getHours() + 3)) : "",
                                valor_juros : !!pago ? box_compra.querySelector("#valor_juros").value : "",
                                valor_desconto: !!pago ? box_compra.querySelector("#valor_desconto").value : "",
                                valor_taxa: !!pago ? box_compra.querySelector("#valor_taxa").value : ""
                            }
                        
                            contas_pagar.push(dados)
                        }
                        
                        localStorage.setItem('Contas_pagar',JSON.stringify(contas_pagar))
                        corpo_tabela.innerHTML = '';
                        Listar_compras();
                        Hide_box_compra();
                    },
                    text: 'Adicionar'
                }
            })
        }
    }
})

let Deletar_compra = id =>{
    if(!!id){
        if(!contas_pagar.find((item) => item.id == id).situacao_pagamento){
            showMessageBox().showMessage({
                type: 'danger',
                title: 'Excluir Compra',
                text: `Realmente deseja excluir está compra?`,
                accept:{
                    function : ()=>{
                        contas_pagar = contas_pagar.filter((item) => item.id !== id)
                        localStorage.setItem('Contas_pagar',JSON.stringify(contas_pagar))
                        corpo_tabela.innerHTML = '';
                        Listar_compras();
                    },
                    text: 'Excluir'
                }
            })
        }else{
            showMessageBox().showMessage({
                type: 'danger',
                title: 'Excluir Compra',
                text: `Está compra não pode ser excluída por já ter pagamentos efetivados!`
            })
        }
    }else{
        showMessageBox().showMessage({
            type: 'danger',
            title: 'ERRO DESCONHECIDO',
            text: `ERRO DESCONHECIDO AO TENTAR EXCLUIR COMPRA!`
        })
    }
}

/*
//TESTE DE LEITURA DE ARQUIVO XLSX E CSV
        let arr =  []
GetHTML('./CSV.csv', 'get',obj => {
    if(obj.status === 200){
        let allRows = obj.responseText.split(/\r?\n|\r/);
        let tbl = document.createElement("table");
        let thead = document.createElement("thead");
        let tblBody = document.createElement("tbody");
        for (let [key,value] of Object.entries( allRows )) {
            !!value ? console.log(`id:${key}, descricao: ${value}`) : ''
        }
        for (let singleRow = 0; singleRow < allRows.length; singleRow++) {
            let tr = document.createElement("tr");
            let rowCells = allRows[singleRow].split(';');
            for (let rowCell = 0; rowCell < rowCells.length; rowCell++) {
                if (singleRow === 0) {
                    let th = document.createElement("th");
                    th.innerText = rowCells[rowCell];
                    tr.appendChild(th);
                } else {
                    let td = document.createElement("td");
                    td.innerText = rowCells[rowCell];
                    tr.appendChild(td);
                }
            }
            singleRow === 0 ? thead.appendChild(tr) : tblBody.appendChild(tr)
        } 
        tbl.appendChild(thead);
        tbl.appendChild(tblBody);
        document.querySelector('body').append(tbl);
    }else{
        console.log(obj)
    }
})*/


const grafico_despesa_mensal = document.getElementById("grafico_despesa_mensal");
let myChart = new Chart(grafico_despesa_mensal)

let Pegar_valores_fornecedor =  () =>{
    const labels = [], values = []
    let graf = contas_pagar.reduce((soma, cur) => {
        let repetido = soma.find(elem => elem.fornecedor === cur.fornecedor)
        if (repetido) repetido.valor += +cur.valor_total; 
        else soma.push({'fornecedor': cur.fornecedor, 'valor': +cur.valor_total});
        return soma;
    }, []);

    for (const compra of graf) {
        labels.push(compra.fornecedor)
        values.push(compra.valor)
    }
    GerarGrafico(grafico_despesa_mensal,labels,'Total de contas por fornecedor',values, 'bar')
}

let Pegar_valores_mes =  () =>{
    const labels = [], values = []
    let graf = contas_pagar.reduce((soma, cur) => {
        let repetido = soma.find(elem =>new Date(elem.data).getMonth() == new Date(cur.data_vencimento).getMonth() && new Date(elem.data).getFullYear() == new Date(cur.data_vencimento).getFullYear())
        if (repetido) repetido.valor += +cur.valor_total; 
        else soma.push({'data': cur.data_vencimento, 'valor': +cur.valor_total});
        return soma;
    }, []);

    function compare(a,b) {
        if (a.data_vencimento < b.data_vencimento)
            return -1;
        if (a.data_vencimento > b.data_vencimento)
            return 1;
        return 0;
    }

    graf.sort(compare)
    for (const compra of graf) {
        labels.push(new Date(compra.data).toLocaleString([], {month: 'long',year: 'numeric'}))
        values.push(compra.valor)
    }
    GerarGrafico(grafico_despesa_mensal,labels,'Total de contas por mês',values,'line')
}


let GerarGrafico = (local, labels, label, values, type) =>{
    myChart.destroy()
    myChart = new Chart(local, {
        type: type,
        data:{
            labels: labels,
            datasets: [{
                axis: 'y',
                label: label,
                data: values,
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                backgroundColor: [
                  '#1c434f'
                ]
              }]
        }
    })
}

const legenda_grafico = document.getElementById("legenda_grafico");
legenda_grafico.addEventListener('change',()=> legenda_grafico.value == 1 ? Pegar_valores_fornecedor() : Pegar_valores_mes())

const urlParams = new URLSearchParams(location.search)

if(!!urlParams.get('f')){
    Show_box_compra({fornecedor : urlParams.get('f')})
    history.pushState({}, null, location.origin+location.pathname)
}

let Selecionar_fornecedor = (id, fornecedor)=>{
    document.getElementById('id_fornecedor').value = id;
    document.getElementById('nome_fornecedor').value = fornecedor;
    document.querySelector('.box_compra ul').innerHTML = ''
}

let Selecionar_categoria = (id, categoria)=>{
    document.getElementById('id_categoria').value = id;
    document.getElementById('categoria').value = categoria;
    Esconder_obj(document.querySelector('.box_compra ul.categorias'))
    document.querySelector('.box_compra ul.categorias').innerHTML = ''
}

let Formatar_data = (dia,mes,ano)=>{
    mes = mes < 10 ? mes == 0 ? 12 : '0' + mes : mes;
    dia = dia < 10 ? '0'+dia : dia
    return `${ano}-${mes}-${dia}`
}

let Alterar_valor_parcelas = (e)=>{
    if(!e.target.value) e.target.value = 0
    let teste = false, ver = 0, ant = 0
    for (const iterator of box_compra.querySelectorAll('.box_parcelas .valor')) {
        if (iterator === e.target) {
            teste = true
        }
        if(!!teste){
            if(iterator !== e.target){
                ver++
            }else{
                ant += parseFloat(iterator.value);
            }
        }else{
            ant += parseFloat(iterator.value);
        }
    }teste = false
    for (const iterator of box_compra.querySelectorAll('.box_parcelas .valor')) {
        if (iterator === e.target) {
            teste = true
        }
        if(!!teste){
            if(iterator !== e.target){
                iterator.setAttribute('max', ((box_compra.querySelector("#valor_total").value - ant)/ver).toFixed(2))
                iterator.value = ((box_compra.querySelector("#valor_total").value - ant)/ver).toFixed(2)
            }
        }
    }
}

let Gerar_parcelas = () =>{
        
    box_compra.querySelector("#qtd_parcela").classList.remove('error')
    box_compra.querySelector("#valor_total").classList.remove('error')
    if(box_compra.querySelector("#qtd_parcela").value > 0 && box_compra.querySelector("#valor_total").value > 0){
        box_compra.querySelector('.box_parcelas').innerHTML = ''
        
        let data = '', 
        dia = new Date(box_compra.querySelector("#data_vencimento").valueAsDate.setHours(box_compra.querySelector("#data_vencimento").valueAsDate.getHours() + 3))
        for(let i = 1; i <=parseInt(box_compra.querySelector("#qtd_parcela").value); i++){
            data = new Date(dia)
            data.setDate(new Date(data.getFullYear(), data.getMonth() + i, 0).getDate() < data.getDate() 
            ? new Date(data.getFullYear(), data.getMonth() + i, 0).getDate() 
            : new Date(dia).getDate())
            data.setMonth(data.getMonth() + i-1)
            box_compra.querySelector('.box_parcelas').innerHTML += `
                <div class="linha_parcela">
                    <div class="box_input">
                    <label>Vencimento</label>
                        <input type="date" value="${Formatar_data(data.getDate(),data.getMonth()+1,data.getFullYear())}">
                    </div>
                    <div class="box_input">
                        <label>Valor parcela</label>
                        <input type="number" step="0.01" onchange="Alterar_valor_parcelas(event)" min="0" max="${box_compra.querySelector("#valor_total").value}" class="valor" style="width: 9.5rem;" value="${(box_compra.querySelector("#valor_total").value/box_compra.querySelector("#qtd_parcela").value).toFixed(2)}" oninput="validity.valid ? this.save = value : value = this.save;">
                    </div>
                </div>
            `
        }
    }else{
        if(box_compra.querySelector("#qtd_parcela").value < 1) box_compra.querySelector("#qtd_parcela").classList.add('error')
        if(box_compra.querySelector("#valor_total").value < 1) box_compra.querySelector("#valor_total").classList.add('error')
    }
}


box_compra.querySelector('button.gerar_parcelas').addEventListener('click',(e)=>{
  e.preventDefault()
  Gerar_parcelas()
})


box_compra.querySelector('#nome_fornecedor').addEventListener('keyup',(e)=>{
    document.querySelector('.box_compra ul.fornecedores').innerHTML = ''
    if(e.target.value.length >= 2){
        let fornecedores = JSON.parse(localStorage.getItem("Fornecedor_Cliente")).filter(
                for_cli => 
                    for_cli.tipo_cadastro <= 1
                    && StringtoSearch(for_cli.fornecedor_cliente.toLowerCase()).includes(StringtoSearch(e.target.value.toLowerCase())) 
            )
        for (const fornecedor of fornecedores) {
            document.querySelector('.box_compra ul').innerHTML += `<li onclick="Selecionar_fornecedor(${fornecedor.id},'${fornecedor.fornecedor_cliente}')">${fornecedor.fornecedor_cliente}</li>`
        }
    }
})

box_compra.querySelector('#categoria').addEventListener('keyup',(e)=>{
    document.querySelector('.box_compra ul.categorias').innerHTML = ''
    if(e.target.value.length >= 2){
        let categorias = categorias_despesas.categorias_despesas.filter(function(categoria){
            if(this.count < 10 && StringtoSearch(categoria.descricao.toLowerCase()).includes(StringtoSearch(e.target.value.toLowerCase()))){
                this.count++
                return categoria
            }
        },{count : 0})
        for (const categoria of categorias) {
            Aparecer_obj(document.querySelector('.box_compra ul.categorias'))
            document.querySelector('.box_compra ul.categorias').innerHTML += `<li onclick="Selecionar_categoria(${categoria.id},'${categoria.descricao}')" tabindex="-1" role="menuitem">${categoria.descricao}</li>`
        }
        
    }else{
        Esconder_obj(document.querySelector('.box_compra ul.categorias'))
    }
})

window.addEventListener('mouseup', function(e) {
    if(e.target == document.querySelector('.back_box_compra') && !document.querySelector('.back_box_compra').classList.value.includes('hidden')){
        Esconder_obj(document.querySelector('.back_box_compra'))
        limpar_inputs(document.querySelector('.back_box_compra .box_compra'))
    }
    if(e.target == document.querySelector('.back_box_pagamento') && !document.querySelector('.back_box_pagamento').classList.value.includes('hidden')){
        Esconder_obj(document.querySelector('.back_box_pagamento'))
    }
    if (!(document.querySelector('.box_lista_categoria').contains(e.target)) 
        && !document.querySelector('.box_lista_categoria').classList.value.includes('hidden') 
        && !document.querySelector('.btn_dropdown').contains(e.target)){
            Esconder_obj(document.querySelector('.box_lista_categoria'))
    }
});

Listar_compras();

for (const input of document.querySelectorAll('input')) {
    input.addEventListener('keypress',(e)=>{
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            return false;
        }
    })
}