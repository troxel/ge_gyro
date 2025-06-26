const Gyro = require('./ge-iru-gyro/ge-iru-gyro')
const config = require('./config')
const dbGyro = require('./dbgyro')
var fs = require('fs')
const pidFile = '/tmp/ge_gyro_acq.pid';

// Check if PID file exists
if (fs.existsSync(pidFile)) {
    console.error(`PID file exists (${pidFile}). Another instance may be running.`);
    process.exit(1);
}

// Write the current process PID to the file
fs.writeFileSync(pidFile, process.pid.toString(), 'utf8');

// Ensure PID file is removed on exit
process.on('exit', () => {
    if (fs.existsSync(pidFile)) {
        fs.unlinkSync(pidFile);
    }
});

process.on('SIGINT', endit);
process.on('SIGTERM', endit);

var Verbose = false
var addNoise = false // true to add noise to heading, roll, and pitch test sectopm 

var LoopRate = 1000 
var State = {}

const gyro = new Gyro(config.ip.HOST,config.ip.PORT,{verbose:Verbose})

// ---- Gracefull exit
function endit() {
    console.log('Exiting gracefully...');
    gyro.end();

    dbGyro.closeConnection();
    console.log('DB Connection closed.');
    process.exit();
}

// ---- Handle Interrupts
process.on('SIGINT', endit);
process.on('SIGTERM', endit);

// ---- Start process 
async function gyroStart() {

    await gyro.connect()

    const dbc = new dbGyro()
    await dbc.connect(config.db)
    
    var cnt = 0
    console.log("Loop rate is ",LoopRate, ' ms')
    async function executeTask() {

        try {
            // Gyrocompass status
            const rtn0F = await gyro.get_0F();

            // IRU mode and BMC status
            const rtn2C = await gyro.get_2C();

            State = { ...State, ...rtn0F, ...rtn2C };

            // If in NAV mode, get roll, pitch, and yaw
            if (rtn2C['iru_mode'] == 6) {
                // Heading and attitude
                const rtn62 = await gyro.get_62();

                // Add random noise to heading, roll, and pitch for testing
                if (addNoise) {
                    const addNoise = (value, noiseLevel) => value + (Math.random() * 2 - 1) * noiseLevel;

                    rtn62['hdg_true'] = addNoise(rtn62['hdg_true'], 2); // Adjust noise level as needed
                    rtn62['roll'] = addNoise(rtn62['roll'], 0.5);
                    rtn62['pitch'] = addNoise(rtn62['pitch'], 0.5);
                    console.log('Added noise to heading, roll, and pitch');
                }

                // Save to database
                await dbc.set_rpy(rtn62);

                // Merge new rpy information
                State = { ...State, ...rtn62 };
            } else {
                console.log(rtn2C['iru_mode_str']);
            }

            await dbc.update_state(State);

            // Look for and act on commands if present
            const fs = require('fs');

            if (fs.existsSync('./gyro_cmd')) {
                let gyroCmdContent = fs.readFileSync('gyro_cmd', 'utf8').trim();

                if (gyroCmdContent === 'gyrocompass') {
                    gyro.set_5D(3); // Monitor with 0F
                    console.log('Sent gyrocompass command');
                } else if (gyroCmdContent === 'gyrocompassBMC') {
                    gyro.set_5D(9); // Monitor with 2C
                    console.log('Sent gyrocompass command');
                } else if (gyroCmdContent === 'reset') {
                    gyro.set_01();
                    console.log('Sent gyrocompass reset');
                }

                fs.unlinkSync('gyro_cmd');
            }

        } catch (err) {
            console.error('There was an error:', err);
            endit();
            process.exit(1);
        }

        cnt++;
        setTimeout(executeTask, LoopRate);
    }

    executeTask();
}

gyroStart()
console.log('done')








