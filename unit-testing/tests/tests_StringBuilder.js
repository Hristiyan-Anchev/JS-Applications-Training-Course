let expect = require("chai").expect;
let StringBuilder = require("../stringBuilder.js").StringBuilder;


describe("StringBuilder class that facilitates string manipulations", () => {
    let inst;
    beforeEach(function () {
        inst = new StringBuilder("");
    });
    // testing constructor
    it("passing no value to the constructor ", () => {
        expect(new StringBuilder()._stringArray.length).to.equal(0);
        expect(new StringBuilder()._stringArray).to.deep.equal([]);
    });
    it("passing non-string value to the constructor throws an error", () => {
        expect(new StringBuilder()).to.throw;
    });
    it("creating instance with empty string initializes properly", () => {
        let tergetResult = [];
        console.log(inst);
        expect(inst._stringArray[0]).to.be.undefined;
        expect(inst._stringArray.length).to.equal(0);

    });
    it("creating instance with non-empty string initializes properly", () => {
        let someString = "non-empty";
        inst = new StringBuilder(someString);
        let instanceStorageArray = inst._stringArray;
        expect(instanceStorageArray.length).to.equal(someString.length);
        expect(inst.toString()).to.equal(someString);

    });

    //testing append function
    it("invoking append() with no input throws an error",()=>{
            expect(inst.append).to.throw;
    });
    it("append() modifies _stringArray properly",()=>{
        inst.append("lol");
        expect(inst._stringArray.length).to.equal(3);
        expect(inst.toString()).to.equal("lol");
    });

    //testing prepend
    it("invoking prepend() with no input throws an error",()=>{
        expect(inst.prepend).to.throw;
    });
    it("prepend() modifies _stringArray properly",()=>{
        inst.prepend("lolz");
        expect(inst._stringArray.length).to.equal(4);
        expect(inst.toString()).to.equal("lolz");
    });

    //testing insertAt
    it("inserts character at the right index",()=>{
        inst.append("acd");
        inst.insertAt("b",1);
        expect(inst.toString()).to.equal("abcd");

        //negative idx
        inst.insertAt("f",-1);
        expect(inst.toString()).to.equal("abcfd");

        //larger than string length idx
        inst.insertAt("h",6);
        expect(inst.toString()).to.equal("abcfdh");
    });
    it("throws error if no string passed to the function",()=>{
        expect(inst.insertAt).to.throw;
    });
    it("length of _stringArray is correct",()=>{
        inst.insertAt("a",0);
        expect(inst._stringArray.length).to.equal(1);
    });

    //testing remove
    it("removes characters properly",()=>{
        let innerStructure = inst._stringArray;
        let someString = "some chars";
        inst.append(someString);

        inst.remove(0,1);
        expect(innerStructure.length).to.equal(someString.length - 1);
        expect(inst.toString()).to.equal(someString.substring(1));

        inst.remove(-1,1);
        expect(innerStructure.length).to.equal(someString.length - 2);
        expect(inst.toString()).to.equal(someString.substring(1,someString.length -1));
    });

    //testing toString
    it("returns correct string representation",()=>{
        let a = inst.toString();
        expect(a).to.equal("");
        inst.append("myString");
        expect(inst.toString()).to.equal("myString");
    });
});


