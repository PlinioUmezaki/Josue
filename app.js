var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var debtModel = require('./models/debtModel');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;

function checkAuth(req, res) {
  cookies = req.cookies;
  var key = '';
  if(cookies) key = cookies.EA975;
  if(key == 'secret') return true;
  res.json({'resultado': 'Clique em LOGIN para continuar'});
  return false;
}

router.route('/').get(function(req, res) {
  var path = '/views/index.html';
  res.header('Cache-Control', 'no-cache');
  res.sendFile(path, {"root": "./"});
});

router.route('/debts')
  .get(function(req, res) {
    if (!checkAuth(req, res)) {
      return;
    }
    var response = {};
    debtModel.find({}, function(error, data) {
      if (error) {
        response = {"result": "Falha de acesso ao banco de dados"};
      } else {
        response = {"debts": data};
        res.json(response);
      }
    })
  })
  .post(function(req, res) {
    console.log(JSON.stringify(req.body));
    var response = {};
    var debtDb = new debtModel();
    debtDb.descricao = req.body.descricao;
    debtDb.valor = req.body.valor;
    debtDb.devedorId = req.body.devedorId;
    debtDb.credorId = req.body.credorId;
    debtDb.save(function(error) {
      if (error) {
        response = {"result": "Falha de inserção de dívida"};
        res.json(response);
      } else {
        response = {"result": "Dívida inserida"};
        res.json(response);
      }
    })
  });

router.route('/debts/:id')
  .get(function(req, res) {
    var response = {};
    var query = {"id": req.params.id};
    debtModel.findOne(query, function(error, data) {
      if (error) {
        response = {"result": "Falha de acesso ao banco de dados"};
        res.json(response);
      } else if (data == null) {
        response = {"result": "Dívida não existe"};
        res.json(response);
      } else {
        response = {"debts": [data]};
        res.json(response);
      }
    })
  })

  .put(function(req, res) {
    var response = {};
    var query = {"id": req.params.id};
    var data = {
      "descricao": req.body.descricao,
      "valor": req.body.valor,
      "devedorId": req.body.devedorId,
      "credorId": req.body.credorId
    };
    debtModel.findOneAndUpdate(query, data, function(error, data) {
      if (error) {
        response = {"result": "Falha ao acesso ao banco de dados"};
        res.json(response);
      } else if (data == null) {
        response = {"result": "Dívida não existe"};
        res.json(response);
      } else {
        response = {"resultado": "Dívida atualizada"};
        res.json(response);
      }
    })
  })

  .delete(function(req, res) {
    var response = {};
    var query = {"id": req.params.id};
    console.log(query);
    debtModel.findOneAndRemove(query, function(error, data) {
      if (error) {
        response = {"result": "Falha de acesso ao banco de dados"};
        res.json(response);
      } else if (data == null) {
        response = {"result": "Dívida não existe"};
        res.json(response);
      } else {
        response = {"result": "Dívida removida"};
        res.json(response);
      }
    })
  });

  router.route('/authentication')
    .get(function(req, res) {
      var path = '/views/auth.html';
      res.header('Cache-Control', 'no-cache');
      res.sendFile(path, {"root": "./"});
    })
    
    .post(function(req, res) {
      console.log(JSON.stringify(req.body));
      var user = req.body.user;
      var pass = req.body.pass;
      if (user == 'plinio' && pass == 'umezaki') {
        res.cookie('EA975', 'secret', {'maxAge': 3600000*24*5});
        res.status(200).send('');
      } else {
        res.status(401).send('');
      }
    })

    .delete(function(req, res) {
      res.clearCookie('EA975');
      res.json({'resultado': 'Sucesso'});
    });
