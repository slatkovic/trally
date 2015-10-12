module.exports = function(options) {

  options = options || {};

  if (options.id === undefined)          { throw new Error('id not defined'); }
  if (options.friendlyId === undefined)  { throw new Error('friendlyId not defined'); }
  if (options.name === undefined)        { throw new Error('name not defined'); }
  if (options.description === undefined) { throw new Error('description not defined'); }
  if (options.stateName === undefined)   { throw new Error('stateName not defined'); }

  return {
    id: options.id,
    friendlyId: options.friendlyId,
    name: options.name,
    description: options.description,
    stateName: options.stateName,
    ownerId: options.ownerId
  };
};
