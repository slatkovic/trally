var _ = require('lodash');

var RALLY_NAME_INDEX = 0;
var TRELLO_NAME_INDEX = 1;

module.exports = {

  matchTrelloListName: function(rallyStateName, mappings) {

    function resolveRallyStateName(pair) {
      return pair[RALLY_NAME_INDEX];
    }

    function resolveTrelloStateName(pair) {
      return pair[TRELLO_NAME_INDEX];
    }

    function resolvePair() {
      return _(mappings).find(function(pair) {
        return resolveRallyStateName(pair) === rallyStateName;
      });
    }

    var pair = resolvePair();

    if (!pair) {
      throw new Error('Could not match a Rally state: ' + rallyStateName);
    }

    return resolveTrelloStateName(pair);
  }
};