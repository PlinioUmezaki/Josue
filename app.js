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

router.route('/').get(function(req, res) {
  var path = '/views/index.html';
  res.header('Cache-Control', 'no-cache');
  res.sendFile(path, {"root": "./"});
});

router.route('/debts')
  .get(function(req, res) {
    var response = {};
    debtModel.find({}, function(error, data) {
      if (error) {
        response = {"result": "Database Access Fail"};
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
    debtDb.descricao = req.body.descicao;
    debtDb.valor = req.body.valor;
    debtDb.devedorId = req.body.devedorId;
    debtDb.credorId = req.body.credorId;
    debtDb.save(function(error) {
      if (error) {
        response = {"result": "Debt insertion fail"};
        res.json(response);
      } else {
        response = {"result": "Debt inserted"};
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
        response = {"result": "Database Access Fail"};
        res.json(response);
      } else if (data == null) {
        response = {"result": "Debt Not Exists"};
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
        response = {"result": "Database Access Fail"};
        res.json(response);
      } else if (data == null) {
        response = {"result": "Debt Not Exists"};
        res.json(response);
      } else {
        response = {"resultado": "Debt Updated"};
        res.json(response);
      }
    })
  })

  .delete(function(req, res) {
    var response = {};
    var query = {"id": req.params.id};
    debtModel.findOneAndRemove(query, function(error, data) {
      if (error) {
        response = {"result": "Database Access Fail"};
        res.json(response);
      } else if (data == null) {
        response = {"result": "Debt Not Exists"};
        res.json(response);
      } else {
        response = {"result": "Debt Removed"};
        res.json(response);
      }
    })
  });
