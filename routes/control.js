//***************************************************************************************
var express = require('express');
var router = express.Router();

const dbGyro = require('../dbgyro')

const config = require('../config');

const fs = require('fs')
const { exec } = require('child_process')
const ping = require('ping');

const dbc = new dbGyro()
dbc.connect(config.db)

// -----------------------------------------------------------
/* GET home page. */
// -----------------------------------------------------------
router.get('/', function(req, res, next) {
 
  res.render('control', { title: 'GE Gyro Control'});

});

// -----------------------------------------------------------
// HOME (index() XHR data
// -----------------------------------------------------------
router.get('/xhr', async function(req, res, next) {

  var startProfile = process.hrtime();

  // Return objects
  let rtnObj = {}
  let innerHTML = {}
  let style = {}
  let setAttribute = {}
  let removeAttribute = {}

  let row = await dbc.getState()
  row['timeNow']  = Date.now()
  
  //console.log("State: ",row)

  innerHTML = row

  if (row['gc_mode_num'] == 0) {
    //console.log("Gyro compass is ON")
    removeAttribute['gc_cmd'] = ['disabled'];
  } else {
    //console.log("Gyro compass is OFF")
    setAttribute['gc_cmd'] = {disabled: 'true'};
  }

  innerHTML['ping_stat'] = config.ip.HOST
  style['ping_stat'] = {color: 'orange'}; // Default to orange for unknown state

  try {
    const pingResult = await ping.promise.probe(config.ip.HOST);
    if (pingResult.alive) {
      style['ping_stat'] = {color: 'green', fontWeight: 'bold'};
    } else {
      style['ping_stat'] = {color: 'red'};
    }
  } catch (error) {
    console.error(`Error pinging host: ${error.message}`);
    style['ping_stat'] = {color: 'red'};
  }

  // Prepare to return
  rtnObj.innerHTML = innerHTML
  rtnObj.style = style
  rtnObj.setAttribute = setAttribute
  rtnObj.removeAttribute = removeAttribute

  res.json(rtnObj)

})


// -----------------------------------------------------------
// Command to start gyrocompass (gyro_acq.js deletes after reading)
// -----------------------------------------------------------
router.post('/gyrocompass', async function(req, res, next) {
  
  await fs.promises.writeFile(config.cmd_file, 'gyrocompass');
  console.log("Gyro compass command written to file:", config.cmd_file);
  res.json({ message: 'Gyro compass command written successfully' });

})

// -----------------------------------------------------------
// Command to reset (gyro_acq.js deletes after reading)
// -----------------------------------------------------------
router.post('/reset', async function(req, res, next) {
  
  await fs.promises.writeFile(config.cmd_file, 'reset');
  console.log("Reset command written to file:", config.cmd_file);
  res.json({ message: 'Reset command written successfully' });

})

// -----------------------------------------------------------
// Command to reset (gyro_acq.js deletes after reading)
// -----------------------------------------------------------
router.post('/restart_acq', async function(req, res, next) {

  exec('sudo /usr/bin/systemctl restart ge_gyro.service', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error restarting service: ${error.message}`);
      return;
    } 
    if (stderr) { 
      console.error(`Service restart stderr: ${stderr}` );
      return;
    }
    console.log(`Service restart stdout: ${stdout}`);
    res.json({ message: 'Service restarted successfully' });
  });
})


module.exports = router;
