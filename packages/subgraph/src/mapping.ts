import { BigInt, Address } from "@graphprotocol/graph-ts"
import {  BatchMinted } from "../generated/BatchCollection/BatchCollection"
import { Batch, Sender } from "../generated/schema"

export function handleMintBatch(event: BatchMinted): void {
  
  let batch = new Batch(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  
  let senderString = event.params.sender.toHexString()
  let minter = Sender.load(senderString)

  if (minter == null) {
    minter = new Sender(senderString)
    minter.address = event.params.sender
    minter.createdAt = event.block.timestamp
    minter.batchCount = BigInt.fromI32(1)
  } else {
    minter.batchCount = minter.batchCount.plus(BigInt.fromI32(1))
  }


  //Not sure the even needs to 
  //batch.address = event.params.address
  //batch.address = event.params.sender
  batch.tokenId = event.params.tokenId
  batch.minter = senderString
  batch.status = "initialized"
  batch.owner = event.params.sender
  //batch.createdAt = event.block.timestamp
  //batch.transactionHash = event.transaction.hash.toHex()

  batch.save()
  minter.save()
}

// export function handleSetPurpose(event: SetPurpose): void {

//   let senderString = event.params.sender.toHexString()

//   let sender = Sender.load(senderString)

//   if (sender == null) {
//     sender = new Sender(senderString)
//     sender.address = event.params.sender
//     sender.createdAt = event.block.timestamp
//     sender.purposeCount = BigInt.fromI32(1)
//   }
//   else {
//     sender.purposeCount = sender.purposeCount.plus(BigInt.fromI32(1))
//   }

//   let purpose = new Purpose(event.transaction.hash.toHex() + "-" + event.logIndex.toString())

//   purpose.purpose = event.params.purpose
//   purpose.sender = senderString
//   purpose.createdAt = event.block.timestamp
//   purpose.transactionHash = event.transaction.hash.toHex()

//   purpose.save()
//   sender.save()

// }
