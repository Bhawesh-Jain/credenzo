'use server'

import { cookies } from "next/headers";
import { AttendanceRepository } from "../repositories/attendanceRepository";
import { getSession } from "../session";
import { getDeviceInfo, getDeviceIp } from "../helpers/header-helper";

export async function addAttendanceActivity(type: string, location: { latitude: number; longitude: number; }) {
  const session = await getSession();
  const ipAddress = getDeviceIp();
  const deviceInfo = getDeviceInfo();

  const attendanceRepository = new AttendanceRepository();
  const result = attendanceRepository.addAttendanceActivity({
    userId: session.user_id, type, ipAddress, deviceInfo, location
  });
  return result;
}
 export async function getAttendanceEvents() {
  const attendanceRepository = new AttendanceRepository();
  const result = attendanceRepository.getAttendance_events();

  return result;
 }