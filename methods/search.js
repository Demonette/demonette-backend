/* eslint-disable quote-props */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
  log: 'trace',
});

const sort = [
  {
    '_score': {
      'order': 'asc',
    },
  },
];
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

module.exports = {
  searchOnElasticDb(token, size, from) {
    const query = {
      bool: {
        must: {
          'multi_match': {
            'operator': 'and',
            'type': 'cross_fields',
            'query': token,
            'fields': fields,
          },
        },
        should: {
          'multi_match': {
            'operator': 'and',
            'query': token,
            'fields': [
              'graphie_1',
              'graphie_2',
            ],
          },
        },
      },
    };
    return client.search({
      index: 'demonette',
      type: 'relation',
      size,
      from,
      body: {
        query,
        sort,
        aggs: module.exports.createAggregation(),
      },
    }).then(resp => resp);
  },
  createAggregation() {
    const aggs = {};
    fields.forEach((el) => {
      aggs[el] = {
        'terms': {
          'field': el,
        },
        'aggs': {
          'dedup_docs': {
            'top_hits': {
              'size': 1,
              '_source': [el],
            },
          },
        },
      };
    });
    return aggs;
  },
};

