//***************************************************************************************
// 
//***************************************************************************************

const config = {
  dbtype: 'mysql',
  mysql: {
    host: "127.0.0.1",
    user: "webdev",
    password: "webdev1!",    
    database: "ge_gyro"
  },
  mongodb: { uri: 'mongodb://localhost:27017/test' },
  influxdb: { /* Placeholder for InfluxDB config */ },
  db: {
    host: "127.0.0.1",
    user: "webdev",
    password: "webdev1!",    
    database: "ge_gyro"
  },
  ip: {
    "PORT":4001,
    "HOST":"130.46.84.224"
    //"HOST":"130.46.82.174"
  },
  cmd_file: './gyro_cmd'
};

module.exports = config;
