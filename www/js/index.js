/** inicializacion */
const $ = el => document.querySelector(el);
const $click = (el,fun) =>{
    $(el).addEventListener('click',ev=>{
        fun(ev);
    });
}
const $dblclick = (el,fun) => {
    $(el).addEventListener('dblclick',ev=>{
        fun(ev);
    });
}
var level=0;
var t1=0;
var t2=0;
var Y = window.innerHeight;
var X = window.innerWidth;
var list = ["img/banner1.jpg","img/banner2.jpg","img/banner3.jpg","img/banner4.jpg","img/banner5.jpg","img/banner1.jpg","img/banner2.jpg","img/banner3.jpg","img/banner4.jpg","img/banner5.jpg"];
var paraInsertar = {
    tareas:[],
    titulo:'',
    imagen:''
};
var actualizar = false;
var indexTarea = 0;
var listado_tareas = [];
$('#app').style.height = Y+'px';
$('#btn-nuevo').style.marginTop = (Y-80)+'px';
$('#btn-nuevo').style.marginLeft = (X-80)+'px';
$('#btn-crear').style.marginTop = (Y-80)+'px';
$('#btn-crear').style.marginLeft = (X-80)+'px';
$('#lista-pendientes').style.height = (Y-260)+'px';
$('#foto-container').style.backgroundImage = "url('"+list[Math.floor(Math.random() * 8)]+"')";
if(localStorage.getItem('tareas')){
    listado_tareas = JSON.parse(localStorage.getItem('tareas'));
    llenarListaTareas();
}
/** funciones generales */
function toFront(pantalla){
    let pages = document.getElementsByClassName("page");
    for (let i=0;i<pages.length-1;i++){
        pages[i].style.display = 'none';
    }
    $(pantalla).style.display = 'block';
}
document.addEventListener("backbutton", e=>{
    e.preventDefault();
    if(level==0){
        navigator.app.exitApp();
    }
    else if(level==1){
        level=0;
        toFront('#menu');
    }
    else if(level==2){
        $('#foto').style.display = "none";
        level=1;
    }
}, false);
function llenarListaTareas(){
    $('#contenedor-listas').innerHTML = "";
    for(let i=0;i<listado_tareas.length;i++){
        let span = document.createElement('span');
        let div = document.createElement('div');
        span.innerText = listado_tareas[i].titulo;
        span.style.marginLeft = "10px";
        div.className += "tcontainer";
        div.append(span);
        div.addEventListener('touchstart',ev=>{
            ev.preventDefault();
            t1 = Date.now();
        });
        div.addEventListener('touchend',ev=>{
            ev.preventDefault();
            t2 = Date.now();
            if(((t2-t1)/1000) < 2){
                paraInsertar = listado_tareas[i];
                $('#foto-container').style.backgroundImage = (paraInsertar.imagen.length<1)?"url('"+list[Math.floor(Math.random() * 8)]+"')":"url('"+paraInsertar.imagen+"')";
                $('#in_titulo').value = paraInsertar.titulo;
                actualizar = true;
                indexTarea = i;
                $('#icon-listado').src = "img/updated.png";
                llenarListaAgregar();
                toFront('#listado');
                level++;
            }
            else{
                let r = confirm("¿Quieres borrar esta lista de tareas?");
                if (r == true) {
                    listado_tareas.splice(i, 1);
                    localStorage.setItem('tareas',JSON.stringify(listado_tareas));
                    llenarListaTareas();
                }
            }
        });
        $('#contenedor-listas').append(div);
    }
}
function llenarListaAgregar(){
    $('#lista-pendientes').innerHTML = "";
    for(let i=paraInsertar.tareas.length-1;i>=0;i--){
        let span = document.createElement('span');
        let div = document.createElement('div');
        let img = document.createElement('img');
        if(!paraInsertar.tareas[i].status){
            img.className += "inactive";
        }
        img.src = "img/checked.png";
        img.addEventListener('touchstart',ev=>{
            ev.preventDefault();
            t1 = Date.now();
        });
        img.addEventListener('touchend',ev=>{
            ev.preventDefault();
            t2 = Date.now();
            if(((t2-t1)/1000) < 2){
                if(img.className == 'inactive'){
                    img.className = "";
                    paraInsertar.tareas[i].status = true;
                }
                else{
                    img.className = "inactive";
                    paraInsertar.tareas[i].status = false;
                }
                return;
            }
            let tarea = prompt("Modificar tarea, deje en blanco para eliminar", paraInsertar.tareas[i].text);
            if(tarea.length > 0){
                paraInsertar.tareas[i].text = tarea;
                llenarListaAgregar();
            }
            else{
                paraInsertar.tareas.splice(i, 1);
                llenarListaAgregar();
            }
        });
        span.innerText = paraInsertar.tareas[i].text;
        div.className += "tcontainer";
        div.append(img);
        div.append(span);
        $('#lista-pendientes').append(div);
    }
}
function cameraTakePicture() { 
    navigator.camera.getPicture(onSuccess, onFail, {  
       quality: 50, 
       destinationType: Camera.DestinationType.DATA_URL 
    });  
    
    function onSuccess(imageData) { 
       paraInsertar.imagen = "data:image/jpeg;base64," + imageData;
       $('#foto-container').style.backgroundImage = "url('"+paraInsertar.imagen+"')";
    }  
    
    function onFail(message) { 
       alert('Failed because: ' + message); 
    } 
 }
$click('#btn-nuevo',e=>{
    e.preventDefault();
    actualizar = false;
    $('#icon-listado').src = "img/floppy-disk.png";
    $('#lista-pendientes').innerHTML = "";
    $('#in_titulo').value = "";
    paraInsertar.imagen = '';
    $('#foto-container').style.backgroundImage = "url('"+list[Math.floor(Math.random() * 8)]+"')";
    toFront('#listado');
    level++;
});
$click('#btn-nueva-foto',e=>{
    e.preventDefault();
    cameraTakePicture();
});
$click('#btn-agregar',e=>{
    e.preventDefault();
    if($('#in_tarea').value.length < 1){
        alert("no hay tarea ingresada");
        return;
    }
    let dt = {
        status:false,
        text:$('#in_tarea').value
    }
    paraInsertar.tareas.push(dt);
    $('#in_tarea').value = "";
    llenarListaAgregar();
});
$click('#btn-crear',e=>{
    e.preventDefault();
    paraInsertar.titulo = $('#in_titulo').value;
    if(paraInsertar.titulo.length < 3){
        alert("Agregue un titulo");
        return;
    }
    if(paraInsertar.tareas.length < 1){
        alert("Ingrese al menos una tarea");
        return;
    }
    if(actualizar){
        listado_tareas[indexTarea] = paraInsertar;
        localStorage.setItem('tareas',JSON.stringify(listado_tareas));
        llenarListaTareas();
        toFront('#menu');
        return;
    }
    $('#foto-container').style.backgroundImage = "url('"+list[Math.floor(Math.random() * 8)]+"')";
    $('#in_titulo').value = "";
    $('#lista-pendientes').innerHTML = "";
    listado_tareas.push(paraInsertar);
    localStorage.setItem('tareas',JSON.stringify(listado_tareas));
    llenarListaTareas();
    toFront('#menu');
});
$click('#btn-ver-foto',e=>{
    e.preventDefault();
    if(paraInsertar.imagen.length<1){
        alert("No has asignado ninguna imagen a esta lista de tareas");
    }
    else{
        $('#visor').src = paraInsertar.imagen;
        $('#foto').style.display = "grid";
        level++;
    }
});