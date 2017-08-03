// add jsdom support, which is required for enzyme
const {JSDOM} = require ('jsdom');

global.dom = new JSDOM ('<!doctype html><html/>');
global.window = dom.window;
global.document = global.window.document;

// mocha-cli requires stub for jsdom > 8.0
global.console.debug = () => {}

global.navigator = {
    userAgent: 'Mozilla (Macintosh; Intel Mac OS X)' +
    ' AppleWebKit (KHTML, like Gecko) Chrome Safari'
};

process.on ('unhandledRejection', (error) => {
    console.error ('Unhandled Promise Rejection:');
    console.error (error && error.stack || error);
});