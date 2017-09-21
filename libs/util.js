'use strict';

const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');

const clone = require('clone');
const cache = require('../config/cache.js');

const {
    SearchResult,
    HumanInfo,
    MovieInfo
} = require('../models/types.js');

function formatText (str) {
    return str.replace(/\s\s+/g, ' ').trim();
}

module.exports.formatText = formatText;


function replaceAll (s, oldS, newS) {
    return s.split(oldS).join(newS);
}

module.exports.replaceAll = replaceAll;


function split (s, delimiters) {
    if (typeof delimiters == 'string') {
        return s.split(delimiters);
    } else if (delimiters instanceof Array) {
        return s.split(new RegExp(delimiters.join('|'), 'g'))
            .filter(v => v);
    }
}

module.exports.split = split;


function genId (seedValue) {
    if (seedValue) {
        return uuidv5(seedValue + '', uuidv5.URL)
    } else {
        return uuidv4();
    }
}

module.exports.genId = genId;


function cacheImageURLs (data) {
    let d = clone(data);

    if (d instanceof HumanInfo) {
        for (var i=0; i<d.photos.length; i++) {
            let obj = d.photos[i];
            let id = genId(obj.url) + '.jpg';
            cache.set('image', id, obj);

            d.photos[i] = '/images/' + id;
        }

        return d;
    }

    else if (d instanceof MovieInfo) {
        for (var i=0; i<d.posters.length; i++) {
            let obj = d.posters[i];
            let id = genId(obj.url) + '.jpg';
            cache.set('image', id, obj);

            d.posters[i] = '/images/' + id;
        }

        for (var i=0; i<d.screenshots.length; i++) {
            let obj = d.screenshots[i];
            let id = genId(obj.url) + '.jpg';
            cache.set('image', id, obj);

            d.screenshots[i] = '/images/' + id;
        }

        for (var i=0; i<d.covers.length; i++) {
            let obj = d.covers[i];
            let id = genId(obj.url) + '.jpg';
            cache.set('image', id, obj);

            d.covers[i] = '/images/' + id;
        }

        return d;
    }

    else if (d instanceof SearchResult) {
        let results = [];
        d.results.forEach(r => {
            let r_cached = cacheImageURLs(r);
            results.push(r_cached);
        });
        d.results = results;

        return d;
    }

    else {
        return null;
    }
}

module.exports.cacheImageURLs = cacheImageURLs;


function cacheURLs (data) {
    let d = clone(data);

    if (d instanceof SearchResult) {
        for (var i=0; i<d.results.length; i++) {
            let obj = d.results[i];
            let footprint = d.getFootprint(obj);
            let id = genId(JSON.stringify(footprint));

            cache.set('id', id, footprint);
            d.results[i].url = id;
        }

        return d;
    }

    else {
        return null;
    }
}

module.exports.cacheURLs = cacheURLs;
