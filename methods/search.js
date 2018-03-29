/* eslint-disable quote-props */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
  log: 'trace',
});

module.exports = function searchOnElasticDb(token, size, from) {
  const sort = [
    {
      '_score': {
        'order': 'asc',
      },
    },
  ];

  const query = {
    bool: {
      must: {
        'multi_match': {
          'operator': 'and',
          'type': 'cross_fields',
          'query': token,
          'fields': [
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
            'def_conc',
            'def_abs',
            'orientation',
            'complexite',
          ],
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
      'query': query,
      'sort': sort,
    },
  }).then(resp => resp);
};

