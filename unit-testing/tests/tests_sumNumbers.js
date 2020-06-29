let expect = require("chai").expect;
let sum = require("../sumNumber").sum;

describe("sum(arr) returns the sum of array of numbers",function(){
    it("should returns 6 when called with [1,2,3]",()=>{
        let expectedResult = 6;
        let actualSum = sum([1,2,3]);
        expect(actualSum).to.be.equal(expectedResult);
    });
    it("should return 0 when called with empty array",() => {
        let targetResult = 0;
        let actualResult = sum([]);
        expect(targetResult).to.equal(actualResult);
    });
    it("should return NaN if array doesnt consist of numbers only",()=>{
        let targetResult = NaN;
        let actualResult = sum(["adas",1,3,5]);
        expect(targetResult).NaN
    });
});


