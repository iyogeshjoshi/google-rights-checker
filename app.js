/**
 * Node Aplication to check if the given links in file
 * are under CC/SA rights or not
 * Author: Yogesh Joshi (iyogeshjoshi@gmail.com)
 * github: https://github.com/iyogeshjoshi/google-rights-checker.git
 **/
 // required files
var request = require('request');
var async = require('async');
var $ = require('cheerio');
var fs = require('fs');
var csv = require('csv');

// check for file parameter
if(process.argv.length < 3){
  console.error("Please provide 'csv' file name eg: node app.js /path/to/csv-file");
  process.exit(1);
}
// Reads CSV file
var readFile = function(err, data){
  if(err) console.error(err);
  parseCsv(data, writeFile);
}
// writes output to the CSV file
var writeFile = function(err, data){
  if(err) console.error(err);
  fs.writeFile(process.argv[2], data, function(err){
    if(err) console.error(err);
    console.log('Result saved to file: '+process.argv[2]);
  })
}
// file read config
var fileOptions = {
  encoding: 'utf-8',
  flag: 'r+'
}
// reads the given file
fs.readFile(process.argv[2], fileOptions, readFile);

// scrapper function
var parseBody = function(err, res, html){
  if(err) return console.error(err);
  if (!err && res.statusCode == 200) {
    parsedHTML = $.load(html);
    // parse/scrap and get links from html
    parsedHTML('cite', 'body').map(function(i, elem){
      elem = $(elem).text();
      results.push(elem);
    });
    return results;
  }
}
// make request and gets html from google.com
var getHTML = function(row, cb){
  var results = [];
  var limit = 3;
  request(row.query+"&num="+limit, function(err, res, html){
    if(err) return cb(err);
    if (!err) {
      // loads the html result to parser
      parsedHTML = $.load(html);
      // parse/scrap and get links from html
      parsedHTML('cite', 'body')
      .map(function(i, elem){
        elem = $(elem).text();
        // checks is the cc-sa links matches or not
        row['cc-sa'] = (elem.indexOf(row.domain) > 0).toString();
        results.push(elem);
      });

      results.map(function(res, i){
        url_index = i+1;
        row['url'+url_index] = res;
      })
      cb(null, row);
    }
  });
}

// parses csv data from string
var parseCsv = function(input, cb){
  var parseOptions = {
    trim: true,
    skip_empty_lines: true,
    columns: true
  };
  // parse csv string
  csv.parse(input, parseOptions, function(err, output){
    async.map(output, getHTML, function(err, results){
      // Stringify options
      var stringifyOptions = {
        header: true,
      }
      // convert array to csv string
      csv.stringify(results, stringifyOptions, writeFile)
    })
  });
}
