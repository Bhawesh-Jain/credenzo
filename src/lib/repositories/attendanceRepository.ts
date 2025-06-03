import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";

export class AttendanceRepository extends RepositoryBase {
  constructor() {
    super()
  }

  async addAttendanceActivity({
    userId,
    type,
    ipAddress,
    deviceInfo,
    location,
  } : {
    userId: string,
    type: string,
    ipAddress: string,
    deviceInfo: string,
    location: { latitude: number; longitude: number; }
  }) {
    console.log("-------",type)
    try {
      if (!['clock_in', 'clock_out', 'break_start', 'break_end'].includes(type)) {
        console.error("Invalid type provided:", type);
        throw('Invalid Type');
      }
  console.log("Addding type activity", type,userId)

      const result = new QueryBuilder('attendance_events')
        .insert({
          user_id: userId,
          event_type: type,
          event_time: new Date(),
          ip_address: ipAddress,
          location: `${location.latitude},${location.longitude}`
        })
    } catch (error) {
      return this.handleError(error)
    }
  }
}