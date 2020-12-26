require('dotenv').config();//libreria para trabajar con variables de ambiente
require('newrelic');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./config/passport');
var session = require('express-session');
const jwt = require('jsonwebtoken');

// models
const Usuario = require('./models/usuario_model');
const Token = require('./models/token');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bicicletasRouter = require('./routes/bicicletas');
var bicicletasAPIRouter = require('./API/routes/bicicletas');
var usuariosAPIRouter = require('./API/routes/usuarios');
var usuariosRouter = require('./routes/usuarios');
var tokenRouter = require('./routes/token');
var authAPIRouter = require('./API/routes/auth');

//const store = new session.MemoryStore;
const MongoDBStore = require('connect-mongodb-session')(session);

// Session (desarrollo) / en bd (prod)
let store;

if (process.env.NODE_ENV === 'development') {
  store = new session.MemoryStore();
}else {
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });

  store.on('error', function (err) {
    assert.ifError(err);
    assert.ok(false);
  });
}


var app = express();

// app.set('secretKey', 'jwt_pwd_!!223344');
app.set('secretKey', 'jwt_pwd_API!75388+');

app.use(session({
  cookie: {maxAge: 240 * 60 * 60 * 1000},
  store: store,
  saveUninitialized: true,
  resave: true,
  secret: 'dukington_n0d0_20!20.*!kingston+down'
})); 

// var mongoDB = require('./ConfigMongoDB');
var mongoose = require('mongoose');
// var mongoDB = 'mongodb://localhost:27017/red-bicicletas-derh';
// var mongoDB = 'mongodb+srv://admin:sOJnXka8QbXlANyJ@cluster0.px3vo.mongodb.net/test'; //contra mongo comp
// var mongoDB = 'mongodb+srv://admin:sOJnXka8QbXlANyJ@cluster0.px3vo.mongodb.net/<dbname>?retryWrites=true&w=majority';//contra la app
var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB error de conexión:'));
db.once('open', function() {
   console.log('Conectado a MongoDB');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/bicicletas', bicicletasRouter);
app.use('/bicicletas',loggedIn, bicicletasRouter);
// app.use('/api/bicicletas', bicicletasAPIRouter);
app.use('/api/bicicletas', validarUsuario, bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);
app.use('/api/auth', authAPIRouter);

app.use('/privacy_policy', function(req, res){
  res.sendFile('public/privacy_policy.html');
});

app.use('/google89971a2f4629312d', function(req, res){
  res.sendFile('public/google89971a2f4629312d.html');
});

app.get('/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      //'https://www.googleapis.com/auth/plus.profile.emails.read',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ] 
  })
);

app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/error'
  })
);

app.get(
  "/auth/facebook",
  passport.authenticate("google", {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

//Rutas manejadas desde app.js
app.get('/login', (req, res)=>{
  res.render('login/login');
});

app.post('/login', (req, res, next)=> {
  //Metodo de Passport
  passport.authenticate('local', function(err, usuario, info){
    //Se inicia si hay errores
    if(err) return next(err);
    //Se inicia si hay errores
    if(!usuario) return res.render('login/login', {info});
    req.logIn(usuario, function(err){
      if(err) return next(err);
      //Si todo esta bien retorna a la pagina principal
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logOut();//Limpia la sesion
  res.redirect('/');
});


app.get('/forgotPassword', function(req, res){
  res.render('login/forgotPassword');
});

app.post('/forgotPassword', function (req, res, next) {
  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    if (!usuario) {
      return res.render('login/forgotPassword', {
        info: { message: 'No existe un usuario con el email ingresado' } 
      });
    }

    usuario.resetPassword(function (err) {
      if (err) {
        return next(err);
        console.log('login/forgotPasswordMsn');
      }
    });

    res.render('login/forgotPasswordMsn');
  });
});

app.get('/resetPassword/:token', function(req, res, next){
  Token.findOne({token: req.params.token}, function(err, token){
    if(!token) return res.status(400).send({type: 'not-verified', msg: 'No existe un usuario asociado al token. Verifique que su token no haya expirado'})

    Usuario.findById(token._userId, function(err, usuario){
      if(!usuario) return res.status(400).send({msg: 'No existe un usuario asociado al token'});
      res.render('login/resetPassword', {errors: {}, usuario: usuario})
    })
  })
})

app.post('/resetPassword', function(req, res){
  if(req.body.password != req.body.confirm_password) {
    res.render('login/resetPassword', {errors: {confirm_password: {message: 'No coinciden las contraseñas'}}});
    return;
  }
  Usuario.findOne({'email': req.body.email}, function(err, usuario){
    usuario.password = req.body.password;
    usuario.save(err=>{
      if(err){
        res.render('login/resetPassword', {errors: err.errors, usuario: new Usuario});
      } else {
        res.redirect('/login')
      }
    })
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next){
	if(req.user){
		next();
	}else{
		console.log('Usuario sin loguearse');
		res.redirect('/login');
	}
};

function validarUsuario(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    if (err) {
      res.json({ status: 'error', message: err.message, data: null });
    } else {
      req.body.userId = decoded.id;
      console.log('JWT Verify: ' + decoded);

      next();
    }
  });
}

module.exports = app;
