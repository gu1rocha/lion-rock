let data = new Date();
let compras_dias = '', compras = '', compras_calendario = '';

const mes_extenso = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro"
];

document.querySelector('.data p').innerText = 'hoje: ' + data.toLocaleString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }).replaceAll('.','').replaceAll('de ','');

const Renderizar_calendario = ()=>{
  
  const mes = data.getMonth();


  const ultimo_dia = new Date(data.getFullYear(), data.getMonth() + 1, 0)
  const ultimo_dia_extenso = ultimo_dia.getDate();
  const ultimo_dia_index = ultimo_dia.getDay();

  const prev_ultimo_dia = new Date(data.getFullYear(), data.getMonth(), 0).getDate()

  const primeiro_dia = new Date(data.getFullYear(), data.getMonth(), 1)

  const primeiro_dia_index = primeiro_dia.getDay();

  const dias = document.querySelector(".dias")

  dias.innerText = ""
  
  let dias_loop = ""

  for (let i = primeiro_dia_index; i > 0; i--) {
    dias_loop += `<div class="prev_dia">${prev_ultimo_dia - i + 1}</div>`;
  }

  if(!!JSON.parse(localStorage.getItem("Compras")) && JSON.parse(localStorage.getItem("Compras")).length) {
    compras = JSON.parse(localStorage.getItem("Compras"));
    compras_calendario = compras.filter((compra) => new Date(compra.data) < ultimo_dia && new Date(compra.data) > primeiro_dia)
    compras_dias = [...new Set(compras_calendario.map((compra) => new Date(compra.data).getDate()))]
  }

  for (let i = 1; i <= ultimo_dia_extenso; i++) {
    dias_loop += i === new Date().getDate() && data.getMonth() === new Date().getMonth() && data.getFullYear() === new Date().getFullYear() 
                        ? `<div class="hoje">${i}<div>${compras_dias.includes(i)? `<span class="pagar" onclick="Show_box_evento(${[data.getFullYear(),data.getMonth(),i]})"></span>`:''}</div></div>` 
                        : `<div>${i}<div>${compras_dias.includes(i)?`<span class="pagar" onclick="Show_box_evento(${[data.getFullYear(),data.getMonth(),i]})"></span>`:''}</div></div>`;
  }

  for (let i = 1; i <=  6 - ultimo_dia_index; i++) {
    dias_loop += `<div class="next_dia">${i}</div>`;
  }

  dias.innerHTML = dias_loop;

  document.querySelector('.data h1').innerText = mes_extenso[mes] + ' ' + data.getFullYear();
}


document.querySelector(".mes .next").addEventListener("click",()=>{
  data.setDate(
    new Date(data.getFullYear(), data.getMonth() + 2, 0).getDate() < data.getDate() 
    ? new Date(data.getFullYear(), data.getMonth() + 2, 0).getDate() 
    : data.getDate()
  )
  data.setMonth(data.getMonth() + 1)
  Renderizar_calendario()
})

document.querySelector(".mes .prev").addEventListener("click", () => {
  data.setDate(
    new Date(data.getFullYear(), data.getMonth() + 2, 0).getDate() < data.getDate() 
    ? new Date(data.getFullYear(), data.getMonth() + 2, 0).getDate() 
    : data.getDate()
  )
  data.setMonth(data.getMonth() - 1)
  Renderizar_calendario()
})

Renderizar_calendario()

document.querySelector('.data p').addEventListener('click',()=>{
  data = new Date();
  Renderizar_calendario()
})

const back_box_eventos = document.querySelector('.back_box_eventos')
const close_back_box_eventos = back_box_eventos.querySelector('.top .close')

let Show_box_evento = (ano, mes, dia) =>{
  
  document.querySelector('body').classList.value === 'noScrool' 
  ? document.querySelector('body').classList.add('Show_box_evento') 
  : document.querySelector('body').classList.add('noScrool')

  back_box_eventos.classList.toggle('hidden')
  let contas_pagar_dia = compras.filter((compra) => new Date(ano, mes, dia).toLocaleDateString() === new Date(compra.data).toLocaleDateString())
  document.querySelector('.box_eventos .tarefas.contas_pagar .body_table').innerHTML = '';
  document.querySelector('.box_eventos .tarefas.contas_pagar .table_total').innerText = '';
  if(!!contas_pagar_dia.length){
    let total_pagar = 0
    document.querySelector('.box_eventos .tarefas.contas_pagar .body_table').innerHTML = ''
    for (const iterator of contas_pagar_dia) {
      total_pagar += iterator.valor
      document.querySelector('.box_eventos .tarefas.contas_pagar .body_table').innerHTML += 
      `
        <div>
          <a>${new Date(iterator.data).getDate()}</a>
          <a>${iterator.loja}</a>
          <a>${iterator.valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</a>
          <a></a>
        </div>
      `
    }
    document.querySelector('.box_eventos .tarefas.contas_pagar .table_total').innerText = `Valor total: ${total_pagar.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    document.querySelector('.box_eventos .tarefas.contas_pagar').classList.remove('hidden');
  }else{
    document.querySelector('.box_eventos .tarefas.contas_pagar').classList.add('hidden');
  }
}

close_back_box_eventos.addEventListener('click',()=>{
  back_box_eventos.classList.toggle('hidden')
  document.querySelector('body').classList.value.includes('show_box_evento')
  ? document.querySelector('body').classList.remove('show_box_evento') 
  : document.querySelector('body').classList.remove('noScrool')
})