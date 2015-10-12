var rally = require('rally');
var queryUtils = rally.util.query;
var Q = require('q');
var _ = require('lodash');
var ticketMapper = require('./rallyTicketMapper');

var TICKETS_LIMIT = 100;

function apiSettings(options) {
  return {
    apiKey: options.apiKey,
    server: 'https://rally1.rallydev.com'
  }
}

function currentDateInIsoFormat() {
  return new Date().toISOString();
}


module.exports = function(options) {

  var settings = apiSettings({ apiKey: options.apiKey });
  var restApi = rally(settings);

  function fetchCurrentIterationId(rallyProjectId) {

    var deferred = Q.defer();

    var currentDateInIso = currentDateInIsoFormat();

    var query = {

      type: 'Iteration',
      fetch: ['ObjectID', 'StartDate', 'EndDate'],

      query: queryUtils
        .where('Project.ObjectId', '=', rallyProjectId)
        .and('StartDate', '<', currentDateInIso)
        .and('EndDate', '>', currentDateInIso)
    };

    var handleResponse = function(err, res) {

      if (err) {
        deferred.reject(new Error(err));

      } else if (res.Results.length != 1) {
        deferred.reject(new Error('Found multiple iterations'));

      } else {
        var iterationId = _(res.Results).first().ObjectID;
        deferred.resolve(iterationId);
      }
    };

    restApi.query(query, handleResponse);

    return deferred.promise;
  }

  function getIterationTickets(iterationId) {

    var deferred = Q.defer();

    var query = {
      type: 'hierarchicalrequirement',
      fetch: ['FormattedID','ObjectID', 'Name', 'Iteration', 'Owner', 'ScheduleState', 'Description'],
      query: queryUtils.where('Iteration.ObjectId', '=', iterationId),
      start: 1,
      limit: TICKETS_LIMIT
    };

    var handleResponse = function(err, res) {

      function tickets() {
        return _(res.Results).map(ticketMapper.map).value();
      }

      if (err) {
        deferred.reject(new Error(err));

      } else {
        deferred.resolve(tickets());
      }
    };

    restApi.query(query, handleResponse);

    return deferred.promise;
  }

  return {

    fetchCurrentSprintTickets: function(rallyProjectId) {
      return fetchCurrentIterationId(rallyProjectId).then(getIterationTickets);
    }
  };
};
