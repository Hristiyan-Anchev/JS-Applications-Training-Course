let expect = require("chai").expect;
let PaymentPackage = require("../PaymentPackage.js").PaymentPackage

describe("payment package class functionality tests", () => {
    describe("constructor tests", () => {
        it("test if constructor sets values properly", () => {
            let instance = new PaymentPackage("payment", 22);
            expect(instance.name).to.equal("payment");
            expect(instance.value).to.equal(22);
            expect(instance.VAT).to.equal(20);
            expect(instance.active).to.equal(true);

            expect(instance._name).to.equal("payment");
            expect(instance._value).to.equal(22);
            expect(instance._VAT).to.equal(20);
            expect(instance._active).to.equal(true);
        });
        it("test if constructor responds with error to invalid input", () => {
            expect(() => {
                new PaymentPackage(123, 22);
            }).to.throw;

            expect(() => {
                new PaymentPackage("", 22);
            }).to.throw;

            expect(() => {
                new PaymentPackage("payment", "23");
            }).to.throw;

            expect(() => {
                new PaymentPackage("payment", -22);
            }).to.throw;

            expect(() => {
                new PaymentPackage("payment",);
            }).to.throw;

        });
    });
    describe("testing setters outside constructor", () => {
        let instance;
        beforeEach(() => {
            instance = new PaymentPackage("myName", 10);
        });

        it("tests setName()", () => {
            instance.name = "name changed";
            expect(instance.name).to.equal("name changed");

            expect(() => {
                instance.name = "";
            }).to.throw;

        })

        it("tests setValue()", () => {
            expect(() => {
                instance.value = "55";
            }).to.throw;

            expect(() => {
                instance.value = -5;
            }).to.throw
        });

        it("tests VAT()", () => {
            expect(() => {
                instance.VAT = "VAT";
            }).to.throw
            expect(() => {
                instance.VAT = -2;
            }).to.throw
        });

        it("tests active()", () => {
            expect(() => {
                instance.active = "true"
            }).to.throw;
        });

    });
    describe("testing getters", () => {
        it("checks the internal state of the instance", () => {
            let instance = new PaymentPackage("payment", 20);
            let name = "PAYMENT";
            let value = 10;
            let VAT = 5;
            let active = false;

            instance.name = name
            instance.value = value;
            instance.VAT = VAT;
            instance.active = active;
            let checkInstanceState = () => {
                let gettersOk = instance.name === name
                    && instance.value === value
                    && instance.VAT === VAT
                    && instance.active === active

                let privateVariablesOk = instance._name === name
                    && instance._value === value
                    && instance._VAT === VAT
                    && instance._active === active && (typeof instance._active === "boolean");

                return privateVariablesOk && gettersOk;
            }
            let instanceStateOk = checkInstanceState();

            expect(instanceStateOk).to.be.true;
        });
    });
    describe("testing toString()", () => {
        it("toString returns the correct value", () => {
            let instance = new PaymentPackage("pay", 20);
            let packageActiveResult = ["Package: pay",
                "- Value (excl. VAT): 20",
                "- Value (VAT 20%): 24"
            ].join("\n");
            expect(instance.toString()).to.equal(packageActiveResult);

            instance.active = false;
            let packageInactiveResult = ["Package: pay (inactive)",
                "- Value (excl. VAT): 20",
                "- Value (VAT 20%): 24"
            ].join("\n");

            expect(instance.toString()).to.equal(packageInactiveResult);
        });
    });

});