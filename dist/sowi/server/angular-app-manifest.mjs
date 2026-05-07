
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-VSDW43SO.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GRQMV3P7.js"
    ],
    "route": "/info"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-LUTRW2TM.js"
    ],
    "route": "/umfrage"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-BBCPJUEG.js"
    ],
    "route": "/impressum"
  },
  {
    "renderMode": 2,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1327, hash: '8a8f52429aa4ea3e8496ce810bf27db3d497328ace43a924867207fd824dc969', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1221, hash: '2757071cbf3226a4e08e8cf62802513a305728d1c859b4fd3ce749417aadb8e6', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 19211, hash: 'c4a559c37d1a8f2c30d01ec149c638cefd340369bca8aeb8791e1fc12c1e8ff6', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'impressum/index.html': {size: 16077, hash: '61a8d5213f68dc7b50aa6fc0d9419dcef821723ce5600c25eee4d765428db304', text: () => import('./assets-chunks/impressum_index_html.mjs').then(m => m.default)},
    'umfrage/index.html': {size: 14799, hash: '0aac7437416e43054707420afedd9e3702d6961ae4cef22ce7d15c1be3694c63', text: () => import('./assets-chunks/umfrage_index_html.mjs').then(m => m.default)},
    'info/index.html': {size: 21853, hash: '83f3632c4b2cea199e36faa22012eb84172e155dc1782838fd52d7411405807a', text: () => import('./assets-chunks/info_index_html.mjs').then(m => m.default)},
    'styles-AC6BCKL7.css': {size: 607, hash: 'fx0QtKQjGrc', text: () => import('./assets-chunks/styles-AC6BCKL7_css.mjs').then(m => m.default)}
  },
};
