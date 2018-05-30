/* eslint-disable quote-props */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;
const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
});
module.exports = function getOrigine() {
  return client.search({
    index: 'demonette',
    type: 'relation',
    body: {
      query: {
        match_all: {},
      },
      size: 0,
      aggs: {
        origin: {
          'terms': {
            'field': 'origineCouple',
          },
        },
      },
    },
  }).then(resp => resp);
};
