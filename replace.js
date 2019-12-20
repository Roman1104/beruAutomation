const fs = require('fs');
const path = require('path');
//read all results files
fs.readdir('./allure-results/', function(err, fileList) {
  if (!err) {
    for (i in fileList) {
      let filePath = path.join(__dirname, 'allure-results', fileList[i]);
      fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data) {
        if (!err) {
          //replace complex message elements in failures
          let newData = data;
          //offset used to continue search in the rest part
          let restPartOffset = 0;
          let restPart = newData.substring(restPartOffset, newData.length);
          let failure;
          while ((failure = restPart.match(/<failure>.*?<\/failure>/s))) {
            //if failure contains complex message
            if (/<message>.*<message>/s.test(failure[0])) {
              let innerPart = failure[0].replace(
                /(<message>)(?:.*<message>)(.*?)(?:<\/message>.*?)(<\/message>)/s,
                '$1$2$3'
              );
              //replace content with simple message
              newData =
                newData.substring(0, restPartOffset + failure.index) +
                innerPart +
                newData.substring(
                  restPartOffset + failure.index + failure[0].length
                );
              //set to search in the rest part of the file (after replaced part)
              restPartOffset =
                restPartOffset + failure.index + innerPart.length;
            } else {
              //set to search in the rest part of the file (after found part)
              restPartOffset =
                restPartOffset + failure.index + failure[0].length;
            }
            restPart = newData.substring(restPartOffset, newData.length);
          }
          //replace the file contents
          fs.writeFile(filePath, newData, err => {
            if (err) console.log(err);
          });
        } else {
          console.log(err);
        }
      });
    }
  } else {
    console.log(err);
  }
});
