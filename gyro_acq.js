const Gyro = require('./ge-iru-gyro/ge-iru-gyro')
const config = require('./config')
const dbGyro = require('./dbgyro')

var Verbose = 1
var State = {}

async function gyroStart() {

    const PORT = 4001;
    const HOST = '130.46.82.174'
    const gyro = new Gyro(HOST,PORT,{verbose:Verbose})
   
    await gyro.connect()

    const dbc = new dbGyro()
    await dbc.connect(config.db)
    
    var cnt = 0
    var intvalID = setInterval( async ()=>{
        try {

            // gyrocompass status
            const rtn0F = await gyro.get_0F()
            //console.log(rtn0F)

            // IRU mode and BMC status 
            const rtn2C = await gyro.get_2C()
            //console.log(rtn2C)

            State = { ...State, ...rtn0F, ...rtn2C } 

            if ( rtn2C['iru_mode'] == 6 ) {

                // heading and attitude 
                rtn62 = await gyro.get_62()
                await dbc.set_rpy(rtn62)
                
                //console.log(rtn62)
                State = {...State, ...rtn62}
            }

            //console.log("-----\n",State)
            await dbc.update_state(State)

            // Look for and act on commands if present.      
            const fs = require('fs');

            if (fs.existsSync('./gyro_cmd')) {
                let gyroCmdContent = fs.readFileSync('gyro_cmd', 'utf8').trim();

                if (gyroCmdContent === 'gyrocompass') {
                    gyro.set_5D(3);   // monitor with 0F
                    console.log("Sent gyrocompass command");
                } else if (gyroCmdContent === 'gyrocompassBMC') {
                    gyro.set_5D(9);   // monitor with 2C
                    console.log("Sent gyrocompass command");
                } else if (gyroCmdContent === 'reset') {
                    gyro.set_01();
                    console.log("Sent gyrocompass reset");
                }

                fs.unlinkSync('gyro_cmd');
            }

        } catch (err) {
            console.error('There was an error:', err);
        }

        cnt++
        //console.log('cnt =',cnt)
        if (cnt > 40) {
            console.log('clearing interval')
            clearInterval(intvalID)
            gyro.end();
        }

    },3000)
}


gyroStart()
console.log('done')








