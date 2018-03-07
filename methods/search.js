/* eslint-disable quote-props */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
  log: 'trace',
});

module.exports = function searchOnElasticDb(token) {
  return client.search({
    index: 'demonette',
    type: 'relation',
    body: {
      'query':
          {
            'multi_match': {
              'query': token,
              'fields': ['graphie_1', 'graphie_2', 'def_conc', 'def_abs'],
            },
          },
      'aggs': {
        'dedup': {
          'terms': {
            'field': '_uid',
          },
          'aggs': {
            'dedup_docs': {
              'top_hits': {
                'size': 1,
              },
            },
          },
        },
      },
    },
  }).then(resp => resp.hits.hits);
};

