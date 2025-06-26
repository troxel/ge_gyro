require('../services/mongodb')

pcoMdl = require('./pcos-mdl')

// ----------------------------
async function asyncCreate() {

    data = {
        title: 'Pike Model',
        description: 'Pike Model PCO control',
    }      

    rtn = await cntMdl.findOneAndUpdate({id:'pcogrp'},{$inc:{seq:1}},{new:true,upsert: true})
    console.log(rtn)
    console.log(rtn.seq)
    data.pcogrp_id = rtn.seq
 
    try {
      rtn = await hdwMdl.create(data)
      console.log("success\n",rtn)
     }
     catch(err) {
       console.log('err\n',err)
     }

}

// ----------------------------
async function asyncUpdate() {
    // super arcane command for doing something really simple. 
     rst = await hdwMdl.updateOne({pcogrp_id:0},{$set: {'pcos.$[el].reboot': [1,2,3,4,5,6,8]}},{arrayFilters: [{'pcos.$el':'reboot'}], new:true})
     console.log(rst)

    // doc = await hdwMdl.findOne({pcogrp_id:0})
    // console.log(doc.pcos[1])

    // newpco = {
    //     lbl: [
    //       'OPTO22 fwd Bunk',
    //       'Laser',
    //       'Bunk 2 Air',
    //       'Bunk 3 Air',
    //       '-',
    //       '-',
    //       '-',
    //       '-'
    //     ],
    //     ip: '130.46.84.22',
    //     onDelay: [],
    //     offDelay: [
    //       0, 0, 0, 0,
    //       0, 0, 0, 0
    //     ],
    //     reboot: [
    //       1, 5, 3, 5,
    //       5, 5, 5, 5
    //     ],
    //     occlude: [
    //       false, false,
    //       false, false,
    //       false, false,
    //       false, true
    //     ]
    //   }
    
    //   console.log(doc.pcos[1]._id)
    //   doc.pcos[1] =  newpco
    //   rtn = await doc.save()
    //   console.log(rtn.pcos[1]._id)


}

asyncCreate()
//asyncUpdate()

console.log('done') 

