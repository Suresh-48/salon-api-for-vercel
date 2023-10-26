export function  getRandomNumberForSession (){
    return Math.random().toString(30).substring(2,8) + Math.random().toString(30).substring(2, 8);
  };