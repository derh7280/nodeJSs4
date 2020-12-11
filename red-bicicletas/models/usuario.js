var mongoose = require("mongoose");
// var uniqueValidator = require("mongoose-unique-validator");
var Reserva = require("./reserva");
// var bcrypt = require('bcrypt');

const saltRounds = 10;

var Schema = mongoose.Schema;

//nombre usuario + @ + servidor + dominio
const validateEmail=function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/;
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
        // unique: true,
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
    }

});

// usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario' });

//antes de guardar/save
usuarioSchema.pre('save', function(next){
    if (this.isModified('password')){
        // this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password) {
    // return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    console.log(reserva);
    reserva.save(cb);
}

module.exports = mongoose.model("Usuario", usuarioSchema); 