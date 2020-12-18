var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost:27017/entidades', {
  useNewUrlParser: true
});

mongoose.connection.on('error', function (err) {
  console.log(err);
});

mongoose.connection.on('open', function () {
  console.log('connected');
});

//Create a SomeModel model just by requiring the module
var models = require('../models/models.js');
var fields = require('../models/fields.js');
var datas = require('../models/datas.js');
var modelsArray = {};

// Use the SomeModel object (model) to find all SomeModel records
//SomeModel.find(callback_function);

// function builModelSchema(_model, fn) {
//   var objectSchema = {};
//   if (_model.fields) {
//     for (var i = 0; i < _model.fields.length; i++) {
//       objectSchema[_model.fields[i].name] = _model.fields[i].type;
//     }
//   }
//   console.log('objectSchema', objectSchema);
//   var Schema = mongoose.Schema,
//     ModelSchema, Model;
//   ModelSchema = new Schema;
//   ModelSchema.add(objectSchema);
//   if (modelsArray[_model.name]) {
//     console.log('Registrado!', _model.name);
//     Model = mongoose.model(_model.name);
//   } else {
//     console.log('Registrando..', _model.name);
//     Model = mongoose.model(_model.name, ModelSchema);
//   }
//   fn(Model);
// }

var router = express.Router();

/* GET all model. */
router.get('/api/allModels', function (req, res, next) {
  models.find()
    .populate('fields')
    .exec(function (err, response) {
      console.log(response);
      // for (var i = 0; i < response.length; i++) {
      //   builModelSchema(response[i], function (model) {
      //     modelsArray[response[i].name] = model;
      //   });
      // }
      res.json(response);
    })
  // .select('-fields.data');
});

/* POST new model. */
router.post('/api/newmodel', function (req, res, next) {
  console.log(req.body);
  /*var content = "var mongoose = require('mongoose');\r\n\n" +
    "var Schema = mongoose.Schema;\r\n" +
    "var SomeModelSchema = new Schema(Schema.Types.Mixed, {strict: false});\r\n" +
    "module.exports = mongoose.model('" + req.body.name + "', SomeModelSchema );";*/

  models.create({
    idAcount: req.body.idAcount,
    name: req.body.name,
    x: req.body.x,
    y: req.body.y
  }, function (err, model) {
    console.log(err, model);
    if (err) {
      console.log(err);
    } else {
      // saved!
      console.log('Saved!');
      res.json({
        data: req.body.name
      });
    }
    /*fs.writeFile('./models/' + req.body.name + '.js', content, function(err) {
      if (err) throw err;
      console.log('Saved!');
      res.json({
        data: req.body.name
      });
    });*/
  });
});

/* POST update model. */
router.post('/api/updatePositionModel', function (req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log(req.body);
  models.findOne({
    _id: mongoose.Types.ObjectId(req.body.id)
  }, function (err, model) {
    // console.log(model);
    model.set({
      x: req.body.x,
      y: req.body.y
    });
    model.save(function (err, updatedModel) {
      console.log(err, updatedModel);
      if (err) {
        console.log(err);
      } else {
        res.json({
          respon: 'Modelo actualizado exitosamente!.'
        });
      }
    });
  });
});

/* POST update model. */
router.post('/api/updateModel', function (req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log(req.body);
  models.findOne({
    _id: mongoose.Types.ObjectId(req.body.id)
  }, function (err, model) {
    // console.log(model);
    model.set({
      name: req.body.name
    });
    model.save(function (err, updatedModel) {
      console.log(err, updatedModel);
      if (err) {
        console.log(err);
      } else {
        res.json({
          respon: 'Modelo actualizado exitosamente!.'
        });
      }
    });
  });
});

/* DELETE delete model. */
router.delete('/api/deleteModel/:model', function (req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log(req.params);
  console.log(req.query);
  Bear.remove({
    _id: req.params.bear_id
  }, function (err, bear) {
    if (err)
      res.send(err);

    res.json({
      message: 'Successfully deleted'
    });
  });
  res.json({
    respon: 'Modelo eliminado'
  });
});

/* POST new field. */
router.post('/api/newField', function (req, res, next) {
  console.log(req.body);
  var fieldParam = JSON.parse(req.body.field);
  fields.create({
    name: fieldParam.name,
    type: fieldParam.type,
    idModel: mongoose.Types.ObjectId(req.body.idModel)
  }, function (err, field) {
    console.log(err, field);
    if (err) {
      console.log(err);
    } else {
      // saved!
      console.log('Saved!');
      models.findOne({
        _id: mongoose.Types.ObjectId(req.body.idModel)
      }, function (err, model) {
        // console.log(model);
        model.fields.push(mongoose.Types.ObjectId(field._id));
        model.set({
          fields: model.fields,
        });
        model.save(function (err, updatedModel) {
          console.log(err, updatedModel);
          if (err) {
            console.log(err);
          } else {
            res.json({
              respon: 'Modelo actualizado exitosamente!.'
            });
          }

        });
      });
    }

  });

});

/* POST updata field. */
router.post('/api/updateField', function (req, res, next) {
  console.log(req.body);
  var fieldParam = JSON.parse(req.body.field);
  fields.findOne({
    '_id': mongoose.Types.ObjectId(fieldParam._id)
  }, function (err, field) {
    console.log(field);
    field.set({
      name: fieldParam.name,
      type: fieldParam.type
    });
    field.save(function (err, updatedModel) {
      console.log(err, updatedModel);
      if (err) {
        console.log(err);
      } else {
        res.json({
          respon: 'Campo actualizado exitosamente.'
        });
      }

    });
  });
});

/* GET all data model. */
router.get('/api/allDataModels/:model', function (req, res, next) {
  console.log('allDataModels', req.params);
  datas.findOne({
      idModel: mongoose.Types.ObjectId(req.params.model)
    })
    // .populate('data.fields')
    .exec(function (err, response) {
      console.log(response);
      // for (var i = 0; i < response.length; i++) {
      //   builModelSchema(response[i], function (model) {
      //     modelsArray[response[i].name] = model;
      //   });
      // }
      res.json(response);
    })
  // models.findOne({
  //     _id: mongoose.Types.ObjectId(req.params.model)
  //   }, function (err, model) {
  //     console.log(model);
  //     res.json(model);
  //   })
  //   .select('-x -y');
});

/* POST  add new data model. */
router.post('/api/addDataModels', function (req, res, next) {
  console.log(req.body);
  var fieldsParam = JSON.parse(req.body.fields);
  var arrayData = {
    data:[]
  };
  for (var i = 0; i < fieldsParam.length; i++) {
    arrayData.data.push({
      value: fieldsParam[i].value,
      field: mongoose.Types.ObjectId(fieldsParam[i].id)
    });
  }
  datas.findOne({
    'idModel': mongoose.Types.ObjectId(req.body.idModel)
  }, function (err, data) {
    console.log(err, data);
    if (!data) {
      datas.create({
        idModel: mongoose.Types.ObjectId(req.body.idModel),
        rows: [arrayData]
      }, function (err, data) {
        console.log(err, data);
        if (err) {
          console.log(err);
        } else {
          // saved!
          console.log('Saved!');
          res.json({
            respon: 'Datos guardados exitosamente!.'
          });
        }

      });
    } else {
      data.rows.push(arrayData);
      data.set({
        rows: data.rows
      });
      data.save(function (err, updatedModel) {
        console.log(err, updatedModel);
        if (err) {
          console.log(err);
        } else {
          res.json({
            respon: 'datos agregados exitosamente.'
          });
        }

      });
    }

  });
});

module.exports = router;