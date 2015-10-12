var ticket = require('../../domain/ticket');

module.exports = {

  map: function(options) {

    options = options || {};

    return ticket({
      id: options.ObjectID,
      friendlyId: options.FormattedID,
      name: options.Name,
      description: options.Description,
      stateName: options.ScheduleState,
      ownerId: options.Owner ? options.Owner.ObjectID : undefined
    })
  }
};
