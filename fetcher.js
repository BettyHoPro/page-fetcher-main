const request = require("request");
const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let isValid = require("is-valid-path");
let isURLValid = require("valid-url");
const urlStatusCode = require("url-status-code");

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

const checkURL = (url) => {
  if (isURLValid.isUri(url)) {
    urlStatusCode(url, (error, statusCode) => {
      if (error) {
        console.log("The link is not working...");
        process.exit();
      } else {
        requestFunc(process.argv[2], process.argv[3], writeToFile);
      }
    });
    requestFunc(process.argv[2], process.argv[3], writeToFile);
  } else {
    console.log("The link is not working... God, this is so close");
    process.exit();
  }
};

checkURL(process.argv[2]);
