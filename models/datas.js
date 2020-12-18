var mongoose = require('mongoose');

var SchemaDatas = mongoose.Schema;
var ModelDatas = new SchemaDatas({
  idModel: {
    type: SchemaDatas.Types.ObjectId,
    ref: 'Models'
  },
  rows: [{
    id: SchemaDatas.Types.ObjectId,
    data: [{
      value: String,
      field: {
        type: SchemaDatas.Types.ObjectId,
        ref: 'Fields'
      }
    }]
  }]
}, {
  usePushEach: true
});

module.exports = mongoose.model('Datas', ModelDatas);