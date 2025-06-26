const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const MySQLRepository = require('./mysqlRepository');
const MongoRepository = require('./mongoRepository');
// const InfluxDBRepository = require('./influxDBRepository'); // Placeholder for InfluxDB

// Factory function to create the appropriate repository based on the configuration
async function createRepository(config) {

  if (config.dbtype === 'mysql') {

    const connection = await mysql.createConnection(config.mysql);
    console.log('Connected to MySQL database');
    return new MySQLRepository(connection);

  } else if (config.dbtype === 'mongodb') {

    await mongoose.connect(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB database');
    return new MongoRepository();

  } else if (config.dbtype === 'influxdb') {

    // Placeholder for InfluxDB repository
    // const InfluxDBRepository = require('./influxDBRepository');
    // return new InfluxDBRepository();

    throw new Error('InfluxDB support is not implemented yet'); 

  } else {

    throw new Error('Unsupported repo type');

  }

}

module.exports = createRepository;

