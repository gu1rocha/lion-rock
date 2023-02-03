let showMessageBox = ()=> {

    let BoxMessage = {
        showMessage: function(objeto){
            GetHTML('/lion-rock/messageBox/index.html', 'get',  function(obj) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(obj.responseText, "text/html");
                document.querySelector('body').classList.value === 'noScrool' 
                    ? document.querySelector('body').classList.add('show_messageBox') 
                    : document.querySelector('body').classList.add('noScrool')

                document.querySelector('body').appendChild(doc.querySelector('.bgMessageBox'))
    
                let bgMessageBox = document.querySelector('.bgMessageBox')
                let messageBox = document.querySelector('.messageBox')
    
                BoxMessage.objeto = objeto
                BoxMessage.bgMessageBox = bgMessageBox
                
    
                !!objeto.type ? messageBox.classList.add(objeto.type) : ''
                !!objeto.title ? messageBox.querySelector('.titulo').querySelector('h2').innerHTML = objeto.title : ''
                !!objeto.text ? messageBox.querySelector('.boxTexto').querySelector('p').innerHTML = objeto.text : ''
    
                if(!!objeto.boxInput){
                    !objeto.boxInput.textarea ? messageBox.querySelector('.boxInput').querySelector('textarea').remove() : ''
                    !objeto.boxInput.input ? messageBox.querySelector('.boxInput').querySelector('input').remove() : ''
                    messageBox.querySelector('.boxInput').querySelector('p').innerHTML = objeto.boxInput.text
                }else{
                    messageBox.querySelector('.boxInput').remove()
                }
    
                if(!!objeto.accept){
                    !!objeto.accept.text ? messageBox.querySelector('.boxButtons').querySelector('.accept').innerText = objeto.accept.text : ''
                    if(!!objeto.boxInput){
                        messageBox.querySelector('.boxButtons').querySelector('.accept').addEventListener('click',()=>{
                            if (messageBox.querySelector('.boxInput').querySelector('textarea').value.length > 0){
                                BoxMessage.objeto.texto = messageBox.querySelector('.boxInput').querySelector('textarea').value
                                BoxMessage.Close(BoxMessage.objeto.accept.function)
                            }else{
                                messageBox.querySelector('.boxInput').querySelector('textarea').classList.add('error')
                            }
                        })
                    }else if(!!objeto.accept.function){
                        messageBox.querySelector('.boxButtons').querySelector('.accept').addEventListener('click',()=>{
                            BoxMessage.Close(BoxMessage.objeto.accept.function)
                        })
                    }
                }else{
                    messageBox.classList.add('unit')
                    messageBox.querySelector('.boxButtons').querySelector('.cancel').innerText = 'Ok'
                    messageBox.querySelector('.boxButtons').querySelector('.accept').remove()
                }
    
                if(!!objeto.cancel){
    
                }else{
                    messageBox.querySelector('.boxButtons').querySelector('.cancel').addEventListener('click',()=> BoxMessage.Close())
                }
                

                window.addEventListener('mouseup',(e)=>{
                    if(e.target == bgMessageBox && !bgMessageBox.classList.value.includes('hidden')){BoxMessage.Close()}
                });
            })
        },
        Close: function (fn){
            try{if (fn !== undefined){setTimeout(function() { fn(BoxMessage); }, 0);}}
            finally{ BoxMessage.bgMessageBox.remove(); }
            
            document.querySelector('body').classList.value.includes('show_messageBox')
            ? document.querySelector('body').classList.remove('show_messageBox') 
            : document.querySelector('body').classList.remove('noScrool')
        }
    }

    return BoxMessage
}
