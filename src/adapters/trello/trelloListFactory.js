module.exports = function(options) {

  options = options || {};

  if (options.id === undefined) { throw new Error('id not defined'); }
  if (options.name === undefined) { throw new Error('name not defined'); }

  return {
    id: options.id,
    name: options.name
  };
};
