/* eslint-disable quote-props,no-underscore-dangle */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
  log: 'trace',
});

module.exports = function searchOnElasticDb(token) {
  const aggs = {
    'dedup': {
      'terms': {
        'field': 'type_1',
      },
      'aggs': {
        'dedup_docs': {
          'top_hits': {
            'size': 1,
            '_source': 'type_1',
          },
        },
      },
    },
  };
  const query = {
    'multi_match': {
      'query': token,
      'type': 'phrase_prefix',
      'fields': [
        'type_1',
      ],
    },
  };
  return client.search({
    index: 'demonette',
    type: 'relation',
    _source: ['type_1'],
    body: {
      'size': 0,
      'query': query,
      'aggs': aggs,
    },
  }).then(resp => resp.aggregations.dedup.buckets.map(aggregation =>
    (aggregation.dedup_docs.hits.hits[0]._source.type_1)));
};
