var importServiceFactory = require('./src/services/importServiceFactory');
var RallyState = require('./src/adapters/rally/rallyState');

module.exports = function(config) {

  return {

    services: {
      importService: importServiceFactory(config)
    },

    constants: {
      RallyState: RallyState
    }
  };
};


