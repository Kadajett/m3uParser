(function m3uParser() {
    'use strict';

    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const xhr = new XMLHttpRequest();
    const fs = require('fs');
    const Promise = require('promise');

    console.log("Starting M3U Parser 9000!");


    function openFile() {

        var promise = new Promise((resolve, reject) => {

            fs.readFile('./assets/m3uParser.m3u', 'utf8', function (err, data) {

                if (err) {

                    return reject(err);
                }
                return resolve(data);
            });
        });
        return promise;
    }

    function parseURI(raw) {
        let playlistArr = [];
        if (typeof raw == "string") {

            let extSplit = raw.split("EXT-X-STREAM-INF");
            extSplit.forEach((element) => {

                let tempArray = element.split("\n");
                if (tempArray.length > 2) {

                    playlistArr.push({
                        deets: tempArray[0],
                        uri: tempArray[1]
                    });
                }
            });
            // console.log("poop", playlistArr);
        }

        return playlistArr;
    }

    function parseDeets(arr) {

        arr.forEach((element) => {

            let tempStr = element.deets;
            element.parsedDeets = tempStr.split(",");
            element.parsedDeets.forEach((el) => {

                if (el.indexOf("BANDWIDTH") > -1) {
                    let tempStuff = el.split("=");
                    element.bandwidth = tempStuff[1];
                } else if (el.indexOf("RESOLUTION") > -1) {
                    let tempStuff = el.split("=");
                    element.resolution = tempStuff[1];
                } else if (el.indexOf("FRAME-RATE") > -1) {
                    let tempStuff = el.split("=");
                    element.frameRate = tempStuff[1];
                } else if (el.indexOf("CODECS") > -1) {
                    let tempStuff = el.split("=");
                    element.codec = tempStuff[1];
                }

                
            });

            delete element.parsedDeets;
            delete element.deets;
        });

        return arr;
    }

    function init() {

        openFile().then(
            (res) => {

                console.log(parseDeets(parseURI(res)));
            },
            (err) => {

                console.error(err);
            }
        );
    }

    init();
})();