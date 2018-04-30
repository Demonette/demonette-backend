/* eslint-disable no-underscore-dangle */
const elasticsearch = require('elasticsearch');

const elasticEnv = process.env.ELASTIC_DEMONETTE;

const client = new elasticsearch.Client({
  host: `${elasticEnv}`,
});

function formatNodeLinks(nodeLinks, rootTokens) {
  const nodes = [];
  const links = [];
  Object.values(nodeLinks)
    .forEach(el => el.forEach(g => nodes.push(g)));
  const newNodes = Array.from(new Set(nodes))
    .map((el, idx) => (
      rootTokens.includes(el) ? { id: idx, name: el, _color: '#6600cc' } : { id: idx, name: el, _color: '#666699' }
    ));
  const idNode = newNodes.map(el => el.name);
  Object.keys(nodeLinks)
    .forEach(k => nodeLinks[k]
      .forEach((el) => {
        const kIndex = idNode.indexOf(k);
        const elIndex = idNode.indexOf(el);
        const color = rootTokens.includes(k) && rootTokens.includes(el) ? '#6600cc' : '#666699';
        links.push({ sid: kIndex, tid: elIndex, _color: color });
      }));
  return { nodes: newNodes, links };
}

function elasticTokenQuery(token) {
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
}

function graphRequest(start, range, tokens, nodeLinks) {
  return Promise
    .all(tokens.map(t => elasticTokenQuery(t)))
    .then((res) => {
      console.log(`start : ${typeof start}`);
      // eslint-disable-next-line no-param-reassign
      res.forEach((g) => { nodeLinks = Object.assign(nodeLinks, g); });
      const nMap = [];
      res.forEach(e => Object.values(e).forEach(a => a.forEach(b => nMap.push(b))));
      return [...(new Set(nMap))];
    })
    .then(e => (start < range ?
      graphRequest(start + 1, range, e, nodeLinks) : nodeLinks));
}

module.exports = {
  graph(start, range, tokens) {
    return graphRequest(Number(start), Number(range), tokens, {})
      .then(n => formatNodeLinks(n, tokens));
  },
};
