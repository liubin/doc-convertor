var qiniu = require('qiniu');
var exec = require('child_process').exec;
var fs = require('fs');
var path2 = require('path')

/**
* get upload token
*/
function uptoken(bucketname) {
  var putPolicy = new qiniu.rs.PutPolicy({scope: bucketname});
  return putPolicy.token();
}

/**
* upload file to bucket
*/
function upload(file, key, token){
  var extra = new qiniu.io.PutExtra();

  qiniu.io.putFile(token, key, file, extra, function(err, ret) {
    if(!err) {
      // upload ok
      console.log(ret.key + ': ' + ret.hash);
    } else {
      // upload error
      console.log(err);
      process.exit(-2); // upload error
    }
  });
}

function uploadFiles(path){
  var bucketname = process.env.QINIU_BUCKET_NAME;
  if(!bucketname){
    // console.log('need not to upload to qiniu');
    return;
  }

  // console.log('puts ' + path);
  var files = fs.readdirSync(path);
  var token = uptoken(bucketname);

  var pageCount = 0;
  for(var f in files){
    var file = path + '/' + files[f];
    upload(file, file, token);
    //console.log('puts ' + file);
    var ext = path2.extname(file);
    if(ext == '.png'){
      pageCount++;
    }
  }

  console.log('page_count: ' + pageCount);

}

/**
* get file name with ext.
* getFileNameWithoutExt('/tmp/abc.txt') will return 'abc';
*/
function getFileNameWithoutExt(file){
  var f = file.substring(file.lastIndexOf('/'));
  return f.substring(1, f.lastIndexOf('.'));
}

/**
* step 2: convert pdf to png files
*/
function convert2png(pdf, target){
  // pdf to png
  var f = getFileNameWithoutExt(pdf);

  cmd = 'convert ' + pdf + ' ' + target + '/' + f + '-%03d.png';
  exec(cmd, function callback(error, stdout, stderr) {
    if(error == null){
        uploadFiles(target);
    } else {
        console.log('convert to png error');
        console.log(error);
        process.exit(-1); // convert error
    }
  });
}

/**
* step 1: convert doc to pdf (if not a pdf file)
*/
function convert2pdf(path, target){

  // doc to pdf
  var cmd = 'libreoffice --headless --convert-to pdf '
    + path + ' --outdir ' + target;
  exec(cmd, function callback(error, stdout, stderr) {
    if(error == null){
      var i = path.lastIndexOf('.');
      var pdf = path.substr(0, i) + '.pdf';
      convert2png(pdf, target);
    } else {
        console.log('convert to pdf error');
        console.log(error);
        process.exit(-1); // convert error
    }

  });

}

// entry function
function main(){

  var path = process.env.DOC_PATH;
  var files = fs.readdirSync(path);

  for(var f in files){
    var file = path + '/' + files[f];
    var ext = path2.extname(file);
    if(ext == '.pdf'){
      convert2png(file, path);
    } else if (ext == '.png'){
      // what to do?
    } else {
      convert2pdf(file, path);
    }
    // console.log('convert ' + file);
  }

}

// set access key and secret
qiniu.conf.ACCESS_KEY = process.env.QINIU_ACCESS_KEY;
qiniu.conf.SECRET_KEY = process.env.QINIU_SECRET_KEY;

main();
