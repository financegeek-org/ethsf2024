import ethers from "ethers";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_RPC, LitNetwork } from "@lit-protocol/constants";
import {
  createSiweMessageWithRecaps,
  generateAuthSig,
  LitAbility,
  LitActionResource,
  LitPKPResource,
} from "@lit-protocol/auth-helpers";

import { getEnv } from "./utils.js";
import { litActionCode } from "./litAction.js";

const ETHEREUM_PRIVATE_KEY = getEnv("ETHEREUM_PRIVATE_KEY");

export const runExample = async (pkpPublicKey) => {
  let litNodeClient;

  try {
    const ethersSigner = new ethers.Wallet(
      //'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      ETHEREUM_PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
      //new ethers.providers.JsonRpcProvider('https://lit-protocol.calderachain.xyz/replica-http')
    );

    console.log("🔄 Connecting to Lit network...");
    litNodeClient = new LitNodeClient({
      litNetwork: LitNetwork.DatilDev,
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected to Lit network");

    console.log("🔄 Getting Session Signatures...");
    const sessionSigs = await litNodeClient.getSessionSigs({
      chain: "ethereum",
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
      resourceAbilityRequests: [
        {
          resource: new LitPKPResource("*"),
          ability: LitAbility.PKPSigning,
        },
        {
          resource: new LitActionResource("*"),
          ability: LitAbility.LitActionExecution,
        },
      ],
      authNeededCallback: async ({
        resourceAbilityRequests,
        expiration,
        uri,
      }) => {
        const toSign = await createSiweMessageWithRecaps({
          uri: uri,
          expiration: expiration,
          resources: resourceAbilityRequests,
          walletAddress: ethersSigner.address,
          nonce: await litNodeClient.getLatestBlockhash(),
          litNodeClient,
        });

        return await generateAuthSig({
          signer: ethersSigner,
          toSign,
        });
      },
    });
    console.log("✅ Got Session Signatures");

    console.log("🔄 Executing Lit Action...");
    const message = new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode("Hello world")
      )
    );
    const litActionSignatures = await litNodeClient.executeJs({
      sessionSigs,
      code: litActionCode,
      jsParams: {
        toSign: message,
        publicKey: pkpPublicKey,
        sigName: "sig",
      },
    });
    console.log("✅ Executed Lit Action");

    return litActionSignatures;
  } catch (error) {
    console.error(error);
  } finally {
    litNodeClient.disconnect();
  }
};



async function mintPkp(ethersSigner) {
  console.log("Minting new PKP...");
  const litContracts = new LitContracts({
    signer: ethersSigner,
    network: LitNetwork.DatilDev,
  });

  await litContracts.connect();

  const ipfsHash = await stringToIpfsHash(litActionCode);
  // get mint cost
  const mintCost = await litContracts.pkpNftContract.read.mintCost();
  console.log("Mint cost:", mintCost);

  /*
      function mintNextAndAddAuthMethods(
        uint256 keyType,
        uint256[] memory permittedAuthMethodTypes,
        bytes[] memory permittedAuthMethodIds,
        bytes[] memory permittedAuthMethodPubkeys,
        uint256[][] memory permittedAuthMethodScopes,
        bool addPkpEthAddressAsPermittedAddress,
        bool sendPkpToItself
        */

  const txn =
    await litContracts.pkpHelperContract.write.mintNextAndAddAuthMethods(
      2,
      [AuthMethodType.LitAction],
      [ethers.utils.base58.decode(ipfsHash)],
      ["0x"],
      [[AuthMethodScope.SignAnything, AuthMethodScope.PersonalSign]],
      false,
      true,
      { value: mintCost, gasLimit: 4000000000 }
    );
  const receipt = await txn.wait();
  console.log("Minted!", receipt);

  // get the pkp public key from the mint event
  const pkpId = receipt.logs[0].topics[1];
  const pkpInfo = await litContracts.pubkeyRouterContract.read.pubkeys(
    ethers.BigNumber.from(pkpId)
  );
  console.log("PKP Info:", pkpInfo);
  const pkpPublicKey = pkpInfo.pubkey;

  console.log("PKP Public Key:", pkpPublicKey);

  return pkpPublicKey.slice(2);

  // return (await litContracts.pkpNftContractUtils.write.mint()).pkp;
}


runExample("0x04261dcbd5b19f9ad88ce8b4aa40ea105aed85b962874a0525662dee1a0c4891d508ab084a7a457ab7a613e54c1c6e160d3922a22988b23f6e93df1b32f4c40ac5");
