/* eslint-disable quote-props */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
});

module.exports = function searchOnElasticDb(token) {
  return client.search({
    index: 'demonette',
    type: 'relation',
    body: {
      'query':
          {
            'match': {
              'graphie_1': token,
            },
          },
    },
  }).then(resp => resp.hits.hits);
};

