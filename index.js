const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// helpers con algunas funciones
const helpers = require('./helpers');
// Extraer valores de variales.env
require('dotenv').config({path: 'variables.env'})


// Crear la conexion a la BD
const db = require('./config/db');
const { nextTick } = require('process');
// db.authenticate()
//     .then(()=>console.log('Conexion al servidor'))
//     .catch(error=>console.log(error));

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
db.sync()
    .then(()=>console.log('Conexion al servidor'))
    .catch(error=>console.log(error));

// Crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar pug
app.set('view engine', 'pug');

// Habilitar bodyPerser para leer los datos del formulario
app.use(express.urlencoded({extended:true}));

// Añadir carpeta de las Vistas
app.set('views', path.join(__dirname, './views'));

// Agregar flash messages
app.use(flash());

app.use(cookieParser());
// sessiones permite navegar entre paginas sin volver a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar dump a la aplicacion
app.use((req, res, next)=>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());

// Servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, ()=>{
    console.log('El Servidor está funcionando!')
});
//app.listen(3000);

