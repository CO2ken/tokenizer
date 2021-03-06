import React, { useCallback, useEffect, useState } from "react";
import { List } from "antd";
import { SimpleGrid, Heading, Text, Box, Input, Divider, Button, VStack } from "@chakra-ui/react";
import { Address, AddressInput, Balance } from "../components";
import { useContractReader, useEventListener, useResolveName } from "../hooks";
import { parseEther, formatEther } from "@ethersproject/units";

function Project({
  address,
  mainnetProvider,
  userProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newProject, setNewProject] = useState("loading...");

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(readContracts, "YourContract", "purpose");
  console.log("🤗 purpose:", purpose);

  // const ownerBalanceOf = useContractReader(readContracts,"ProjectContract", "ownerBalanceOf", ["0xD2CAc44B9d072A0D6bD39482147d894f13C5CF32"])
  // console.log("🤗 ownerBalanceOf:", ownerBalanceOf)

  //📟 Listen for broadcast events
  const projectCreatedEvents = useEventListener(readContracts, "ProjectFactory", "ProjectCreated", localProvider, 1);
  console.log("📟 ProjectCreated events:", projectCreatedEvents);

  const projectMintedEvents = useEventListener(readContracts, "ProjectContract", "ProjectMinted", localProvider, 1);
  console.log("📟 ProjectMinted events:", projectMintedEvents);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  return (
    <div>

      <SimpleGrid columns={3} spacing="10px">
        <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={["auto", "45%"]}>
          <Heading as="h3" size="lg" mb="2">
            Tokenizer
          </Heading>
          <div>
            <Input fontFamily="Cousine"
              onChange={e => {
                setNewProject(e.target.value);
              }}
              placeholder="Enter project name"
            />
            <Button
              mt={4}
              mb={4}
              colorScheme="teal"
              onClick={() => {
                console.log("createProject", newProject);
                alert('You will see a notification when your transcation has been processed. This may take a moment.')
                /* look how you call setPurpose on your contract: */
                tx(writeContracts.ProjectFactory.createProject(newProject));
              }}
            >
              Tokenize
            </Button>
          </div>

          <Divider />

          <Text fontSize="lg" mt={4} mb={4}>
            Your Projects
          </Text>
          <List
            bordered
            dataSource={projectMintedEvents}
            renderItem={item => {
              return (
                <List.Item key={item.blockNumber + "_" + item.sender + "_" + item.purpose}>
                  <Address value={item[0]} ensProvider={mainnetProvider} fontSize={16} /> &rarr;
                  {item[1]}
                </List.Item>
              );
            }}
          />

          <Divider />
          <VStack>
            <Button
              mt={4}
              colorScheme="teal"
              onClick={() => {
                /* look how we call setPurpose AND send some value along */
                tx(
                  writeContracts.YourContract.setPurpose("💵 Paying for this one!", {
                    value: parseEther("0.001"),
                  }),
                );
                /* this will fail until you make the setPurpose function payable */
              }}
            >
              Set Purpose With Value
            </Button>

            <Button
              mt={4}
              mb={4}
              colorScheme="teal"
              onClick={() => {
                /* you can also just craft a transaction and send it to the tx() transactor */
                tx({
                  to: writeContracts.YourContract.address,
                  value: parseEther("0.001"),
                  data: writeContracts.YourContract.interface.encodeFunctionData("setPurpose(string)", [
                    "🤓 Whoa so 1337!",
                  ]),
                });
                /* this should throw an error about "no fallback nor receive function" until you add it */
              }}
            >
              Another Example
            </Button>
          </VStack>
        </Box>

        <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={["auto", "45%"]}>
          {/*
              📑 Maybe display a list of events?
                (uncomment the event and emit line in YourContract.sol! )
            */}
          <Heading as="h3" size="lg" mb="2">
            Events
          </Heading>
          <div>
            <List
              bordered
              dataSource={projectCreatedEvents}
              renderItem={item => {
                return (
                  <List.Item key={item.blockNumber + "_" + item.sender + "_" + item.purpose}>
                    <Address value={item[0]} ensProvider={mainnetProvider} fontSize={16} /> &rarr;
                    {item[1]}
                  </List.Item>
                );
              }}
            />
          </div>
        </Box>

        <Box p="6" m="4" borderWidth="1px" rounded="lg" flexBasis={["auto", "45%"]}>
          <Heading as="h3" size="lg" mb="2">
            Projects
          </Heading>
          <div>
            <List
              bordered
              dataSource={projectCreatedEvents}
              renderItem={item => {
                return (
                  <List.Item key={item.blockNumber + "_" + item.sender + "_" + item.purpose}>
                    <Address value={item[0]} ensProvider={mainnetProvider} fontSize={16} /> &rarr;
                    {item[1]}
                  </List.Item>
                );
              }}
            />
          </div>
        </Box>
      </SimpleGrid>
    </div>
  );
}
export default Project;
