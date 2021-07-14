const { config, ethers, tenderly, run } = require("hardhat");
const { utils } = require("ethers");


const main = async () => {

    // let deployer = "0x9e7997c8475230b2be55825cf5bc0f6c5151261b"
    const [deployer] = await ethers.getSigners();

    const BatchCollection = await ethers.getContractAt("BatchCollection", "0x8F2AA7150BD9156Bdc425b800043c6B28C752f1c");
    const ProjectCollection = await ethers.getContractAt("ProjectCollection", "0xAF9238E2b137d19F1029e7E2D98911a3EE26aC00");

    await deployProjectNFTs(deployer.address, ProjectCollection);
}


const deployProjectNFTs = async (deployerAddr, ProjectCollection) => {
    for (i=3; i<sampleProjects.length; i++) { 
        console.log(i)
        await ProjectCollection.addNewProject(
            deployerAddr, 
            sampleProjects[i].projectId, 
            sampleProjects[i].standard, 
            sampleProjects[i].methodology, 
            sampleProjects[i].region, 
            sampleProjects[i].metaDataHash, 
            sampleProjects[i].tokenURI
            );
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


  sampleProjects = [
    {
        "projectId": "VR-01418",
        "standard": "VCS",
        "methodology": "ACM0002",
        "region": "India",
        "metaDataHash": "",
        "tokenURI": "https://registry.verra.org/app/projectDetail/VCS/0001418"
    },
    {
        "projectId": "VR-01686",
        "standard": "VCS",
        "methodology": "VM0015",
        "region": "Brazil",
        "metaDataHash": "",
        "tokenURI": "https://registry.verra.org/app/projectDetail/VCS/1686"
    },
    {
        "projectId": "VR-02088",
        "standard": "VCS",
        "methodology": "AR-AM0014",
        "region": "Myanmar",
        "metaDataHash": "",
        "tokenURI": "https://registry.verra.org/app/projectDetail/VCS/2088"
    },
    {
        "projectId": "VR-00001",
        "standard": "VCS",
        "methodology": "ACM0002",
        "region": "India",
        "metaDataHash": "",
        "tokenURI": "https://registry.verra.org/app/projectDetail/VCS/0001418"
    },
    {
        "projectId": "VR-00002",
        "standard": "VCS",
        "methodology": "VM0015",
        "region": "Brazil",
        "metaDataHash": "",
        "tokenURI": "https://registry.verra.org/app/projectDetail/VCS/1686"
    },
    {
        "projectId": "VR-00003",
        "standard": "VCS",
        "methodology": "AR-AM0014",
        "region": "Myanmar",
        "metaDataHash": "",
        "tokenURI": "https://registry.verra.org/app/projectDetail/VCS/2088"
    }
]