var Q = require('q');
var _ = require('lodash');

var utils = require('../utils');
var rallyAdapterFactory  = require('../adapters/rally/rallyAdapterFactory');
var trelloAdapterFactory = require('../adapters/trello/trelloAdapterFactory');


module.exports = function(config) {

  config = config || {};

  if (config.rallyApiKey  === undefined) throw new Error('rallyApiKey not provided');
  if (config.trelloApiKey === undefined) throw new Error('trelloApiKey not provided');
  if (config.trelloToken  === undefined) throw new Error('trelloToken not provided');

  var rallyAdapter  = rallyAdapterFactory({ apiKey: config.rallyApiKey });
  var trelloAdapter = trelloAdapterFactory({ apiKey: config.trelloApiKey, token: config.trelloToken });


  function archiveListCards(trelloLists) {

    function ids() {
      return _(trelloLists).pluck('id').value();
    }

    return trelloAdapter.archiveAllListCards(ids());
  }

  function importRallyTicketsIntoTrello(stateMappings) {

    return function (rallyTickets, trelloLists) {

      function resolveTargetListId(ticket) {

        var listName = utils.matchTrelloListName(ticket.stateName, stateMappings);

        function findList() {
            return _(trelloLists).find(function(list) {
                return list.name === listName;
            });
        }

        var list = findList();

        if (!list) {
            throw new Error('List does not exist in Trello: ' + listName);
        }

        return list.id;
      }

      function importCards(rallyTickets) {

        function importCard(ticket) {
          var targetListId = resolveTargetListId(ticket);
          return trelloAdapter.addCardToList(ticket.name, targetListId);
        }

        function promises() {
          return _(rallyTickets).map(importCard).value();
        }

        return Q.all(promises());
      }

      return archiveListCards(trelloLists).then(importCards(rallyTickets));
    }
  }

  return {

    importCurrentRallySprintIntoTrello: function(options) {

      options = options || {};

      if (options.trelloBoardName === undefined) throw new Error('trelloBoardName not provided');
      if (options.rallyProjectId  === undefined) throw new Error('rallyProjectId not provided');
      if (options.stateMappings   === undefined) throw new Error('stateMappings not provided');

      return Q.spread([
        rallyAdapter.fetchCurrentSprintTickets(options.rallyProjectId),
        trelloAdapter.getListsByBoardName(options.trelloBoardName)
      ], importRallyTicketsIntoTrello(options.stateMappings));
    }
  }
};