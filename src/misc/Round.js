/**
  Round off a number 'n' to a number of digits 'd' (default is 4)
*/
module.exports = (n,d)=>{
  const D = d || 4, f = Math.pow(10,D);
  return Math.round(n*f)/f;
};
