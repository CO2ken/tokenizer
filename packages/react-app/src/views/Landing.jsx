import React from "react";
import { Heading, Text, Flex, Box, Button } from "@chakra-ui/react";

export default function Landing() {
  
return (
    <div>
      <Flex align="center" justify="center" height="70vh" direction="column">
        <Box>
          <Text> - labore </Text>
          <Heading as="h3" size="lg" mb={4}>Lorem ipsum dolor</Heading>
          <Text>sed do eiusmod tempor incididunt ut labore</Text>
          <Text>et dolore magna aliqua</Text>
          <Button colorScheme="blackAlpha" mb={4} mt={6}>Get started &rarr;</Button>
        </Box>
      </Flex>
    </div>
  );
}
