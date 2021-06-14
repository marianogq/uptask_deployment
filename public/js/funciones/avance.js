import Swal from "sweetalert2";

export const actualizarAvance = ()=>{
    // Seleccionar las Tareas Existentes
    const tareas=document.querySelectorAll('li.tarea');
    if(tareas.length){
        // Seleccionar las Tareas Completadas
        const tareasCompletas=document.querySelectorAll('i.completo');
        // Calcular el Avance
        const avance=Math.round((tareasCompletas.length/tareas.length)*100);
        // Mostrar el Avance
        const porcentaje=document.querySelector('#porcentaje');
        porcentaje.style.width=avance+'%';
        if(avance===100){
            Swal.fire(
                'Completante el Proyecto',
                'Felicitaciones, has terminado tus Tareas',
                'success'
            )
        }
    }
}