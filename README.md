## Trally


#### Description

Import Rally tickets into Trello. 


#### Prerequisites

1. [Get a Trello API key and a write token](https://trello.com/app-key). Pro tip: When generating the token, set the expiration parameter to 'never'.
2. Manually create a Trello board w/ lists
3. [Create a new Rally API key](https://rally1.rallydev.com/login/accounts/index.html#/keys)


#### Example usage

```javascript

var trallyFactory = require('trally');
var trally = trallyFactory({
  rallyApiKey: 'rally-api-key',
  trelloApiKey: 'trello-api-key',
  trelloToken: 'trello-token'
});

var RallyState = trally.constants.RallyState;
var importService = trally.services.importService;

var importParams = {
  rallyProjectId: 'project-id',
  trelloBoardName: 'board-name',
  stateMappings: [
    [RallyState.BACKLOG, 'ToDo'],
    [RallyState.DEFINED, 'ToDo'],
    [RallyState.IN_PROGRESS, 'Active'],
    [RallyState.COMPLETED, 'Testing'],
    [RallyState.ACCEPTED, 'Done']
  ]
};

importService.importCurrentRallySprintIntoTrello(importParams).then(function() {
  console.log('Tickets imported');
}).catch(function(e) {
  console.log('Error while importing', e);
}).done();

```
