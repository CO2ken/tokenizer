import React from "react";
import { Heading, Text, Flex, Box, Button, SimpleGrid } from "@chakra-ui/react";

export default function ProjectDetails() {
  
return (
    <div>
      <Flex align="center" justify="center" height="70vh" direction="column">
        <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">
          <HStack mb={4} align="left">
            <Text>Tokenize your</Text>
            <Text color="teal" fontWeight="700">Carbon Credits</Text>
          </HStack>
          <Divider />
          <HStack mt={4} mb={6}>
            <Text>Project Details</Text>
          </HStack> 
          <Text>Project Name</Text>
          <Text>Location</Text>
          <Text>Date</Text>
          <Text>Program and Protocol</Text>
          <Text>Protocol Categories</Text>
          <Text>Number of Credits</Text>
          <Button variant="outline" colorScheme="teal" size="lg" mt={4}>Request Tokenization</Button>
        </Box>
      </Flex>
    </div>
  );
}
