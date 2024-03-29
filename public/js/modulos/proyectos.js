import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;
        
        Swal.fire({
            title: 'Deseas Borrar este Proyecto?',
            text: "Un Proyecto Eliminado No se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar',
            cancelButtonText: 'No, Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                // Enviar peticion a axios
                const url=`${location.origin}/proyectos/${urlProyecto}`;
                axios.delete(url, {params: {urlProyecto}})
                    .then(function(respuesta){
                        console.log(respuesta)
                        Swal.fire(
                            'Proyecto Eliminado!',
                            respuesta.data,
                            'success'
                        );
                        // Redireccionar al Inicio
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 3000);
                    })
                    .catch(()=>{
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo Eliminar el Proyecto'
                        })
                    })
                    return;
            }
          })
    })
}
export default btnEliminar;
