const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');
const Op = Sequelize.Op

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son Obligatorios'
});

// Comtrol si el Usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next)=>{
    // Si esta logueado, adelante
    if(req.isAuthenticated()){
        return next();
    }
    // Si No esta logueado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// Cerrar Sesion
exports.cerrarSesion = (req,res)=>{
    req.session.destroy(()=>{
        // Al cerrar sesion lleva a iniciar sesion
        res.redirect('/iniciar-sesion');
    })
}

// Genera un Token si el usuario es valido
exports.enviarToken = async (req,res)=>{
    // Verificar que el usuario exista
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: { email }});
    // Si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('reestablecer');
    }
    // Usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now()+3600000;
    // Guardarlos en la base de datos
    await usuario.save();
    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    // Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });
    // terminar
    req.flash('correcto', 'Se envio un mensaje a tu correo!');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res)=>{
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    // Si no encuentra el usuario
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }
    // Formulario para generar el password
    res.render('resetPassword',{
        nombrePagina: 'Reestablecer Contraseña'
    })
}

// Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res)=>{
    // Verifica el token y la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
    // Verifica si el usuario existe
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }
    // hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    // Guardar el nuevo password
    await usuario.save();
    req.flash('correcto', 'Tu password se ha modificado correctamente!')
    res.redirect('/iniciar-sesion');
}