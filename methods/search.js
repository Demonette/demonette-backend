/* eslint-disable quote-props */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
  log: 'trace',
});

module.exports = function searchOnElasticDb(token, res) {
  client.search({
    index: 'demonette',
    type: 'relation',
    body: {
      'query':
          {
            'match': {
              'graphie_1': token,
            },
          },
    },
  }).then(resp => res.status(200).send(resp.hits.hits))
    .catch(err => res.status(400).send(err));
};

