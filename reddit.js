const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const USER_AGENT = 'YOUR_USER_AGENT';

async function getRedditWorldNews() {
    // Step 1: Get access token
    const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Fetch world news
    const response = await fetch('https://oauth.reddit.com/r/worldnews/new', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': USER_AGENT
        }
    });

    const data = await response.json();
    const posts = data.data.children;

    posts.forEach(post => {
        console.log(`Title: ${post.data.title}, URL: ${post.data.url}`);
    });
}

// Run the function
getRedditWorldNews().catch(console.error);