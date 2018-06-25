/* eslint-disable quote-props */
const elasticsearch = require('elasticsearch');
const { createAggregation } = require('../methods/search');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
});
module.exports = function getAll(size, from, originFilter) {
  return client.search({
    index: process.env.PREFIX,
    type: 'relation',
    size,
    from,
    body: {
      query: {
        bool: {
          must: {
            match_all: {},
          },
          filter: {
            'terms': {
              'origineCouple': originFilter.split(','),
            },
          },
        },
      },
      aggs: createAggregation(),
    },
  }).then(resp => resp);
};
