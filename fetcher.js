const request = require("request");
const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let isValid = require("is-valid-path");

const writeToFile = (data, fileName) => {
  fs.writeFile(fileName, data, (error) => {
    if (error) {
      throw error;
    }
    console.log(
      `Downloaded and saved ${fs.statSync(fileName).size} bytes to ${fileName}`
    );
    process.exit();
  });
};

const requestFunc = (url, fileName, callback) => {
  request(url, (error, response, body) => {
    if (error || response.statusCode !== 200) { 
      // check the error first, coz if there is an error, then the porgram doesn't even need to check the statusCode
      console.log("the url is not working");
      process.exit();
    }
    fs.stat(fileName, (err) => {
      if (!err) {
        rl.question(
          "The file already exist, do you want to overwrite the file?Y for yes : ",
          (data) => {
            if (data === "y" || data === "Y") {
              console.log(`Thank you for your answer: ${data}`);
              callback(body, fileName);
            } else {
              process.exit();
            }
          }
        );
      } else if (err.code === "ENOENT") {
        if (!isValid(fileName)) {
          console.log("This is not a valid file path");
          process.exit();
        }
        console.log("file does not exist.");
        callback(body, fileName); // download the file;
      }
    });
  });
};

requestFunc(process.argv[2], process.argv[3], writeToFile);

