import { NextResponse } from "next/server";

export function apiSuccess({
  data,
  message = ['Request Successful']
}: {
  data: any,
  message: string[]
}) {
  return NextResponse.json({ success: true, message, data }, { status: 200 })
}

export function apiFailure({
  message = ['Request Failed'],
  status = 400
}: {
  message: string[],
  status: 200 | 400 | 401 | 500
}) {
  return NextResponse.json({ success: false, message }, { status: status })
} 

export function apiError({
  message = ['Server Error'],
  status = 500
}: {
  message: string[],
  status: 200 | 500
}) {
  return NextResponse.json({ success: false, message }, { status: status })
} 