const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

// create reusable transporter object using the default SMTP transport
let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

// Generar html
const generarHTML = (archivo, opciones={})=>{
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}

// send mail with defined transport object
exports.enviar = async (opciones)=>{
    const html = generarHTML(opciones.archivo, opciones); // html body
    const text = htmlToText.fromString(html); // plain text body
    //let opcionesEmail = await transporter.sendMail({
    let opcionesEmail = {
        from: 'UpTask <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text,
        html
    };
    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail)
}