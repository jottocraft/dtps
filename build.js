/**
 * @file DTPS predeploy script
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 * 
 * This script file minifies DTPS and generates docs
 */

//Import modules
const { minify } = require("terser");

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const glob = require("glob");
const mkdirp = require('mkdirp');
const rimraf = require("rimraf");
const ncp = require('ncp').ncp;
const dev = process.argv.includes("--dev");

//Delete existing build folder
rimraf.sync("./build/*");

//Run functions
if (dev) {
    console.log("\n[1/3] Skipping minification (dev)");
    copyStatic();
} else {
    minifyJS();
}

//[1/3] Minify JavaScript
function minifyJS() {
    console.log("\n[1/3] Minifying JavaScript...");

    //Minify files function
    async function minifyFile(filePath) {
        //Run terser
        var results = await minify({
            [filePath]: fs.readFileSync(filePath, "utf8")
        }, {
            sourceMap: {
                url: "/" + filePath + ".map",
                includeSources: true,
                root: "/"
            }
        });

        //Make parent folder
        mkdirp.sync(path.join("build", filePath, ".."));

        //Write output files
        fs.writeFileSync(path.join("build", filePath), results.code, "utf8");
        fs.writeFileSync(path.join("build", filePath + ".map"), results.map, "utf8");
    }

    //Minify files
    minifyFile("init.js");
    glob.sync("scripts/**/*.js").forEach(file => {
        minifyFile(file);
    });

    console.log("[1/3] Done");
    copyStatic();
}

//[2/3] Copy static files
function copyStatic() {
    console.log("\n[2/3] Copying static files...");

    //Make build folder if it doesn't already exist
    mkdirp.sync("build");

    //Copy dtps.css
    fs.copyFileSync("dtps.css", "build/dtps.css");

    //Write CNAME
    fs.writeFileSync(path.join("build", "CNAME"), dev ? "dev.dtps.jottocraft.com" : "powerplus.app", "utf8");

    //Copy www
    ncp("www", "build", function () {
        if (dev) {
            //Copy dev assets
            ncp("www/dev", "build", function () {
                //Copy JS without minification
                fs.copyFileSync("init.js", "build/init.js");
                ncp("scripts", "build/scripts", function () {
                    console.log("[2/3] Done");
                    generateDocs();
                });
            });
        } else {
            //Remove dev assets for stable build
            rimraf.sync("./build/dev/*");

            console.log("[2/3] Done");
            generateDocs();
        }
    });
}

//[3/3] Generate documentation
function generateDocs() {
    console.log("\n[3/3] Generating documentation...");

    //Make build folder if it doesn't already exist
    mkdirp.sync("./build/docs");

    //Generate docs
    var docConf = "./docs/jsdoc.conf.json";
    if (dev) docConf = "./docs/jsdoc.dev.conf.json";

    var cp = exec("node ./node_modules/jsdoc/jsdoc.js -r scripts -d ./build/docs -c " + docConf + " -t ./node_modules/foodoc/template -R ./docs/README.md", function (e, o) {
        if (e) console.error(e);
        if (o) console.log(o);
    });

    //Listen for exit
    cp.addListener("close", function () {
        console.log("[3/3] Done");
        finish();
    });
}

function finish() {
    console.log("\nAll build tasks have finished");
}