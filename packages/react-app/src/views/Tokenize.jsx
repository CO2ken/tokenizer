import React, { useCallback, useEffect, useState } from "react";
import { Heading, Text, Flex, Box, Button, Input, Divider, SimpleGrid, HStack, Select, Spacer } from "@chakra-ui/react";
import { SyncOutlined } from '@ant-design/icons';
import { Address, AddressInput, Balance } from "../components";
import { useContractReader, useEventListener, useResolveName } from "../hooks";
import { parseEther, formatEther } from "@ethersproject/units";

export default function Tokenize({address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  const [newProject, setNewProject] = useState("loading...");

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(readContracts,"YourContract", "purpose")
  console.log("🤗 purpose:",purpose)

  // const ownerBalanceOf = useContractReader(readContracts,"ProjectContract", "ownerBalanceOf", ["0xD2CAc44B9d072A0D6bD39482147d894f13C5CF32"])
  // console.log("🤗 ownerBalanceOf:", ownerBalanceOf)

  //📟 Listen for broadcast events
  const projectCreatedEvents = useEventListener(readContracts, "ProjectFactory", "ProjectCreated", localProvider, 1);
  console.log("📟 SetPurpose events:",projectCreatedEvents)

  const projectMintedEvents = useEventListener(readContracts, "ProjectContract", "ProjectMinted", localProvider, 1);
  console.log("📟 SetPurpose events:",projectMintedEvents)

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  return (
    <div>
      <Flex align="center" justify="center" height="70vh" direction="column">
        <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">
          <Heading as="h3" size="lg" mb={4}>Tokenize</Heading>
          <HStack mb={6}>
            <Select placeholder="Select Project">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
            <Input />
          </HStack>
          <Divider />
          <Flex align="left">
            <Button variant="link" mb={4} mt={6}>Project not found?</Button>
          </Flex>
          <Flex>
            <Button w="100%" size="lg" mr={2}>Add project</Button>
            <Button w="100%" size="lg" colorScheme="teal" variant="outline">Tokenize</Button>
          </Flex>
        </Box>
      </Flex>
    </div>
  );
}
