// @ts-nocheck

const _litActionCode = async () => {
  const payload = {
    "query": "hello",
  };
  const response = await fetch(
    "https://ethsf2024vercel.vercel.app/api/data/",
    {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': 'Bearer ' + apiKey,
      },
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  const result = await response.json();

  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });

  //Lit.Actions.setResponse({ response: result });
};

export const litActionCode = `(${_litActionCode.toString()})();`;
