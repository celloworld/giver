"use strict";

const path = require('path');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const compression = require('compression');
const responseTime = require('response-time');

module.exports = function config (app) {

    switch (app.get('env')) {
        case 'production':
            app
                .enable('prod')
                .enable('view cache')
                .enable('compress')
                .disable('debug');
            break;
        default:
            app
                .enable('dev')
                .enable('debug')
                .disable('compress');
            break;
    }

    app
        .disable('x-powered-by')

        .set('port', process.env.PORT || 3000)
        .set('root', path.join(__dirname, '/../'))

        .engine('html', engines.nunjucks)
        .set('view engine', 'html')
        .set('views', path.join(__dirname, '/../views'))
        .set('view cache', app.get('view cache'))

        .use(responseTime({ digits: 3 }))
        .use(bodyParser.urlencoded({ extended: true }))
        .use(bodyParser.json());

    if (app.get('compress')) {
        app.use(compression());
    }

    return app

}