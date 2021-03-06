var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Reserva = require('./reserva');
const bcrypt = require('bcrypt');
const crypto = require('crypto');//no requiere instalacion
const saltRounds = 10;
const Token = require('../models/token');
const mailer = require('../mailer/mailer');

var Schema = mongoose.Schema;

//nombre usuario + @ + servidor + dominio
const validateEmail=function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
    // if (re.test(email))
    // {
    //     alert("La dirección de email " + valor + " es correcta.");
    // } else 
    // {
    //     alert("La dirección de email es incorrecta.");
    // }
};

var usuarioSchema = new Schema({
    nombre:{
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required:   [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'La dirección de email es incorrecta'],
        match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password:{
        type:String,
        trim: true,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado:{
        type: Boolean,
        default: false
    },
    googleId: String,
    facebookId: String

});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario' });

//antes de guardar/save
usuarioSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb) {
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    console.log(reserva);
    reserva.save(cb);
}

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if (err) {return console.log(err.message);}
        
        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificación de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar tú cuenta haga clic en este link: \n' + 'http://localhost:5000' + '\/token/confirmation\/' + token.token 
        };

        mailer.sendMail(mailOptions, function(err, result) {
            if (err) {return console.log(err);}

            console.log('Se ha enviado un email de bienvenida a:  ' + email_destination + '.');
        });

    });
}

usuarioSchema.methods.resetPassword = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if (err) {return cb(err);}
        
        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de Password',
            text: 'Hola,\n\n' + 'Por favor, para resetear el password de tú cuenta haga clic en este link: \n' + '<a href="http://localhost:5000' + '\/resetPassword\/' + token.token +'">Reset password</a>'
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) {return cb(err);}

            console.log('Se ha enviado un email para resetear el password a:  ' + email_destination + '.');
        });

        cb(null);

    });
}

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, callback) {
    const self = this;
    console.log(condition);
    this.findOne({
        $or: [
            { 'googleId': condition.id },
            { 'email': condition.emails[0].value }
        ]
    }, 
    (err, result) => {
        if (result) {//login
            callback(err, result);
        } else {//registro
            console.log('=============== CONDITION ===============');
            console.log(condition);
            let values = {};
            values.googleId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || 'SIN NOMBRE';
            values.verificado = true;
            //values.password = condition._json.etag;
            values.password = crypto.randomBytes(16).toString('hex');

            console.log('=============== VALUES ===============');
            console.log(values);
            self.create(values, function (err, user) {
                if (err) {
                    console.log(err);
                }

                return callback(err, user);
            });
        }
    });
}

usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(condition, callback) {
    const self = this;
    console.log(condition);

    this.findOne({
        $or: [
            { 'facebookId': condition.id },
            { 'email': condition.emails[0].value }
        ]
    }, 
    (err, result) => {
        if (result) {
            callback(err, result);
        } else {
            let values = {};
            console.log('=============== CONDITION ===============');
            console.log(condition);

            values.facebookId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || 'SIN NOMBRE';
            values.verificado = true;
            values.password = crypto.randomBytes(16).toString('hex');

            console.log('=============== VALUES ===============');
            console.log(values);

            self.create(values, function (err, user) {
                if (err) {
                    console.log(err);
                }

                return callback(err, user);
            });
        }
    });
}

module.exports = mongoose.model('Usuario', usuarioSchema);