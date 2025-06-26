require('../services/mongodb')

hdwMdl = require('./hdw-mdl')
pcosMdl = require('./pcos-mdl')
pcoGrpMdl = require('./pco-grp-mdl')

// ----------------------------
async function asyncCreate() {

    data = {
        title: 'Pike',
        description: 'Pike Model PCO control',
        pcogrp_id: 0,
    }      

    data.pcos = [
        {
            title: 'Fwd  (24C)  .101',
            ip: '130.46.84.101',
            lbl: [
              '-',
              'HPhone Pwr Strip',
              'OPTO22 (PWR)',
              'S-40 (2A & 2T)',
              '-',
              '-',
              'Speaker Crown',
              'Speaker V & I'
            ],
            onDelay: [
              -1, -1,  0, -1,
              -1, -1, -1, -1
            ],
            offDelay: [
              0, 0, 0, 0,
              0, 0, 0, 0
            ],
            reboot: [
              5, 5, 5, 5,
              5, 5, 5, 5
            ],
            occlude: [
              false, false,
              false, false,
              false, false,
              false, false
            ],
          },
          {
            title: 'Fwd   (20A)  .22',
            ip: '130.46.84.22',
            lbl: [
              'OPTO22 fwd Bunk',
              'Laser',
              'Bunk 2 Air',
              'Bunk 3 Air',
              '-',
              '-',
              '-',
              '-'
            ],
            offDelay: [
              0, 0, 0, 0,
              0, 0, 0, 0
            ],
            reboot: [
              5, 5, 5, 5,
              5, 5, 5, 5
            ],
            occlude: [
              false, false,
              false, false,
              false, false,
              false, false
            ],
          }
    ]
      
    data.upss = [  {
        lbl: 'Port', 
        ip: '130.46.1.1'
      },{
        lbl: 'Port', 
        ip: '130.46.1.1'
      } 
    ]

    rtn = await hdwMdl.create(data)
    console.log(rtn)
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

//asyncCreate()
asyncUpdate()

console.log('done') 

