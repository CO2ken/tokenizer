const { expect } = require("chai");

describe("", () => {

    it("-- Testing PTokenFactory.sol ---", async function () {

        let name; 
        let symbol;
        let vintage;
        let standard;
        let country;


        name = "Colombia-Treefield"; 
        symbol = "CO-GS-16";
        vintage = "2016";
        standard = "GS";
        country = "CO";


        [acc1, acc2, acc3, ...addrs] = await ethers.getSigners();

        Factory = await ethers.getContractFactory("PTokenFactory");  
        FactoryContract = await Factory.deploy();
        console.log("Deploying token:")
        await FactoryContract.deployNewToken(name, symbol, vintage, standard, country);
        // await FactoryContract.test();



    });

});
