const { expect } = require("chai");
// const { ethers } = require("hardhat-ethers");


describe("", () => {
  it("-- Overall deployment test flow ---", async function () {
    // ---------------------
    // Variables

    const name = "ProjectTreez";
    const symbol = "CO-GS-16";
    const vintage = 2016;
    const vintage2 = 2011;


    const projectIdentifier = "p001-CO-GS";
    const projectIdentifier2 = "p002-CO-GS";
    const serialNumber = "VCS-VCU-262-VER-BR-14-1686-01012017";


    // ---------------------
    // Create Blockchain Accounts;
    const [owner, project] = await ethers.getSigners();
    console.log("\n------ ACCOUNTs --------");
    console.log("Owner:", owner.address);
    console.log("Project:", project.address);


    // ---------------------
    // Deploying ContractRegistry
    console.log("\n----\nDeploying ContractRegistry...");
    factory = await ethers.getContractFactory("ContractRegistry");
    ContractRegistry = await factory.deploy();
    console.log("Registry address:", ContractRegistry.address);


    // ---------------------
    // Deploying BatchCollection
    console.log("\n----\nDeploying BatchCollection...");
    factory = await ethers.getContractFactory("BatchCollection");
    BatchCollection = await factory.deploy(ContractRegistry.address);

    // console.log("\nBatchCollection address:");
    // console.log(BatchCollection.address);

    await ContractRegistry.setBatchCollectionAddress(BatchCollection.address);
    expect(await ContractRegistry.batchCollectionAddress()).to.equal(BatchCollection.address);
    console.log("Setting verifier=owner");
    await BatchCollection.setVerifier(owner.address);


    // ---------------------
    // BatchNFT minting
    console.log("\nConnecting Project Account and mint Batch-NFT...");
    await BatchCollection.connect(project).mintBatchWithData(
      project.address,
      projectIdentifier,
      "2016",
      serialNumber,
      1000
    );

    const tokenId = 1;

    // Test that BatchNFT owner is the project account
    expect(await BatchCollection.ownerOf(tokenId)).to.equal(project.address);
    
    // Test  BatchNFT confirmation flow
    expect(await BatchCollection.getConfirmationStatus(tokenId)).to.equal(false);
    await BatchCollection.confirmRetirement(tokenId);
    expect(await BatchCollection.getConfirmationStatus(tokenId)).to.equal(true);


    // ---------------------
    // Deploying ProjectERC20Factory
    console.log("\n----\nDeploying ProjectERC20Factory:");
    factory = await ethers.getContractFactory("ProjectERC20Factory");
    // deploy and pass registry address to contructor
    ProjectERC20Factory = await factory.deploy(ContractRegistry.address);
    console.log(`setProjectERC20FactoryAddress(${ProjectERC20Factory.address})`);
    await ContractRegistry.setProjectERC20FactoryAddress(ProjectERC20Factory.address);
    expect(await ContractRegistry.projectERC20FactoryAddress()).to.equal(ProjectERC20Factory.address);


    // ---------------------
    // Deploying new pERC20 tokens
    console.log("Deploying new ProjectERC20 from template...");
    await ProjectERC20Factory.deployFromTemplate(tokenId);

    console.log("Deploy new ProjectERC20 token via ProjectERC20Factory...");
    await ProjectERC20Factory.deployNewToken(
      name,
      symbol,
      projectIdentifier,
      vintage2,
      ContractRegistry.address
    );
    
    // retrieve array with all ERC20 contract addresses
    pERC20Array = await ProjectERC20Factory.getContracts();
    console.log("logging getContracts()", pERC20Array);
    // expect(await ProjectERC20Factory.getContracts()).length.to.equal(2);


    // ---------------------
    // Sending BatchNFTs to pERC20 contract

    expect(await BatchCollection.balanceOf(project.address)).to.equal(1);
    expect(await BatchCollection.balanceOf(owner.address)).to.equal(0);
    expect(await BatchCollection.balanceOf(pERC20Array[0])).to.equal(0);

    // Sending BatchNFT from Project to Account 1
    await BatchCollection.connect(project).transferFrom(project.address, owner.address, 1);

    expect(await BatchCollection.balanceOf(project.address)).to.equal(0);
    expect(await BatchCollection.balanceOf(owner.address)).to.equal(1);
    expect(await BatchCollection.balanceOf(pERC20Array[0])).to.equal(0);

    // Sending BatchNFT from Account 1 to pERC20 contract
    await BatchCollection.connect(owner).transferFrom(owner.address, pERC20Array[0], 1);

    expect(await BatchCollection.balanceOf(project.address)).to.equal(0);
    expect(await BatchCollection.balanceOf(owner.address)).to.equal(0);
    expect(await BatchCollection.balanceOf(pERC20Array[0])).to.equal(1);

    // instantiating deployed pERC20 contracts
    const pERC20_1 = await ethers.getContractAt("ProjectERC20",pERC20Array[0]);
    const pERC20_2 = await ethers.getContractAt("ProjectERC20",pERC20Array[1]);


    // console.log("balance pERC20-1 of owner:", await pERC20_1.balanceOf(owner.address));
    // console.log("balance pERC20-2 of owner:", await pERC20_2.balanceOf(owner.address));
    expect(await pERC20_1.balanceOf(owner.address)).to.equal(1000);
    expect(await pERC20_2.balanceOf(owner.address)).to.equal(0);

    // await pERC20_1.getAttributes();

    // console.log("region pERC20:", await pERC20_1.vintage());
    // console.log("region pERC20:", await pERC20_1.region());
    // console.log("standard pERC20:", await pERC20_1.standard());
    // console.log("methodology pERC20:", await pERC20_1.methodology());


    console.log(await ContractRegistry.projectERC20FactoryAddress());

    // ---------------------
    // Deploying HPoolToken
    console.log("\n----\nDeploying HPoolToken...");
    factory = await ethers.getContractFactory("HPoolToken");
    HPoolToken = await factory.deploy("TestPool", "TPOOL", ContractRegistry.address);
    console.log("\HPoolToken address:");
    console.log(HPoolToken.address);

    await HPoolToken.addAttributeSet([2001, 2002, 2005, 2006, 2007, 2009], ["USA", "CO", "BR"], ["VCS"], ["XYZbla"]);
    await HPoolToken.addAttributeSet([2001, 2002, 2005, 2006, 2007, 2009], ["USA", "CO", "BR"], ["VCS"], ["XYZbla"]);
    await HPoolToken.addAttributeSet([2001, 2002, 2005, 2006, 2007, 2009, 2015, 2016], ["USA", "CO", "BR"], ["GS1", "GS2", "GS3","GS4", "VCS"], ["XYZbla"]);

    // response = await HPoolToken.checkAttributeMatching(pERC20Array[0]);
    // console.log(response);

    // response = await HPoolToken.checkAttributeMatching(pERC20Array[1]);
    // console.log(response);

    // ---------------------
    // Deposit pERC20-1 to Pool (HPoolToken)
    // await pERC20_1.transfer(HPoolToken.address, 1000); // This would lock the token

    await pERC20_1.approve(HPoolToken.address, 1000);
    expect(await pERC20_1.allowance(owner.address, HPoolToken.address)).to.equal(1000);

    await HPoolToken.deposit(pERC20_1.address, 1000);
    // console.log("balance HPoolToken of owner:", await HPoolToken.balanceOf(owner.address));
    expect(await pERC20_1.balanceOf(HPoolToken.address)).to.equal(1000);
    expect(await HPoolToken.balanceOf(owner.address)).to.equal(1000);
     
    // ---------------------
    // Deposit pERC20-2 to Pool (HPoolToken)
    await pERC20_2.approve(HPoolToken.address, 500);
    expect(await pERC20_2.allowance(owner.address, HPoolToken.address)).to.equal(500);

    // Deposit to HPool - mint to owner SUPPOSED TO REVERT
    // await HPoolToken.deposit(pERC20_2.address, 1000);
    // console.log("balance HPoolToken of owner:", await HPoolToken.balanceOf(owner.address));

  });




});
