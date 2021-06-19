import React, {useEffect} from "react";
import { Heading, Text, Flex, Box, Button, SimpleGrid, HStack, VStack, Divider } from "@chakra-ui/react";
import projects from "../verra/projects.js";

export default function ProjectDetails() {

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
      <Flex align="center" justify="center" height="70vh" direction="column">
        <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">
          <HStack mb={4}>
            <Text>Tokenize your</Text>
            <Text color="teal" fontWeight="700">Carbon Credits</Text>
          </HStack>
          <Divider />
          <HStack mt={4} mb={6}>
            <Text fontSize="30">Project Details</Text>
          </HStack>
          {/* <Flex align="left" justify="flex-start">
            <VStack> */}
              <Text align="left">Project Name: {project["resourceName"]}</Text>
              <Text align="left">Location: {project["country"]}, {project["region"]}</Text>
              <Text align="left">Date: {project["createDate"]}</Text>
              <Text align="left">Program: {project["program"]}</Text>
              <Text align="left">Protocol: {project["protocols"]}</Text>
              <Text align="left">Number of Credits: {project["estAnnualEmissionReductions"]}</Text>
            {/* </VStack>
          </Flex> */}
          {/* <VStack align="left">
            <Text fontWeight="700">Block Id Start: {project["program"]}</Text>
            <Text fontWeight="700">Block Id End: {serialNo[2]}</Text>
            <Text fontWeight="700">Project Id: {serialNo[9]}</Text>
          </VStack> */}
          <Button variant="outline" colorScheme="teal" size="lg" mt={4}>Request Tokenization</Button>
        </Box>
      </Flex>
    </div>
  );
}
