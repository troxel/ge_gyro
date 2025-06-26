//***************************************************************************************
//***************************************************************************************

var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');
const dbGyro = require('../dbgyro')

const _ = require('lodash');
const { max } = require('lodash');

const dbc = new dbGyro()
dbc.connect(config.db)

const reduce = require('datareduce')

// -----------------------------------------------------------
/* GET home page. */
// -----------------------------------------------------------
router.get('/', function(req, res, next) {
 
  res.render('index', { title: 'GE Gyro'});

});

// -----------------------------------------------------------
// HOME (index() XHR data
// -----------------------------------------------------------
router.get('/xhr', async function(req, res, next) {

  var startProfile = process.hrtime();

  const rng_win = req.query.rng_win || 1;

  // Return object
  let rtnObj = {}
  let innerHTML = {}
  let style = {}
  let setAttribute = {}

  let row = await dbc.getState()
  
  //console.log("State: ",row)

  var rpy_rows = await dbc.getAttitudePastNow(rng_win*60)
  // console.log("rpy_rows: ",rpy_rows.length)
  // console.log("rpy_rows: ",rpy_rows)

  row['timeNow']  = Date.now()

  innerHTML = row

  // Prepare to return
  rtnObj.innerHTML = innerHTML
  rtnObj.style = style
  rtnObj.setAttribute = setAttribute

  // re-order data for plotting
  let plotData = {}
  plotData.timeSeries = []
  plotData.hdg = []
  plotData.pitch  = []
  plotData.roll  = []

  for (let i = 0; i < rpy_rows.length; i++) {
    plotData.timeSeries.push(new Date(rpy_rows[i].time));
    plotData.hdg.push(parseFloat(rpy_rows[i].yaw.toFixed(2)));
    plotData.pitch.push(parseFloat(rpy_rows[i].pitch.toFixed(1)));
    plotData.roll.push(parseFloat(rpy_rows[i].roll.toFixed(1)));
  }

  // Reduce data to 1000 points if it exceeds 1000
  // if (plotData.timeSeries.length > 1000) {
  //   plotData.hdg = reduce.lt3b(plotData.timeSeries, plotData.hdg, 1000);
  //   plotData.pitch = reduce.lt3b(plotData.timeSeries, plotData.pitch, 1000);
  //   plotData.roll = reduce.lt3b(plotData.timeSeries, plotData.roll, 1000);
  // }

  rtnObj.plot = plotData

  //console.log("--------------------------------------")
  //console.log(rtnObj)
  
 
  res.json(rtnObj)
})

module.exports = router;
