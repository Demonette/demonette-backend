/* eslint-disable quote-props */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
  log: 'trace',
});

module.exports = function getAll(size, from) {
  return client.search({
    index: 'demonette',
    type: 'relation',
    size,
    from,
    body: {
      query: {
        match_all: {},
      },
    },
  }).then(resp => resp);
};
