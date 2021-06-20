import React from "react";
import { Heading, Text, Flex, Box, Button, SimpleGrid, Stack, Divider, Center } from "@chakra-ui/react";
import projects from "../verra/projects.js";

export default function ProjectDetails({address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  const url = window.location.href.split("/");
  const serialNo = url.pop().split("-");
  let project = '';

  for(let i = 0; i < projects.length; i++)
  {
    if(projects[i]["resourceIdentifier"] == serialNo[9])
    {
      project = projects[i];
    }
  }

return (
    <div>
      <Center>
      {/* <Flex align="center" justify="center" direction="column"> */}
        <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">
          <Stack direction={["column", "row"]} mb={2}>
            <Text>Tokenize your</Text>
            <Text color="teal" fontWeight="700">Carbon Credits</Text>
          </Stack>
          <Divider />
            <Text fontSize="30" mt={4} mb={6}>Project Details</Text>
              <Text align="left">Project Name: {project["resourceName"]}</Text>
              <Text align="left">Location: {project["country"]}, {project["region"]}</Text>
              <Text align="left">Date: {project["createDate"]}</Text>
              <Text align="left">Program: {project["program"]}</Text>
              <Text align="left">Protocol: {project["protocols"]}</Text>
              <Text align="left">Number of Credits: {project["estAnnualEmissionReductions"]}</Text>
          {/* <VStack align="left">
            <Text fontWeight="700">Block Id Start: {project["program"]}</Text>
            <Text fontWeight="700">Block Id End: {serialNo[2]}</Text>
            <Text fontWeight="700">Project Id: {serialNo[9]}</Text>
          </VStack> */}
          {/* <Button variant="outline" colorScheme="teal" size="lg" mt={4}>Request Tokenization</Button> */}
          <Button variant="outline" colorScheme="teal" size="lg" mt={4} onClick={()=>{
            console.log("mint batch!!!")
            console.log(`Notify discord at ${process.env.REACT_APP_NOTIFY_TOKENIZATION}`)
            tx( writeContracts.BatchContract.mintBatch('0xD2CAc44B9d072A0D6bD39482147d894f13C5CF32', 'https://en.wikipedia.org/wiki/Pepe_the_Frog#/media/File:Feels_good_man.jpg') )
          }}>Create project</Button>
        </Box>
      {/* </Flex> */}
      </Center>
    </div>
  );
}
