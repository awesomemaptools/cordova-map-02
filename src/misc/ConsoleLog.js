'use strict';
/**
  Convenient way of logging values to console with less typing.
  Require / import eg as log and type:
    const myValue = { foo: 'Foo and bar!'};
    const myStr = 'This is my string!';
    log({myValue});
    log({myStr});
    log(myStr);
  Outputs: 
    ConsoleLog: myValue = [object Object] { foo: 'Foo and bar!' }
    ConsoleLog: myStr = This is my string! This is my string!
    ConsoleLog: This is my string!
*/
module.exports = function(o){ 
  if(typeof o ==='string'){
    console.log('[ConsoleLog] ' + o);
    return;
  }
  for(let k in o){
    (typeof o[k] === 'string' || typeof o[k] === 'number') ? 
      console.log('[ConsoleLog] ' + k + ' = ' + o[k]) :
      console.log('[ConsoleLog] ' + k + ' = ' + o[k], o[k]) ; 
  } 
};
