/* eslint-disable quote-props,no-underscore-dangle */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
  log: 'trace',
});

module.exports = function searchOnElasticDb(token, field) {
  const aggs = {
    'dedup': {
      'terms': {
        'field': field,
      },
      'aggs': {
        'dedup_docs': {
          'top_hits': {
            'size': 1,
            '_source': field,
          },
        },
      },
    },
  };
  const query = {
    'query_string': {
      'query': `*${token}*`,
      'fields': [field],
    },
  };
  return client.search({
    index: 'demonette',
    type: 'relation',
    _source: field,
    body: {
      'size': 0,
      'query': query,
      'aggs': aggs,
    },
  }).then(resp => resp.aggregations.dedup.buckets.map(aggregation =>
    (aggregation.dedup_docs.hits.hits[0]._source[field])));
};
