const mysql =  require('mysql2/promise')

class dbGyro {

  constructor(options={}) {
    this.verbose = options.verbose || 0
  }
  
  // --------------------------------
  async connect(config) {
    this.config = config

    this.connection = await mysql.createConnection(this.config)

    // Get the current year
    const currYear = new Date().getFullYear()
    
    this.rpyTbl = `rpy_${currYear}`
  
    // SQL to create the table if it doesn't exist
    const createRpyTbl = `CREATE TABLE IF NOT EXISTS ${this.rpyTbl} ( 
              time BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              roll float not null,
              pitch float not null,
              yaw float not null);`

    await this.connection.execute(createRpyTbl)

    const createStateTbl = `CREATE TABLE IF NOT EXISTS gyro_state (
      id INT PRIMARY KEY DEFAULT 1,
      gc_time INT, 
      gc_bmc_time INT,
      gc_mode_num  INT,
      gc_bmc_mode_num  INT,
      gc_mode_str VARCHAR(35),
      gc_bmc_mode_str  VARCHAR(35),
      move_stat  INT,
      move_stat_str  VARCHAR(35),
      roll FLOAT,
      pitch FLOAT,
      hdg_true FLOAT,
      cbit INT not null default 0,
      iru_mode INT,
      iru_mode_str  VARCHAR(35) );`
        
    await this.connection.execute(createStateTbl)

    return this.connection
  }

  // --------------------------------
  async set_rpy(rpy) {

    const ts = Date.now()
    const insertCmd = `INSERT INTO ${this.rpyTbl} (time,roll,pitch,yaw) VALUES (${ts},${rpy.roll},${rpy.pitch},${rpy.hdg_true});`
    await this.connection.execute(insertCmd)

  }

  // --------------------------------
  async update_state(state) {

    const update_time = Date.now()
    
    const updateSql = `UPDATE gyro_state SET
    gc_time=${state['gc_time']},
    gc_bmc_time=${state['gc_bmc_time']},
    gc_mode_num=${state['gc_mode_num']},
    gc_bmc_mode_num=${state['gc_bmc_mode_num']},
    gc_mode_str='${state['gc_mode_str']}',
    gc_bmc_mode_str='${state['gc_bmc_mode_str']}',
    move_stat=${state['move_stat']},
    move_stat_str='${state['move_stat_str']}',
    roll=${state['roll']},
    pitch=${state['pitch']},
    hdg_true=${state['hdg_true']},
    cbit=${state['cbit']},
    iru_mode=${state['iru_mode']},
    iru_mode_str='${state['iru_mode_str']}',
    update_time=${update_time} WHERE id = 1`;
     
    //console.log(updateSql)
    const rst = await this.connection.query(updateSql)
  }

  // ----------------------------------
  async getState() {
    const [rows] = await this.connection.execute('SELECT * FROM gyro_state ORDER BY id DESC LIMIT 1');
    const row = rows[0];
    if (row) {
      row.roll = parseFloat(row.roll.toFixed(2));
      row.pitch = parseFloat(row.pitch.toFixed(2));
      row.hdg_true = parseFloat(row.hdg_true.toFixed(2));
    }
    return row;
  }

  // ----------------------------------
  async getAttitudePastNow(seconds) {
    const now = Math.floor(Date.now()); // current epoch milliseconds
    const since = now - seconds*1000;
    const [rows] = await this.connection.execute(
      `SELECT * FROM ${this.rpyTbl} WHERE time BETWEEN ? AND ? ORDER BY time ASC`,
      [since, now]
    );
    return rows;
  }

// ----------------------------------
  async getAttitudeRange(startTime, endTime) {
    const [rows] = await this.connection.execute(
      `SELECT * FROM ${this.rpyTbl} WHERE time BETWEEN ? AND ? ORDER BY time ASC`,
      [startTime, endTime]
    );
    return rows;
  }

  // ----------------------------------
  async closeConnection() {
    await this.connection.end();
  }

}

module.exports = dbGyro;
  