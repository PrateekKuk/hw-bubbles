var exercise = {};
var fetch = require('node-fetch');
var cheerio = require('cheerio');
var request = require('request');
var rp = require('request-promise');
var minify = require('html-minifier').minify;
var request_sync = require('sync-request');
var fs = require('fs');

var urls = [];

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

    ///////// Note: I did excerise.one 3 different ways to learn each way ///////
    ////Instead of pushing urls to an array manually, I chose to scrape the index page

    //1. using promises
        // var flag = 0;
        // var indexPageUrls = [];
        // var indexPageRequestOptions = {
        //     uri: 'http://student.mit.edu/catalog/index.cgi',
        //     transform: function(body){
        //         return cheerio.load(body);
        //     },
        //     async:false
        // };

        // rp(indexPageRequestOptions)
        //     .then(function($){
        //         links = $('a');

        //         $(links).each(function(index, link){
        //             if($(link).attr('href').toString().startsWith("m")){
        //                 urls.push($(link).attr('href').toString());
        //             }
        //         });
        //     })
        //     .catch(function(){
        //         console.log("request-promise failed");
        //     });
    


     ///2. using callbacks 

        // var indexPageRequest = request('http://student.mit.edu/catalog/index.cgi',function(error, response, body){
        //     console.log('error:', error);
        //     console.log('statusCode:', response.statuscode);
        //     $ = cheerio.load(body);
        //     links = $('a');
        //     $(links).each(function(index, link){
        //         if($(link).attr('href').toString().startsWith("m")){
        //             urls.push($(link).attr('href').toString());
        //         }
        //       });
        // },function(){passingURLS();});
        
        // var passingURLS = function(){
        //     console.log(urls);
        // }

    ////3. using sync request  //////
    console.log("problem 1");
    var indexPageRequestData = request_sync('GET','http://student.mit.edu/catalog/index.cgi')
    fs.writeFileSync('index.html',indexPageRequestData.getBody().toString());

    var indexPageData = fs.readFileSync('index.html',{encoding: 'utf-8'});
    var $ = cheerio.load(indexPageData);
    links = $('a');
    $(links).each(function(index, link){
        if($(link).attr('href').toString().startsWith("m")){
            urls.push($(link).attr('href').toString());
        }
    });

    urls.pop();
    urls.forEach((url, index,urls) => {
        urls[index] = "http://student.mit.edu/catalog/" + url;
    });
    return urls;

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
    
    //sync method
    console.log("problem 2");
    urls.forEach((url, index, urls) => {
        var firstcut = "http://student.mit.edu/catalog/".length;
        var name = url.slice(firstcut,url.length);
        console.log(name + ":" + url);
        var eachPageRequestData = request_sync('GET',url);
        fs.writeFileSync('catalog/'+ name,eachPageRequestData.getBody().toString());
    });

    //aysnc method
        // const writeFile = (path, data, opts = 'utf8') =>
        //     new Promise((res, rej) => {
        //         fs.writeFile(path, data, opts, (err) => {
        //             if (err) rej(err)
        //             else res()
        //     })
        // })

        // var makeRequest = async function (url,counter) {
        //     var res = await fetch(url);
        //     var firstcut = "http://student.mit.edu/catalog/".length;
        //     var name = url.slice(firstcut,url.length);
        //     await writeFile('catalog/' + name, await res.text());
        //     return 'done - ' + name;        
        // };  

        // urls.forEach(function(url,i){
        //     makeRequest(url,i).then((result) =>{
        //         console.log(result);
        //     });    
        // })

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
    console.log("problem 3")
    //create empty file 
    //read each file in directory and append to file
    fs.writeFileSync('catalog/catalog.txt',"");
    fs.readdirSync('catalog').forEach((file) => {
        if(file[file.length-1] == 'l'){//only get files that end in html
            var fileString = "";
            fileString = fs.readFileSync('catalog/'+file,{encoding: 'utf-8'});
            fs.appendFileSync('catalog/catalog.txt',fileString);
        } 

    })


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
    console.log("problem 4");
     var catalog = fs.readFileSync('catalog/catalog.txt',{encoding: 'utf-8'});
     var catalogScrubbed = minify(catalog,{
         collapseWhitespace:true,
         minifyCSS:true,
         minifyJS:true
    });
    var catalogScrubbed_clean = catalogScrubbed.replace(/'/g,'')
    fs.writeFileSync('catalog/catalog_clean.txt',catalogScrubbed_clean);

    return catalogScrubbed_clean;
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
    console.log("problem 5");
    var courses = [];
    var catalogScrubbed = exercise.four();
    var $ = cheerio.load(catalogScrubbed);
    $('h3').each(function(index, course){
            courses.push($(course).text());
        });
    return courses;
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
    console.log("problem 6");
    var courses = exercise.five();
    var courseTitles = courses.map((course, index, courses) => {
        return course.match(/\s([a-zA-Z]+)/g);
    });
    courseTitles = courseTitles.filter(function(title){
        return title != null;
    });

    courseTitles.forEach(function(title,i,array){
        courseTitles[i] = courseTitles[i].join(" ");
    });
    return courseTitles;
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
    console.log("problem 7");
    var courseTitles = exercise.six();
    var cleanCourseTitles = courseTitles.map((value,i,arr)=>{
        return value.toLowerCase().replace(/ \bis\s|\band\s|\bof\s|\bin\s|\bthe\s|\ba\s|\bto\s|\bfor\s|\bi\S\W|\btopics\s/g,"")
    });
    return cleanCourseTitles;
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
    console.log("problem 8");
    var cleanCourseTitles = exercise.seven();

    //code below splits the titles into an array of words
    var wordsArray = cleanCourseTitles.map((value,i,arr) => {
        return value.split(" ");
    });
    //the code below converts it from being an array of arrays to one big array
    var wordsFlat = wordsArray.reduce(function(previous, current) {
        return previous.concat(current);
    }, []);

    //code below removes the empty strings that results from the split
    var finalWordsArray = wordsFlat.filter((value,i,arr) => {
        return value != "" && (value != "i" || value !="ii" || value != "iii");
    });
    return finalWordsArray;
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
    console.log("problem 9");
    var wordsArray = exercise.eight();
    var wordsCountObj = wordsArray.reduce((accumulator,current)=>{
        if(current in accumulator){
            accumulator[current] +=1;
        }else{
            accumulator[current]=1;
        }
        return accumulator;
    },{});
    var scores = JSON.stringify(wordsCountObj);
    fs.writeFileSync('catalogSample/catalog_data.js','var scores='+scores,'utf8');
    return scores;
};


module.exports = exercise;
