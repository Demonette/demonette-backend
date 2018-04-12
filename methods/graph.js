/* eslint-disable no-underscore-dangle */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
});

module.exports = {
  graph(token) {
    return client.search({
      index: 'demonette',
      type: 'relation',
      body: {
        query: {
          multi_match: {
            query: token,
            fields: ['graphie_*'],
          },
        },
        size: 0,
        aggs: {
          graphie: {
            top_hits: {
              size: 10,
              _source: ['graphie_*'],
            },
          },
        },
      },
    }).then(resp => resp.aggregations.graphie.hits.hits
      .map(el => Object.values(el._source))
      .reduce((p, c) => p.concat(c)))
      .then(c => Array.from(new Set(c)))
      .then(c => ({ [token]: c }));
  },
};
