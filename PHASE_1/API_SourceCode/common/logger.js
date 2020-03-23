const fs = require("fs");

class Logger {
  
  constructor(file = "../logs/log.txt") {
    this.file = file;
  }

  log(path, startTime, input, output) {
    const currentTime = new Date();
    const processTime = currentTime.getTime() - startTime.getTime();
    fs.appendFile(this.file, `New Request at: ${this.getTimeStamp(currentTime)}\nEndpoint: ${path}\nInput: ${input}\nOutput: ${output}\nProcess Time: ${processTime}ms`, () => {});
  }

  getTimeStamp(dateTime) {
    return dateTime.toISOString()
      .replace(/T/, " ")
      .replace(/Z/, "");
  }
}

module.exports = new Logger();