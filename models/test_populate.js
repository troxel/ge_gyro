require('../services/mongodb')

mongoose = require('mongoose')

mdl_pcogrps = require('./pco-grp-mdl')
mdl_pcos = require('./pcos-mdl')


async function populate(data) {

    let rtn = await mdl_pcogrps.findOne({ _id: new mongoose.Types.ObjectId("64c87d1d149efbd7379afc9f")}).populate('pcos').exec()
    console.log(rtn)

    let rtnpcos = await mdl_pcos.find({ pcogrp_id: new mongoose.Types.ObjectId("64c87d1d149efbd7379afc9f")})
    console.log(rtnpcos)
}

// -------------------------------------------------
populate().then( (items)=>{
    console.log("------ items ----")
    console.log(items)
    console.log("------ items ----")
},(err)=>{console.log("ERROR");console.log(err)})
