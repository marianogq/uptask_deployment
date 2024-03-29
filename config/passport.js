const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Referencia al Modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// Local Strategy - Login con credenciales propias (usuario y passw)
passport.use(
    new LocalStrategy(
        // Por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done)=>{
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                // El Usuario existe, password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })
                }
                // El email existe y el password es correcto
                return done(null,usuario);
            } catch (error) {
                // ese usuario no existe
                return done(null, false, {
                    message: 'Esa Cuenta no Existe'
                })
            }
        }
    )
);

// serializar el usuario
passport.serializeUser((usuario, callback)=>{
    callback(null, usuario);
});
passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario);
});

// exportar
module.exports = passport;
