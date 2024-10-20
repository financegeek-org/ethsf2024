import { NextRequest, NextResponse } from 'next/server'

const data = `Jeff works as Software Engineer at Apple.
John works as Software Engineer at Facebook.
Steve works as Sales at Facebook.
Ivan works as Sales at Apple.
Zhang works as Software Engineer at Facebook.
Chen works as Software Engineer at Facebook.
Zhao works as Software Engineer at Facebook.
Wang works as Engineering Manager at Facebook.
Li works as Engineering Manager at Apple.
You works as unknown at Lit Protocol.
1kx works as investor at Lit Protocol.
David Sneider works as founder at Lit Protocol.
`;
const responseJson = {
  "credits": 1000,
  "data": data,
}
const responseJsonError = {
  "credits": 3,
}


export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    if (body.key==="secretKey") {
      // Return the response as JSON
      console.log('response',responseJson);
      return NextResponse.json(responseJson)
    }
    else {
      return NextResponse.json(responseJsonError)
    }
  } catch (error) {
    // If there's an error, return a 400 Bad Request response
    return NextResponse.json({ error: 'Invalid JSON input' }, { status: 400 })
  }
}

export async function GET() {
  try {
    // Return the response as JSON
    console.log('response',responseJson);
    return NextResponse.json(responseJson)
  } catch (error) {
    // If there's an error, return a 400 Bad Request response
    return NextResponse.json({ error: 'Invalid JSON input' }, { status: 400 })
  }
}