const mysql = require('mysql2/promise');
const RepositoryInterface = require('./repositoryInterface');

class MySQLRepository extends RepositoryInterface {
  constructor(connection) {
    super();
    this.connection = connection;
  }

  // ----------------------------------
  // The present table is only 1 row. However may timestamp if customers want to know history of states. 
  async getState() {
    const [rows] = await this.connection.execute('SELECT * FROM gyro_state ORDER BY id DESC LIMIT 1');
    return rows[0];
  }

  // ----------------------------------
  async getAttitudePastNow(seconds) {
    const now = Math.floor(Date.now() / 1000); // current epoch seconds
    const since = now - seconds;
    const [rows] = await this.connection.execute(
      'SELECT * FROM attitude WHERE time BETWEEN ? AND ? ORDER BY time ASC',
      [since, now]
    );
    return rows;
  }

  // ----------------------------------
  async getAttitudeRange(startTime, stopTime) {
    const startEpoch = Math.floor(new Date(startTime).getTime() / 1000);
    const stopEpoch = Math.floor(new Date(stopTime).getTime() / 1000);
    const [rows] = await this.connection.execute(
      'SELECT * FROM attitude WHERE time BETWEEN ? AND ? ORDER BY time ASC', [startEpoch, stopEpoch] 
    );
    return rows;
  }
}

module.exports = MySQLRepository;

