1) Users connect with their Eth wallet to Lit nodes
2) Users make LLM queries
3) LIT decrypts API keys based on user wallet
API key and credit tracking for data vendor
API key and credit tracking for inference vendor
4) LIT action takes data from data vendor and uses it with inference vendor. User doesn’t see the input data
5) LIT action returns results to user and signs that user made that request
6) Query is tracked, but not the data or the result, maintaining privacy with accountability. Signed query signatures can be submitted to blockchain of your choice.
