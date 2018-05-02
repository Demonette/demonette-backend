/* eslint-disable quote-props,no-underscore-dangle */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
});

const fields = [
  'type_1',
  'graphie_1',
  'cat_1',
  'type_constr_1',
  'constr_1',
  'type_2',
  'graphie_2',
  'cat_2',
  'type_constr_2',
  'constr_2',
  'orientation',
  'complexite',
];

function formatBuckets(buckets) {
  return buckets.map(el => Object.values(el.dedup_docs.hits.hits[0]._source)[0]);
}

function formatAggs(resp) {
  const res = {};
  Object.keys(resp.aggregations).forEach((agg) => {
    res[agg] = formatBuckets(resp.aggregations[agg].buckets);
  });
  return res;
}

function createAggregation(token) {
  const aggs = {};
  fields.forEach((el) => {
    aggs[el] = {
      'terms': {
        'field': el,
        'include': `"${token}".*`,
      },
      'aggs': {
        'dedup_docs': {
          'top_hits': {
            '_source': [el],
          },
        },
      },
    };
  });
  return aggs;
}

function searchTokenInField(token) {
  const query = {
    'query_string': {
      'fields': fields,
      'query': `"${token}"*`,
    },
  };

  return client.search({
    index: 'demonette',
    type: 'relation',
    body: {
      'query': query,
      'size': 0,
      'aggs': createAggregation(token),
    },
  });
}

function format(res) {
  Object.keys(res).forEach((k) => {
    const resKey = k.split('_')[0];
    if (k.indexOf('_') !== -1) {
      if (!(k.split('_')[0] in res)) {
        res[resKey] = [];
      }
      res[resKey] = Array.from(new Set(res[resKey].concat(res[k])));
      delete res[k];
    }
  });
  return res;
}

module.exports = function autocomplete(token) {
  return searchTokenInField(token.toLocaleLowerCase())
    .then(res => format(formatAggs(res)));
};
