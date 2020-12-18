var mongoose = require('mongoose');

var SchemaModels = mongoose.Schema;
var ModelModels = new SchemaModels({
  idAcount: String,
  name: String,
  x: String,
  y: String,
  fields: [{
    type: SchemaModels.Types.ObjectId,
    ref: 'Fields'
  }]
}, {
  usePushEach: true
});

module.exports = mongoose.model('Models', ModelModels);