import { LitNetwork } from "@lit-protocol/constants";

app.locals.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
  alertWhenUnauthorized: false,
  litNetwork: LitNetwork.Datil,
});
await app.locals.litNodeClient.connect();
