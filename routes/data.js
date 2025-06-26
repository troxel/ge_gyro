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

// -----------------------------------------------------------
/* GET home page. */
// -----------------------------------------------------------
router.get('/', function(req, res, next) {
 
  res.render('data', { title: 'GE Gyro Data' });

});

// -----------------------------------------------------------
// Download data as CSV
// -----------------------------------------------------------
router.get('/download_range', async function(req, res, next) {
 
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;

  if (!fromDate || !toDate) {
    res.status(400).send('Both fromDate and toDate are required.');
    return;
  }

  const fromDatems = new Date(fromDate).getTime();
  const toDatems = new Date(toDate).getTime();
  console.log("fromDate: ", fromDate)
  console.log("toDate: ", toDate)

  if (isNaN(fromDatems) || isNaN(toDatems)) {
    res.status(400).send('Invalid date format. Please use a valid date format.');
    return;
  }

  if (fromDatems >= toDatems) {
    res.status(400).send('fromDate must be earlier than toDate.');
    return;
  }

  try {
    var rpy_rows = await dbc.getAttitudeRange(fromDatems, toDatems);
    if (rpy_rows.length === 0) {
      res.status(404).send('No data available for the specified range.');
      return;
    }

    const header = "time,roll,pitch,yaw\n";
    const csvContent = header + rpy_rows.map(row => `${row.time},${row.roll},${row.pitch},${row.yaw}`).join('\n');

    const filename = `gyro_data_${fromDate}_to_${toDate}.csv`;

    console.log(`Generating CSV file: ${filename}`);

    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'text/csv');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// -----------------------------------------------------------
// Download data as CSV for the last N days
// -----------------------------------------------------------
router.get('/download', async function(req, res, next) {
 
  const day_range = req.query.day || 1;
  var rpy_rows = await dbc.getAttitudePastNow(day_range * 60);
  if (rpy_rows.length === 0) {
    res.status(404).send('No data available for the specified range.');
    return;
  }

  const header = "time,roll,pitch,yaw\n";
  const csvContent = header + rpy_rows.map(row => `${row.time},${row.roll},${row.pitch},${row.yaw}`).join('\n');

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `gyro_data_last_${dateStr}_${day_range}_days.csv`;
  console.log(`Generating CSV file: ${filename}`);

  res.setHeader('Content-disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');
  res.status(200).send(csvContent);
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

  rtnObj.plot = plotData

  //console.log("--------------------------------------")
  //console.log(rtnObj)
  
 
  res.json(rtnObj)
})

module.exports = router;
