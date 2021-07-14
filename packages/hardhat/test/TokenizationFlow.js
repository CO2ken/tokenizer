const { expect } = require("chai");
// const { ethers } = require("hardhat-ethers");


describe("", () => {
  it("-- Overall deployment test flow ---", async function () {

    // ---------------------
    // Project Variables
    const vintage16 = 2016;
    const vintage20 = 2020;
    const vintage99 = 1999;
    const projectId = "VER-0001";
    const projectId2 = "GS-0001";
    const projectId3 = "GS-0002";
    const serialNumber = "";
    const quantity1 = 1000;
    const quantity2 = 250;



    // ---------------------
    // Create Blockchain Accounts;
    const [owner, project, enduser, enduser2] = await ethers.getSigners();
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
    // Deploying ProjectCollection
    console.log("\n----\nDeploying ProjectCollection...");
    factory = await ethers.getContractFactory("ProjectCollection");
    ProjectCollection = await factory.deploy();

    // Initialize Example Project-A
    let methodology = "Removal-01";
    let standard = "VCS";
    let region = "USA"; 
    let metaDataHash = "0xabc";
    let tokenURI = "";

    const projTokenId = 1;

    // ---------------------
    // Adding (minting) Example Project-A
    await ProjectCollection.connect(project).
    addNewProject(project.address, projectId, standard, methodology, region, metaDataHash, tokenURI);
    expect(await ProjectCollection.ownerOf(projTokenId)).to.equal(project.address);

    data = await ProjectCollection.getProjectDataByProjectId(projectId);
    console.log("\n-----------")
    console.log("Logging getProjectDataByProjectId(projTokenId):", data);

    projectDataArr = [standard, methodology, region];
    // ERROR: need to be fixed
    // expect(await ProjectCollection.getProjectData(projTokenId)).to.equal(projectDataArr);
    expect(data[0]).to.equal(projectDataArr[0]);

    await ContractRegistry.setProjectCollectionAddress(ProjectCollection.address);
    expect(await ContractRegistry.projectCollectionAddress()).to.equal(ProjectCollection.address);


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

    // Flow #1 (legacy): mintBatchWithData, user already has the serialnumber
    // console.log("\nConnect Project Account and mint Batch-NFT via mintBatchWithData(...)");
    await BatchCollection.connect(project).mintBatchWithData(
      project.address,
      projectId,
      vintage16,
      serialNumber,
      quantity1
    );
    const BatchTokenId1 = 1;

    // Flow #2: start with empty batch
    console.log("\nConnect Project Account and mint Batch-NFT via mintBatchWithData(...)");
    
    const BatchTokenId2 = 2;
    // User sends the serialnumber to Co2ken

    await BatchCollection.connect(enduser).mintEmptyBatch(enduser.address);

    const filter = {
      address: BatchCollection.address,
      fromBlock: 0,
      toBlock: 100,
      topics: [BatchCollection.interface.events.BatchMinted.topic]
    };
    const logs = await provider.getLogs(filter);

    await BatchCollection.connect(owner).updateBatchWithData(
      BatchTokenId2,
      projectId,
      vintage20,
      serialNumber,
      quantity2
    );

    await BatchCollection.connect(enduser2).mintEmptyBatch(enduser2.address);
    const BatchTokenId3 = 3;
    // User sends the serialnumber to Co2ken

    await expect(BatchCollection.connect(owner).updateBatchWithData(
      BatchTokenId3,
      projectId,
      vintage20,
      serialNumber,
      quantity2
    )).to.be.reverted;

    // Test that BatchNFT owner is the project account
    expect(await BatchCollection.ownerOf(BatchTokenId1)).to.equal(project.address);
    expect(await BatchCollection.ownerOf(BatchTokenId2)).to.equal(enduser.address);

    
    // Test  BatchNFT1 confirmation flow
    expect(await BatchCollection.getConfirmationStatus(BatchTokenId1)).to.equal(false);
    await BatchCollection.confirmRetirement(BatchTokenId1);
    expect(await BatchCollection.getConfirmationStatus(BatchTokenId1)).to.equal(true);

    // confirmation BatchNFT2
    await BatchCollection.confirmRetirement(BatchTokenId2);

    // ---------------------
    // Deploying ProjectERC20Factory
    console.log("\n----\nDeploying ProjectERC20Factory:");
    factory = await ethers.getContractFactory("ProjectERC20Factory");
    // deploy and pass registry address to contructor
    ProjectERC20Factory = await factory.deploy(ContractRegistry.address);

    await ContractRegistry.setProjectERC20FactoryAddress(ProjectERC20Factory.address);
    expect(await ContractRegistry.projectERC20FactoryAddress()).to.equal(ProjectERC20Factory.address);


    // ---------------------
    // Deploying new pERC20 tokens
    console.log("Deploying new ProjectERC20 from template...");
    // Deploy 1st: project1, 2016
    await ProjectERC20Factory.deployFromTemplate(BatchTokenId1);

    // Deploy 2nd project1, 2020
    await ProjectERC20Factory.deployFromTemplate(BatchTokenId2);

    // Deploy 3rd project1, 1999
    console.log("Deploy new ProjectERC20 token via ProjectERC20Factory...");
    await ProjectERC20Factory.deployNewToken(
      projectId+vintage99,
      projectId,
      vintage99,
      ContractRegistry.address
    );

    // Revert due to uniqueness check
    await expect(ProjectERC20Factory.deployNewToken(
      projectId+vintage20,
      projectId,
      vintage20,
      ContractRegistry.address
    )).to.be.reverted;

    // Revert due to uniqueness check
    await expect(ProjectERC20Factory.deployNewToken(
      projectId+vintage16,
      projectId,
      vintage16,
      ContractRegistry.address
    )).to.be.reverted;


    // Revert due to non-existing projectId
    await expect(ProjectERC20Factory.deployNewToken(
      projectId3+vintage20,
      projectId3,
      vintage20,
      ContractRegistry.address
    )).to.be.reverted;
    


    // retrieve array with all ERC20 contract addresses
    pERC20Array = await ProjectERC20Factory.getContracts();
    console.log("logging getContracts()", pERC20Array, pERC20Array.length);
    expect((await ProjectERC20Factory.getContracts()).length).to.equal(3);


    // --------Transfers and pERC20 minting-------------

    expect(await BatchCollection.balanceOf(project.address)).to.equal(1);
    expect(await BatchCollection.balanceOf(owner.address)).to.equal(0);
    expect(await BatchCollection.balanceOf(enduser.address)).to.equal(1);


    // Sending BatchNFT1 from Project to owner
    await BatchCollection.connect(project).transferFrom(project.address, owner.address, BatchTokenId1);

    expect(await BatchCollection.balanceOf(project.address)).to.equal(0);
    expect(await BatchCollection.balanceOf(owner.address)).to.equal(1);

    // Sending BatchNFT1 from owner to pERC20-1 contract
    await BatchCollection.connect(owner).transferFrom(owner.address, pERC20Array[0], BatchTokenId1);

    expect(await BatchCollection.balanceOf(project.address)).to.equal(0);
    expect(await BatchCollection.balanceOf(owner.address)).to.equal(0);
    expect(await BatchCollection.balanceOf(pERC20Array[0])).to.equal(1);

    // Sending BatchNFT2 from Enduser to pERC20-2 contract
    await BatchCollection.connect(enduser).transferFrom(enduser.address, pERC20Array[1], BatchTokenId2);
    expect(await BatchCollection.balanceOf(pERC20Array[1])).to.equal(1);


    // instantiating deployed pERC20 contracts
    const pERC20_1 = await ethers.getContractAt("ProjectERC20",pERC20Array[0]);
    const pERC20_2 = await ethers.getContractAt("ProjectERC20",pERC20Array[1]);
    const pERC20_3 = await ethers.getContractAt("ProjectERC20",pERC20Array[2]);


    console.log("balance pERC20-1 of owner:", await pERC20_1.balanceOf(owner.address));
    console.log("balance pERC20-2 of owner:", await pERC20_2.balanceOf(owner.address));
    console.log("balance pERC20-3 of owner:", await pERC20_3.balanceOf(owner.address));

    console.log("balance pERC20-1 of enduser:", await pERC20_1.balanceOf(enduser.address));
    console.log("balance pERC20-2 of enduser:", await pERC20_2.balanceOf(enduser.address));
    console.log("balance pERC20-3 of enduser:", await pERC20_3.balanceOf(enduser.address));

    expect(await pERC20_1.balanceOf(owner.address)).to.equal(quantity1);
    expect(await pERC20_2.balanceOf(enduser.address)).to.equal(quantity2);
    expect(await pERC20_3.totalSupply()).to.equal(0);

    // console.log(await ContractRegistry.projectERC20FactoryAddress());

    // ---------------------
    // Deploying HPoolToken
    console.log("\n----\nDeploying HPoolToken...");
    factory = await ethers.getContractFactory("HPoolToken");
    HPoolToken = await factory.deploy("TestPool", "TPOOL", ContractRegistry.address);
    console.log("\HPoolToken address:");
    console.log(HPoolToken.address);

    await HPoolToken.addAttributeSet([2055, 2032, 2005, 2006, 2007, 2009], ["USA", "CO", "BR", "FR", "ES"], ["VCS"], ["XYZbla"]);
    await HPoolToken.addAttributeSet([2001, 2002, 2005, 2006, 2007, 2009, 2015, 2016], ["USA", "CO", "BR"], ["GS1", "GS2", "GS3","GS4", "VCS"], ["XYZbla"]);
    await HPoolToken.addAttributeSet([2015, 2016], ["USA", "CO", "BR"], ["GS", "GS1", "GS2", "GS3","GS4"], ["Removal-01"]);
    await HPoolToken.addAttributeSet([2015, 2016, 2020], ["USA", "CO", "BR"], ["VCS"], ["Removal-01"]);

    expect(await HPoolToken.checkAttributeMatching(pERC20Array[0])).to.equal(true);
    expect(await HPoolToken.checkAttributeMatching(pERC20Array[1])).to.equal(true);
    expect(await HPoolToken.checkAttributeMatching(pERC20Array[2])).to.equal(false); // vintage 1999
 

    // ---------------------
    // Deposit pERC20-1 to Pool (HPoolToken)
    // await pERC20_1.transfer(HPoolToken.address, 1000); // This would lock the token

    // Deposit to HPool - mint to owner SUPPOSED TO REVERT
    await expect(HPoolToken.connect(owner).deposit(pERC20_1.address, 777)).to.be.reverted;

    await pERC20_1.approve(HPoolToken.address, 1000);
    expect(await pERC20_1.allowance(owner.address, HPoolToken.address)).to.equal(1000);

    await HPoolToken.deposit(pERC20_1.address, 1000);
    // console.log("balance HPoolToken of owner:", await HPoolToken.balanceOf(owner.address));
    expect(await pERC20_1.balanceOf(HPoolToken.address)).to.equal(1000);
    expect(await HPoolToken.balanceOf(owner.address)).to.equal(1000);
     
    // ---------------------
    // Deposit pERC20-2 to Pool (HPoolToken)
    // await pERC20_2.approve(HPoolToken.address, 500);
    // expect(await pERC20_2.allowance(owner.address, HPoolToken.address)).to.equal(500);

    // Approve and deposit 200/250
    await pERC20_2.connect(enduser).approve(HPoolToken.address, 500);
    expect(await pERC20_2.allowance(enduser.address, HPoolToken.address)).to.equal(500);
    await HPoolToken.connect(enduser).deposit(pERC20_2.address, 200);

    expect(await HPoolToken.balanceOf(enduser.address)).to.equal(200);
    expect(await pERC20_2.balanceOf(enduser.address)).to.equal(50);
    expect(await pERC20_2.balanceOf(HPoolToken.address)).to.equal(200);

  });

});
