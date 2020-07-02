let expect = require("chai").expect;
let evenOrOdd = require("../EvenOrOdd.js").isOddOrEven

describe("evenOrOdd() checks is given string length is odd or even",() =>{
    it("returns undefined if argument is not string",()=>{
        let actualResult = evenOrOdd(60065);
        expect(actualResult).to.undefined;
    });
    it("returns the string 'even' if passed string's length is even number",()=>{
       let targetResult = "even";
       let actualResult = evenOrOdd("1234");
       expect(actualResult).to.equal(targetResult);
    });
    it("returns the string 'odd' if passed string's length is odd number",()=>{
    });
});