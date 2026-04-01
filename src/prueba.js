"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var log = console.log;
// Combine styled and normal strings
log(chalk_1.default.blue("Hello") + " World" + chalk_1.default.red("!"));
// Compose multiple styles using the chainable API
log(chalk_1.default.blue.bgRed.bold("Hello world!"));
// Pass in multiple arguments
log(chalk_1.default.blue("Hello", "World!", "Foo", "bar", "biz", "baz"));
// Nest styles
log(chalk_1.default.red("Hello", chalk_1.default.underline.bgBlue("world") + "!"));
// Nest styles of the same type even (color, underline, background)
log(chalk_1.default.green("I am a green line " +
    chalk_1.default.blue.underline.bold("with a blue substring") +
    " that becomes green again!"));
