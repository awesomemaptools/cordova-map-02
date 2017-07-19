'use strict';
const log = require('./ConsoleLog');
module.exports = o => {
  let r = false;
  for(let k in o){
    if(typeof o[k] === 'undefined'){
      log('ObjectCheckProps: ' +k + ' is undefined');
      r = true;
    }
  }
  return r;
};
