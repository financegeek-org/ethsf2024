// Get data
const payloadData = {
  "key": dataApiKey,
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
if (resultData.credits < 5) {
  // not enough credits
  return "Not enough credits";
}
//console.log(data);

// Get inference
const messages = [
  {
    "role": "system",
    //"content": "You are helping query a database of where people work. Return at MOST 3 names and their relevant details to the user. The data is " + data,
    "content": "You are helping query a database of where people work. The data is " + data,
  },
  {
    "role": "user",
    "content": query,
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
const answer = resultInf.choices[0].message.content;
console.log(answer + "\nYour remaining credit balance is " + resultData.credits);

