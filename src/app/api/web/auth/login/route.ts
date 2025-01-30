import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

  let { username, password, device_info } = await request.json();

  var success = false;
  var message = []
  var data;

  if (!username) message.push('Username Required!')
  if (!password) message.push('Password Required!')

  try {
    if (message.length > 0) {
      throw new Error(message.join());
    }
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 200 })
  }
}