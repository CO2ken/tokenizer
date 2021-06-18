import React from "react";
import { Flex, Box, SimpleGrid } from "@chakra-ui/react";

export default function AccountPage() {
  
return (
    <div>
      <Flex align="center" justify="center" height="70vh" direction="column">
        <SimpleGrid columns={3}>
            <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">  </Box>
            <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">  </Box>
            <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">  </Box>
            <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">  </Box>
            <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">  </Box>
            <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">  </Box>
        </SimpleGrid>
      </Flex>
    </div>
  );
}
