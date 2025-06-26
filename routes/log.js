//***************************************************************************************
var express = require('express');
var router = express.Router();

const dbGyro = require('../dbgyro')

const config = require('../config');

const fs = require('fs')
const ping = require('ping');
const { execSync } = require('child_process');

const dbc = new dbGyro()
dbc.connect(config.db)

// -----------------------------------------------------------
/* GET home page. */
// -----------------------------------------------------------
router.get('/', function(req, res, next) {
 
  let rtnObj = {}
  
  try {
    const stdout = execSync('journalctl -u ge_gyro -r --no-pager --no-hostname | head -n 200').toString();
    rtnObj['log'] = stdout;
  } catch (error) {
    console.error(`Error fetching logs: ${error.message}`);
    rtnObj['log'] = `Error fetching logs: ${error.message}`;
  }

  rtnObj['timeNow'] = Date.now();
  rtnObj['title'] = 'GE Gyro Logs';


  rtnObj['additionalInfo'] = 'Logs fetched successfully';

  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  rtnObj['fullUrl'] = fullUrl;

  res.render('log', rtnObj);

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

module.exports = router;
