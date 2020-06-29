let expect = require("chai").expect;
let checkForSymmetry = require("../checkForSymmetry.js").isSymmetric;

describe("checkForSymmetry() checks if array is symmetric or not",() => {
    it("returns false if the input is not of type Array",()=>{
        let targetResult = false;
        let actualResult = checkForSymmetry("[1,2,2,1]");
        expect(targetResult).to.equal(actualResult);
    });
    it("returns true if array is symmetric",()=>{
        let targetRes = true;
        let actualResult = checkForSymmetry([1,2,2,1]);
        expect(targetRes).to.equal(actualResult);
    });
    it("returns false if array is asymmetric",() => {
        let targetRes = false;
        let actualResult = checkForSymmetry([1,2,2,11]);
        expect(targetRes).to.equal(actualResult);
    });

});