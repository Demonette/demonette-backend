/* eslint-disable quote-props,no-underscore-dangle */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
});

function formatAggs(resp) {
  const res = [];
  resp.aggregations.dedup.buckets.forEach(el =>
    res.push(Object.values(el.dedup_docs.hits.hits[0]._source)[0]));
  return res;
}

function searchTokenInField(field, token, acObject) {
  const newObject = acObject;
  const aggs = {
    'dedup': {
      'terms': {
        'size': 20,
        'field': `${field}`,
      },
      'aggs': {
        'dedup_docs': {
          'top_hits': {
            'size': 1,
            '_source': [`${field}`],
          },
        },
      },
    },
  };

  const query = {
    'query_string': {
      'fields': [
        `${field}`,
      ],
      'query': `*${token}*`,
    },
  };

  return client.search({
    index: 'demonette',
    type: 'relation',
    body: {
      'query': query,
      'size': 0,
      'aggs': aggs,
    },
  }).then((resp) => {
    newObject[field] = formatAggs(resp);
    return acObject;
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
  return searchTokenInField('type_1', token, {})
    .then(res => searchTokenInField('type_2', token, res))
    .then(res => searchTokenInField('type_constr_1', token, res))
    .then(res => searchTokenInField('type_constr_2', token, res))
    .then(res => searchTokenInField('graphie_1', token, res))
    .then(res => searchTokenInField('graphie_2', token, res))
    .then(res => searchTokenInField('cat_1', token, res))
    .then(res => searchTokenInField('cat_2', token, res))
    .then(res => searchTokenInField('constr_1', token, res))
    .then(res => searchTokenInField('constr_2', token, res))
    .then(res => searchTokenInField('complexite', token, res))
    .then(res => searchTokenInField('orientation', token, res))
    .then(res => format(res));
};
