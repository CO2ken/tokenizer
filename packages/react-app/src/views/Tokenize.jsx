import React, { useState } from "react";
import { Heading, Text, Flex, Box, Button, Input, Divider, Stack, Switch, Center } from "@chakra-ui/react";
import { useContractReader, useEventListener, useResolveName } from "../hooks";
import { parseEther, formatEther } from "@ethersproject/units";
import { useHistory } from "react-router-dom";

export default function Tokenize({ props, address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

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

  const history = useHistory();

  const [serialNo, setSerialNo] = useState('');
  const [projectName, setProjectName] = useState('');
  const [inputKind, setInputKind] = useState(true);

  async function onChangeSerialNo(event) {
      await setSerialNo(event.target.value);
  }

  async function onChangeProjectName(event) {
      await setProjectName(event.target.value);
  }

  const handleChangeInputKind = () => setInputKind(!inputKind);

  function takeToTokenization()
  {
    if(inputKind)
      history.push('/tokenizer/'+serialNo);
    else
      history.push('/tokenizer/'+projectName);
  }

  return (
    <div>
      <Center>
      {/* <Flex align="center" justify="center" height="50vh" direction="column"> */}
        <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">
          <Stack direction={["column", "row"]} mb={2} align="left">
            <Text>Tokenize your</Text>
            <Text color="teal" fontWeight="700">Carbon Credits</Text>
          </Stack>
          <Divider />
          <Stack direction={["column", "row"]} mt={4} mb={4}>
            <Text>Serial Number</Text>
            <Switch onChange={handleChangeInputKind}/>
            <Text>Project Name</Text>
          </Stack> 
          {
          inputKind
          ?  
          <><Input placeholder="Enter Serial Number" onChange={onChangeSerialNo}/><br/>
          e.g: 0001-000001-000100-VCS-VCU-003-VER-US-122-2532-01012020-31122020-1<br/></>
          :
          <Input placeholder="Enter Project Name" onChange={onChangeProjectName} />
          }
          <Button variant="outline" colorScheme="teal" size="lg" mt={4} onClick={takeToTokenization}>Continue</Button>
        </Box>
      {/* </Flex> */}
      </Center>

      {/* <Flex align="center" justify="center" height="70vh" direction="column">
        <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={['auto', '45%']} boxShadow="dark-lg">
          <Heading as="h3" size="lg" mb={4}>Tokenize</Heading>    
          <Divider />
          <HStack mt={6} mb={6}>
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
          <Input placeholder="Enter Serial Number" />
          <Input placeholder="Enter Project Name"/>
          <Flex>
            <Button w="100%" size="lg" mr={2}>Add project</Button>
            <Button w="100%" size="lg" colorScheme="teal" variant="outline">Tokenize</Button>
          </Flex>
        </Box>
      </Flex> */}
    </div>
  );
}
