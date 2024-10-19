// @ts-nocheck

const _litActionCode = async () => {
// Get data
const payloadData = {
  "query": "hello",
};
const responseData = await fetch(
  "https://ethsf2024vercel.vercel.app/api/data/",
  {
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': 'Bearer ' + apiKey,
    },
    method: "POST",
    body: JSON.stringify(payloadData),
  }
);
const resultData = await responseData.json();
const data = resultData.data;
console.log(data);

// Get inference
const messages = [
  {
    "role": "system",
    "content": "You are helping query a database of where people work. Return at MOST 3 names and their relevant details to the user. The data is "+ data,
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
      'Authorization': 'Bearer ' + apiKey,
    },
    method: "POST",
    body: JSON.stringify(payloadInf),
  }
);
const resultInf = await responseInf.json();
const answer=resultInf.choices[0].message.content;
console.log(answer);


  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });

  //Lit.Actions.setResponse({ response: result });
};

export const litActionCode = `(${_litActionCode.toString()})();`;
