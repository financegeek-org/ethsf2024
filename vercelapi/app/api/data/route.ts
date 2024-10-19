import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    console.log(body.content);
    const responseJson = {
      "msg": "Hello World",
    }

    // Return the response as JSON
    console.log('response',responseJson);
    return NextResponse.json(responseJson)
  } catch (error) {
    // If there's an error, return a 400 Bad Request response
    return NextResponse.json({ error: 'Invalid JSON input' }, { status: 400 })
  }
}

export async function GET() {
  try {
    const responseJson = {
      "credits": 1000,
      "data": "",
    }

    // Return the response as JSON
    console.log('response',responseJson);
    return NextResponse.json(responseJson)
  } catch (error) {
    // If there's an error, return a 400 Bad Request response
    return NextResponse.json({ error: 'Invalid JSON input' }, { status: 400 })
  }
}