const RepositoryInterface = require('./repositoryInterface');
const Attitude = require('../models/nosql/Attitude');  // Mongoose model
const State = require('../models/nosql/State');

class MongoRepository extends RepositoryInterface {
  async getState() {
    return await State.findOne().sort({ _id: -1 }).lean();
  }

  async getAttitudePastNow(seconds) {
    const now = Math.floor(Date.now() / 1000);
    const since = now - seconds;
    return await Attitude.find({ time: { $gte: since, $lte: now } }).sort('time').lean();
  }

  async getAttitudeRange(startTime, stopTime) {
    const startEpoch = Math.floor(new Date(startTime).getTime() / 1000);
    const stopEpoch = Math.floor(new Date(stopTime).getTime() / 1000);
    return await Attitude.find({ time: { $gte: startEpoch, $lte: stopEpoch } }).sort('time').lean();
  }
}

module.exports = MongoRepository;

