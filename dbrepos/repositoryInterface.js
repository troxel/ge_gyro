class RepositoryInterface {
  async getState() {
    throw new Error('getState() not implemented');
  }

  async getAttitudePastNow(seconds) {
    throw new Error('getAttitudePastNow() not implemented');
  }

  async getAttitudeRange(startTime, stopTime) {
    throw new Error('getAttitudeRange() not implemented');
  }
}

module.exports = RepositoryInterface;

