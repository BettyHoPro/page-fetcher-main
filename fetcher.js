const request = require("request");
const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
        console.log("file already exist");
        rl.question("The file already exist, do you want to over write the file? Y for yes : ", (data) => {
          if (data === "y" || data === "Y") {
            console.log(`Thank you for your answer: ${data}`);
            callback(body, fileName);
          } else {
            process.exit();
          }
        });
        
      } else if (err.code === "ENOENT") {
        console.log("file does not exist");
        callback(body, fileName); // download the file;
      }
    });
   
  });
};

requestFunc(process.argv[2], process.argv[3], writeToFile);
