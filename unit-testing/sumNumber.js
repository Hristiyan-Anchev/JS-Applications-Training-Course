function sum(arr){
    let sum = 0 ;
    for(let num of arr){
        if(typeof num !== "number"){
            return Number.NaN;
        }
        sum+= Number(num);
    }
    return sum;
}

console.log(sum(["asd", 2, 3]));
Object.assign(module.exports,{
    sum
});