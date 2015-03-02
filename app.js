/**
 * Node Aplication to check if the given links in file
 * are under CC/SA rights or not
 * Author: Yogesh Joshi (iyogeshjoshi@gmail.com)
 * github: https://github.com/iyogeshjoshi/google-rights-checker.git
 **/
var request = require('request');
var $ = require('cheerio');

var limit = 3;
var query = "https://www.google.co.in/search?hl=en&as_q=http%3A%2F%2Fantoine.frostburg.edu%2Fchem%2Fsenese%2F101%2Fmeasurement%2Findex.shtml&as_epq=&as_oq=&as_eq=&as_nlo=&as_nhi=&lr=&cr=&as_qdr=all&as_sitesearch=&as_occt=any&safe=images&tbs=&as_filetype=&as_rights=%28cc_publicdomain%7Ccc_attribute%7Ccc_sharealike%29.-%28cc_noncommercial%7Ccc_nonderived%29";

request(query+"&num="+limit, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    parsedHTML = $.load(body);
    console.log(parsedHTML('cite._Rm')) // Show the HTML for the Google homepage.
  }
})
