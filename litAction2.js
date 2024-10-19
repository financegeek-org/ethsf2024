// @ts-nocheck

const _litActionCode = async () => {
  const dataApiKey = await Lit.Actions.decryptAndCombine({
    accessControlConditions,
    ciphertext: ciphertextData,
    dataToEncryptHash: dataToEncryptHashData,
    authSig: null,
    chain: 'ethereum',
  });
  const infApiKey = await Lit.Actions.decryptAndCombine({
    accessControlConditions,
    ciphertext: ciphertextInf,
    dataToEncryptHash: dataToEncryptHashInf,
    authSig: null,
    chain: 'ethereum',
  });


  // the code in the function given to runOnce below will only be run by one node
  let answer = await Lit.Actions.runOnce({ waitForResponse: true, name: "txnSender" }, async () => {
    // Get data
    const payloadData = {
      "query": "hello",
    };
    const responseData = await fetch(
      "https://ethsf2024vercel.vercel.app/api/data/",
      {
        headers: {
          'Content-Type': 'application/json',
          //'Authorization': 'Bearer ' + dataApiKey,
        },
        method: "POST",
        body: JSON.stringify(payloadData),
      }
    );
    const resultData = await responseData.json();
    const data = resultData.data;
    //console.log(data);

    // Get inference
    const messages = [
      {
        "role": "system",
        "content": "You are helping query a database of where people work. Return at MOST 3 names and their relevant details to the user. The data is " + data,
      },
      {
        "role": "user",
        "content": "Who works at Facebook?",
      },
    ];
    const payloadInf = {
      "model": "meta-llama/Llama-Vision-Free",
      "messages": messages,
    };
    const responseInf = await fetch(
      "https://api.together.xyz/v1/chat/completions",
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + infApiKey,
        },
        method: "POST",
        body: JSON.stringify(payloadInf),
      }
    );
    const resultInf = await responseInf.json();
    const answer=resultInf.choices[0].message.content;
    console.log(answer);

    return answer; // return the tx to be broadcast to all other nodes
  });


  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
  Lit.Actions.setResponse({ response: answer });
};

export const litActionCode = `(${_litActionCode.toString()})();`;
