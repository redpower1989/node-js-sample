#!/usr/bin/env node


var rest = require('restler');
var fs = require('fs');
var program = require('commander');
var outfile = "hello.html";
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var CHECKSURL_DEFAULT="http://quiet-dusk-9705.herokuapp.com/";
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile= function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
}; 

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {

    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-i, --url <url>', 'Path to url',CHECKSURL_DEFAULT)
    
       .parse(process.argv);
if(program.url){
        var url = program.url.toString();                                                                                                                   
        rest.get(url).on('complete', function(result, response){                                                                                            

            fs.writeFileSync( outfile, result);                                                                                                             

            checkJson = checkHtmlFile(outfile, program.checks);                                                                                             

            var outJson = JSON.stringify(checkJson, null, 4);                                                                                               

            console.log(outJson);                                                                                                                           

        });    
}else{
    var checkJson = checkHtmlFile(program.file, program.checks);

    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
}
} else {
    exports.checkHtmlFile = checkHtmlFile;

}

                                                                                                                                                             
              
