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

        country2 = "US";
        country3 = "DE";

        [acc1, project, acc3, ...addrs] = await ethers.getSigners();
        console.log("acc1 address:", acc1.address);
        console.log("project address:", project.address);


        Factory = await ethers.getContractFactory("PTokenFactory");  
        FactoryContract = await Factory.deploy();
        // console.log("Deploying token:")
        await FactoryContract.deployNewToken(name, symbol, vintage, standard, country);
        await FactoryContract.deployNewToken(name, symbol, vintage, standard, country2);
        response = await FactoryContract.getContracts();
        // console.log("logging getContracts()", response);
        // await FactoryContract.test();


        // NFT creation
        factory = await ethers.getContractFactory("CO2KenNFTCollection");
        NFTcontract = await factory.deploy();


        await NFTcontract.connect(project).requestMint("my offsetting project", "2018", "PRJ", 1000);

        const deedId = 1

        expect(deedId).to.equal(1);
        expect(await NFTcontract.ownerOf(deedId)).to.equal(project.address);
        console.log("Owner of NFT:", await NFTcontract.ownerOf(deedId));

        console.log(acc1.address, response[0]);


        console.log("balance project:", await NFTcontract.balanceOf(project.address));
        console.log("balance acc1:", await NFTcontract.balanceOf(acc1.address));
        console.log("balance acc3:", await NFTcontract.balanceOf(acc3.address));

        await NFTcontract.connect(project).transferFrom(project.address, acc1.address, 1);

        console.log("balance project:", await NFTcontract.balanceOf(project.address));
        console.log("balance acc1:", await NFTcontract.balanceOf(acc1.address));
        console.log("balance acc3:", await NFTcontract.balanceOf(acc3.address));

        await NFTcontract.connect(acc1).transferFrom(acc1.address, response[0], 1);

        console.log("balance project:", await NFTcontract.balanceOf(project.address));
        console.log("balance acc1:", await NFTcontract.balanceOf(acc1.address));
        console.log("balance pERC20:", await NFTcontract.balanceOf(response[0]));




    });

});
