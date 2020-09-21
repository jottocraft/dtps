/**
 * @file DTPS development server
 * @author jottocraft
 *
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */

const express = require('express');
const app = express();

var port = 2750;

//Check CLI args
process.argv.forEach(arg => {
    if (arg.startsWith("--port=")) {
        port = Number(arg.replace("--port=", ""));
    }
})

//Serve dev
app.get('/dtps/dev', function(req, res) {
    res.send(true);
});

//Serve scripts
app.use('/scripts', express.static('scripts'));

//Serve root-level scripts
app.use('/init.js', express.static('init.js'));
app.use('/dtps.css', express.static('dtps.css'));

//Serve www
app.use('/', express.static('www'));

app.listen(port, () => {
    console.log("The Power+ development server is listening on port " + port);
    console.log("\nGo to Settings -> About -> Advanced Options -> Debug mode in Power+ to enable debug mode");
    console.log("Read CONTRIBUTING.md for more information");
});