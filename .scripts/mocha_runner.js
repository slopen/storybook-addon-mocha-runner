process.env.NODE_ENV = 'development';

require ('babel-register') ();
require ('babel-polyfill');

require ('./user/pretest.js');
