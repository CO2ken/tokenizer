const { expect } = require("chai");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe("CO2KenNFTCollection", () => {
    let factory;
    let contract;
    let co2Ken;
    let project;
    let addr2;
    let addrs;

    beforeEach(async function () {
        factory = await ethers.getContractFactory("CO2KenNFTCollection");
        [co2Ken, project, addr2, other, ...addrs] = await ethers.getSigners();

        contract = await factory.deploy();
    });

    it("allows a project to request minting", async () => {
        await contract.connect(project).requestMint("my offsetting project", "2018", "PRJ", 1000);
        // TODO for some reason I cannot get the return of requestMint
        const deedId = 1

        expect(deedId).to.equal(1);
        expect(await contract.ownerOf(deedId)).to.equal(project.address);
        const data = await contract.nftData(deedId);
        expect(data.projectName).to.equal("my offsetting project");
        expect(data.vintage).to.equal("2018");
        expect(data.symbol).to.equal("PRJ");
        expect(data.CO2tons.toNumber()).to.equal(1000);
        expect(data.approved).to.equal(false);
    })

    it("allows a CO2Ken to approve minting", async () => {
        await contract.connect(project).requestMint("my offsetting project", "2018", "PRJ", 1000);
        // TODO for some reason I cannot get the return of requestMint
        const deedId = 1

        await contract.connect(co2Ken).approveMinting(deedId);
        // TODO for some reason I cannot get the return of approveMint

        const data = await contract.nftData(deedId);
        expect(data.approved).to.equal(true);

        const erc20 = await ethers.getContractAt("CO2KenNFTERC20", data.ERC20);
        expect((await erc20.balanceOf(project.address)).toNumber()).to.equal(1000);
        expect((await erc20.balanceOf(co2Ken.address)).toNumber()).to.equal(0);
        expect(await erc20.owner()).to.equal(contract.address);
    })

    it("does not allow someone else to approve the minting", async () => {
        await contract.connect(project).requestMint("my offsetting project", "2018", "PRJ", 1000);
        // TODO for some reason I cannot get the return of requestMint
        const deedId = 1

        await expect(contract.connect(project).approveMinting(deedId)).to.eventually.be.rejected
        await expect(contract.connect(addr2).approveMinting(deedId)).to.eventually.be.rejected
    })
})
