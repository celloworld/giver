"use strict";

const boot = require('./boot');
const server = require('express')();
const app = boot(server);

module.exports = app;

if (!module.parent) {

    process.addListener('uncaughtException', function (err) {
        console.error('Uncaught exception!');
        console.error(err.stack || err);
        process.exit(1)
    });

    app.listen(app.get('port'), function (){
        console.error('\x1b[32mGiver App\x1b[0m running on http://%s:%d',
        this.address().address,
        this.address().port);
    })


}
