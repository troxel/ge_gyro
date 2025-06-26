//***************************************************************************************
//***************************************************************************************
mongoose = require("mongoose")

console.log('trying to connect mongodb')  
mongoose.connect('mongodb://127.0.0.1:27017/pco')
console.log('connected to mongodb')

function inc(){
  let inc1 = 1
  var inc2 =1
  return [inc1++,inc2++]
}

[inc1,inc2] = inc()

exports.inc1 = inc1
exports.inc2 = inc2