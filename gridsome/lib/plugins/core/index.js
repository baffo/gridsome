const path = require('path')
const fs = require('fs-extra')

const { NOT_FOUND_NAME } = require('../../utils/constants')

function corePlugin (api, config) {
  api.loadSource(store => {
    store.addMetadata('siteName', config.siteName)
    store.addMetadata('siteDescription', config.siteDescription)
    store.addMetadata('siteUrl', config.siteUrl)
    store.addMetadata('pathPrefix', config.pathPrefix)

    for (const key in config.metadata) {
      store.addMetadata(key, config.metadata[key])
    }
  })

  api.createPages(({ createPage }) => {
    createPage({
      path: '/404' + (config.permalinks.trailingSlash ? '/' : ''),
      component: path.join(config.appPath, 'pages', '404.vue'),
      route: {
        name: NOT_FOUND_NAME
      }
    })
  })

  api.afterBuild(({ config }) => {
    const notFoundPath = path.join(config.outDir, '404', 'index.html')
    const notFoundDest = path.join(config.outDir, '404.html')

    if (fs.existsSync(notFoundPath)) {
      fs.copySync(notFoundPath, notFoundDest)
    }
  })

  api._app.pages.hooks.createRoute.tap('Gridsome', options => {
    if (/\/404\/?/.test(options.path)) {
      options.name = NOT_FOUND_NAME
    }

    return options
  })
}

module.exports = corePlugin
