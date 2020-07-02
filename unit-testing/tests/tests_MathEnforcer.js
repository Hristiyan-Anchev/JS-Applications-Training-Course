let mathEnforcer = require("../MathEnforcer.js").mathEnforcer;
let expect = require("chai").expect;

describe("mathEnforcer object performs operations with numbers and returns a result",()=>{
    describe("addFive() method tests",()=>{
        let addFive = mathEnforcer.addFive;
        it("returns undefined if the NaN is passed as param",()=>{
           expect(addFive("Not a number")).to.be.undefined;
        });
        it("returns number incremented by 5",()=>{
            expect(addFive(5)).to.equal(10);
        });
        it("returns correct result when negative number is passed",()=>{
            expect(addFive(-5)).to.equal(0);
        });
        it("returns correct value when floating point number is passed in",()=>{
            let targetResult = 6.2;
            expect(addFive(1.2)).closeTo(targetResult,0.001);
        });
    });
    describe("subtractTen() method tests",()=>{
        let subtractTen = mathEnforcer.subtractTen;
        it("returns undefined if not called with a number",()=>{
            expect(subtractTen("Not a number")).to.be.undefined;
        });
        it("returns a number decremented by 10",()=>{
            expect(subtractTen(10)).to.equal(0);
        });
        it("returns correct result when negative number is passed in",()=>{
            expect(subtractTen(-10)).to.equal(-20);
        });
        it("returns correct result when floating point number is passed in",()=>{
            expect(subtractTen(10.5)).to.be.closeTo(0.5,0.001);
        });
    });
    describe("sum() method tests",()=>{
        let sum = mathEnforcer.sum;
        it("returns undefined if either of the params are undefined",() => {
            expect(sum("NaN", 2),
                "invalid parameters").to.be.undefined;
            expect(sum(2, "Nan"),
                "invalid parameters").to.be.undefined;
        });
        it("returns the sum of the two numbers",()=>{
            let targetResult = 10;
            let actualResult = sum(5,5);
            expect(actualResult).to.be.closeTo(10,0.001);
        });
        it("returns correct sum of two floating point numbers",()=>{
            expect(sum(2.2, 2.2)).to.be.closeTo(4.4, 0.001);
        });
    });
});

