var exercise = {};
var fetch = require('node-fetch');
var cheerio = require('cheerio');
var request = require('request');
var rp = require('request-promise');
var minify = require('html-minifier').minify;
var path = require('path'); 
var fs = require('fs');

exercise.one = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Return the address of all the html pages in
    //  the MIT course catalog - string array.
    //  For example, the first page for Course 1 is:
    //  http://student.mit.edu/catalog/m1a.html
    //
    //  See homework guide document for more info.
    // -----------------------------------------------

    ///////// trying to do it without relying on local file changes ///////

    //1. using promises
    // var indexPageUrls = [];
    // var indexPageRequestOptions = {
    //     uri: 'http://student.mit.edu/catalog/index.cgi',
    //     transform: function(body){
    //         return cheerio.load(body);
    //     }
    // };

    // rp(indexPageRequestOptions)
    //     .then(function($){
    //         var urls = [];
    //         links = $('a');

    //         $(links).each(function(index, link){
    //             if($(link).attr('href').toString().startsWith("m")){
    //                 urls.push($(link).attr('href').toString());
    //             }
    //         });
    //         indexPageUrls = urls;
    //         return urls;
    //     })
    //     .catch(function(){
    //         console.log("request-promise failed");
    //     });

    //     console.log(indexPageUrls); //prints "[]" (an empty array)
    
    
    ///2. using normal request
    // var urls = [];
    // var indexPageRequest = request('http://student.mit.edu/catalog/index.cgi', function(error, response, body){
    //     console.log('error:', error);
    //     console.log('statusCode:', response.statuscode);
    //     return response;
    //     // $ = cheerio.load(body);
    //     // links = $('a');
    //     // $(links).each(function(index, link){
    //     //     if($(link).attr('href').toString().startsWith("m")){
    //     //         urls.push($(link).attr('href').toString());
    //     //     }
    //     //   });
    // });
    


    ////3. using local files and after removing the copy right symbol //////
    //var indexPageRequest = request('http://student.mit.edu/catalog/index.cgi').pipe(fs.createWriteStream('index.html'));
    var indexPageData = fs.readFileSync(path.join(__dirname,'index-clean.html') ,{encoding: 'utf-8'});
    var $ = cheerio.load(indexPageData);
    links = $('a');
    var urls = [];
    $(links).each(function(index, link){
        if($(link).attr('href').toString().startsWith("m")){
            urls.push($(link).attr('href').toString());
        }
    });

    urls.pop();
    urls.forEach((url, index,urls) => {
        urls[index] = "http://student.mit.edu/catalog/" + url;
    });

    console.log(urls);

};

exercise.two = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Download every course catalog page.
    //
    //  You can use the NPM package "request".
    //  Or curl with the NPM package shelljs.
    //
    //  Save every page to "your_folder/catalog"
    //
    //  See homework guide document for more info.
    // -----------------------------------------------
};

exercise.three = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Combine all files into one,
    //  save to "your_folder/catalog/catalog.txt"
    //
    //  You can use the file system API,
    //  https://nodejs.org/api/fs.html
    //
    //  See homework guide document for more info.
    // -----------------------------------------------
};

exercise.four = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Remove line breaks and whitespaces
    //  from the file. Return a string of
    //  scrubbed HTML. In other words, HTML without
    //  line breaks or whitespaces.
    //
    //  You can use the NPM package "html-minifier".
    //
    //  See homework guide document for more info.
    // -----------------------------------------------
};

exercise.five = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Load your scrubbed HTML into the DOM.
    //  Use the DOM structure to get all the courses.
    //
    //  Return an array of courses.
    //
    //  You can use the NPM package "cheerio".
    //
    //  See homework guide document for more info.
    // -----------------------------------------------
};

exercise.six = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Return an array of course titles.
    //
    //  You can use the NPM package cheerio.
    //
    //  See homework guide document for more info.
    // -----------------------------------------------
};

exercise.seven = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Filter out punctuation, numbers,
    //  and common words like "and", "the", "a", etc.
    //
    //  Return clean array.
    //
    //  See homework guide document for more info.
    // -----------------------------------------------
};

exercise.eight = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Make an array of words from the titles.
    //
    //  Return array of words.
    //
    //  See homework guide document for more info.
    // -----------------------------------------------
};

exercise.nine = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Count the word frequency.
    //
    //  Return a word count array.
    //
    //  See homework guide document for more info.
    // -----------------------------------------------
};


module.exports = exercise;
