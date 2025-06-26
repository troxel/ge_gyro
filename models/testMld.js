require('../services/mongodb')

mdl = require('./pcos-mdl')
console.log(mdl)

async function insert(data) {

    // try {
    let item = await mdl.create(data);
    //   if (item)
    //     return {
    //       error: false,
    //       item
    //     };
    // } catch (error) {
    //   return {
    //     error: true,
    //     message: error._message || "Not able to create item",
    //     errors: error.errors
    //   }
    // }
}

// -------------------------------------------------
const data={title:"Bow 3",ip:"130.46.1.5",lbl:['1','2'],onDelay:[1,2,3]}
insert(data).then( (items)=>{
    console.log("------ items ----")
    console.log(items)
    console.log("------ items ----")
},(err)=>{console.log("ERROR");console.log(err)})


mdl.find().exec().then( (doc) => {console.log(doc) })
console.log('done') 

