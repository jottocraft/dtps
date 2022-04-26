/**
 * @file DTPS development server
 * @author jottocraft
 *
 * @copyright Copyright (c) 2018-2022 jottocraft
 * @license MIT
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

//Serve root-level script
app.use('/init.js', express.static('init.js'));

//Serve UI files
app.use('/dtps.css', express.static('ui/dtps.css'));
app.use('/fluid/fluid.css', express.static('ui/fluid.css'));
app.use('/fluid/fluid.js', express.static('ui/fluid.js'));

//Serve www
app.use('/', express.static('www'));

app.listen(port, () => {
    console.log("The Power+ development server is listening on port " + port);
    console.log("\nGo to Settings -> About -> Advanced Options -> Enable debug config in Power+ to enable debug mode");
    console.log("Read CONTRIBUTING.md for more information");
});