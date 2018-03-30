/* eslint-disable quote-props */
const elasticsearch = require('elasticsearch');
const { createAggregation, format } = require('../methods/search');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
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
      aggs: createAggregation(),
    },
  }).then(resp => format(resp));
};
