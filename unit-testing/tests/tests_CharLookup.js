let {lookupChar} = require("../CharLookup");
let expect = require("chai").expect;

describe("grabs a char by given index",()=>{
    it("returns undefined if first param != string, second param = number",()=> {
            let notAString = {1:"Not a string"};
            let queryIdx = 1;
            let actualResult = lookupChar(notAString,queryIdx);
            expect(actualResult).to.be.undefined;
    });

    it("returns undefined if first param = string, second param NaN",()=>{
        let actualResult = lookupChar("pick a char","1");
        expect(actualResult).to.be.undefined;
    });

    it("returns undefined if both params are invalid",()=>{
        let actualResult = lookupChar(123,"123");
        expect(actualResult).to.be.undefined;
    });

    it("returns error message if idx is larger than the length",() => {
        let idx = 5;
        let targetResult = "Incorrect index";
        let actualResult = lookupChar("1234",idx);

        expect(targetResult).to.equal(actualResult);
    });
    it("returns error message if idx is negative",() => {
        let idx = -2;
        let targetResult = "Incorrect index";
        let actualResult = lookupChar("1234",idx);

        expect(targetResult).to.equal(actualResult);
    });
    it("returns the character at the given index",() => {
        let idx = 8;
        let targetResult = "a";
        let actualResult = lookupChar("give me a character",idx);

        expect(targetResult).to.equal(actualResult);
    });
    it("incorrect idx if floating point number is passed as idx",()=>{

        let actualResult = lookupChar("abc",1.5);

        expect(actualResult).to.be.undefined;
    });
});