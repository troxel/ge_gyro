require('../services/mongodb')

mongoose = require('mongoose')

mdl = require('./pco-grp-mdl')
console.log(mdl)

async function insert(data) {

    // try {
        await mdl.deleteMany({});
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
const data={title:"Pike",description:"Pike Model PCO control",_id: new mongoose.Types.ObjectId("64c87d1d149efbd7379afc9f"),pcogrp_id:0}
insert(data).then( (items)=>{
    console.log("------ items ----")
    console.log(items)
    console.log("------ items ----")
},(err)=>{console.log("ERROR");console.log(err)})


mdl.find().then( (doc) => {console.log(doc) })
console.log('done') 

