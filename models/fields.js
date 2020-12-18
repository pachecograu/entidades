var mongoose = require('mongoose');

var SchemaFields = mongoose.Schema;
var ModelFields = new SchemaFields({
  name: String,
  type: String,
  idModel: {
    type: SchemaFields.Types.ObjectId,
    ref: 'Models'
  }
}, {
  usePushEach: true
});

module.exports = mongoose.model('Fields', ModelFields);