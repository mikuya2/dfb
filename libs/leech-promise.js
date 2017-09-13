'use strict';

const leech = require('./leech.js');

module.exports.get = function (url) {
    return new Promise(
        (resolve, reject) => {
            leech.get(url,
                (err, $) => {
                    if (err) return reject(err);
                    resolve($);
                })
        }
    )
};

module.exports.post = function (url, options) {
    return new Promise(
        (resolve, reject) => {
            leech.post(url, options,
                (err, $) => {
                    if (err) return reject(err);
                    resolve($);
                })
        }
    )
}

module.exports.retrieve = function (url, location) {
    return new Promise(
        (resolve, reject) => {
            leech.request(url, location,
                err => {
                    if (err) return reject(err);
                    resolve();
                })
        }
    )
}

module.exports.config = leech.config;
