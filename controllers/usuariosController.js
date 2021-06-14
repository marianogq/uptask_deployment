const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req,res)=>{
    res.render('crearCuenta',{
        nombrePagina: 'Crear Cuenta en UpTask'
    })
}

exports.formIniciarSesion = (req,res)=>{
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina: 'Iniciar Sesion en UpTask',
        error
    })
}

exports.crearCuenta = async (req, res)=>{
    //console.log('entra a crearCuenta');
    //Leer los datos
    const {email, password}= req.body;
    try {
        //console.log('entra al try');
        // crear usuario
        await Usuarios.create({
            email,
            password
        });
        // Crear una url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        // Crear el objeto de usuario
        const usuario = {
            email
        }
        // enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu Cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });
        // Redirigir al usuario
        req.flash('correcto', 'Te enviamos un correo, confirma tu cuenta!');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        })
    }

}

exports.formRestablecerPassword = (req, res)=>{
    res.render('reestablecer',{
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

// Cambiar el estado de una Cuenta
exports.confirmarCuenta = async (req, res)=>{
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });
    // Si no existe el usuario
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/crear-cuenta');
    }
    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto', 'Cuenta activada correctamente!');
    res.redirect('/iniciar-sesion');
}