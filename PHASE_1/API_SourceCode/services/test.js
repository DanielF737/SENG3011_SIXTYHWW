const userService = require("./userService");

userService.getFeed("1").then(res => console.log(res));