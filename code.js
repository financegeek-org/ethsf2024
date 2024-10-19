const payload = {
};
const body = JSON.stringify(payload);

const response = await fetch(
  "https://ethsf2024vercel.vercel.app/api/data/",
  //"http://localhost:3000/api/data/",
  {
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': 'Bearer ' + apiKey,
    },
    method: "POST",
    body: body,
  }
);

const result = await response.json();
console.log(result);
