const express = require('express');
const next = require('next');
const compression = require('compression');
const LRUCache = require('lru-cache');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const logger = require('./server/logger');
dotenv.load()

const router = require('./routes');
const isDev = process.env.NODE_ENV !== 'production'
const isProd = !isDev;

const app = next({ dev: isDev, dir: '.' })
const appHandle = app.getRequestHandler()
const nextAuth = require('next-auth')
const nextAuthConfig = require('./next-auth.config')

const customHost = process.env.HOST;
const host = customHost || null;
const prettyHost = customHost || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;

process.on('uncaughtException', function(err) {
  console.error('Uncaught Exception: ', err)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection: Promise:', p, 'Reason:', reason)
})

const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1hour
});

const buildStats = isProd
  ? JSON.parse(fs.readFileSync('./.next/build-stats.json', 'utf8').toString())
  : null

const buildId = isProd
? fs.readFileSync('./.next/BUILD_ID', 'utf8').toString()
: null;

const getCacheKey = function getCacheKey(req) {
  return `${req.url}`;
};

const renderAndCache = function renderAndCache(
  req,
  res,
  pagePath,
  queryParams
) {
  const key = getCacheKey(req);

  if (ssrCache.has(key) && !isDev) {
    console.log(`CACHE HIT: ${key}`);
    res.send(ssrCache.get(key));
    return;
  }

  app
    .renderToHTML(req, res, pagePath, queryParams)
    .then(html => {
      // Let's cache this page
      if (!isDev) {
        console.log(`CACHE MISS: ${key}`);
        ssrCache.set(key, html);
      }

      res.send(html);
    })
    .catch(err => {
      app.renderError(err, req, res, pagePath, queryParams);
    });
};

const routerHandler = router.getRequestHandler(
  app,
  ({ req, res, route, query }) => {
    renderAndCache(req, res, route.page, query);
  }
);

app.prepare()
// .then(() => nextAuthConfig())
// .then(nextAuthOptions => {
//   return nextAuth(app, nextAuthOptions)
// })
.then(nextAuthOptions => {
  // const server = nextAuthOptions.expressApp
  const server = express()
  server.use(compression({ threshold: 0 }));
  server.use(
    cors({
      origin:
        prettyHost.indexOf('http') !== -1 ? prettyHost : `http://${prettyHost}`,
      credentials: true
    })
  );
  server.use(helmet());
  server.use(routerHandler);

  server.get(`/favicon.ico`, (req, res) =>
    app.serveStatic(req, res, path.resolve('./static/icons/favicon.ico'))
  );

  server.get('/sw.js', (req, res) =>
    app.serveStatic(req, res, path.resolve('./.next/sw.js'))
  );

  server.get('/manifest.html', (req, res) =>
    app.serveStatic(req, res, path.resolve('./.next/manifest.html'))
  );

  server.get('/manifest.appcache', (req, res) =>
    app.serveStatic(req, res, path.resolve('./.next/manifest.appcache'))
  );

  if (isProd) {
    server.get('/_next/-/app.js', (req, res) =>
      app.serveStatic(req, res, path.resolve('./.next/app.js'))
    );

    const hash = buildStats['app.js'] ? buildStats['app.js'].hash : buildId;

    server.get(`/_next/${hash}/app.js`, (req, res) =>
      app.serveStatic(req, res, path.resolve('./.next/app.js'))
    );
  }

  server.get('*', (req, res) => appHandle(req, res));

  server.listen(port, host, err => {
    if (err) {
      return logger.error(err.message);
    }

    console.log(String.raw`
      ███████╗██╗  ██╗██╗   ██╗███████╗██╗  ██╗██╗
      ██╔════╝██║ ██╔╝╚██╗ ██╔╝██╔════╝██║  ██║██║
      ███████╗█████╔╝  ╚████╔╝ ███████╗███████║██║
      ╚════██║██╔═██╗   ╚██╔╝  ╚════██║██╔══██║██║
      ███████║██║  ██╗   ██║   ███████║██║  ██║██║
      ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝
    `)
    console.log(`:fire:> App Steady on http://localhost:${port}`)
  });
});
