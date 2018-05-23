/* eslint-disable quote-props */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
});

const sort = [
  {
    '_score': {
      'order': 'asc',
    },
  },
];
const fields = [
  'typeSemantique_1',
  'graph_1',
  'categorie_1',
  'typeConstruction_1',
  'construction_1',
  'typeSemantique_2',
  'graph_2',
  'categorie_2',
  'typeConstruction_2',
  'construction_2',
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
            'query': token.replace(/,/g, ' '),
            'fields': fields,
          },
        },
        should: {
          'multi_match': {
            'operator': 'and',
            'query': token.replace(/,/g, ' '),
            'fields': [
              'graph1',
              'graph2',
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
      aggs[`count-${el}`] = { 'value_count': { 'field': el } };
    });
    return aggs;
  },
  format(res) {
    const aggs = res.aggregations;
    Object.keys(aggs).forEach((el) => {
      const resKey = el.split('_').slice(0, -1).join('_');
      if (el.slice(-1).match(/[0-9]/g)) {
        if (!(resKey in aggs)) {
          aggs[resKey] = [];
        }
        aggs[resKey] = aggs[el];
        delete aggs[el];
      }
    });
    return res;
  },
};
