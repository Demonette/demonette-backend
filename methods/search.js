/* eslint-disable quote-props */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
  log: 'trace',
});

module.exports = function searchOnElasticDb(token) {
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
            'graphie_1',
            'graphie_2',
            'def_conc',
            'def_abs',
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
    body: {
      'query': query,
      'sort': sort,
    },
    size: 50,
  }).then(resp => resp.hits.hits);
};

