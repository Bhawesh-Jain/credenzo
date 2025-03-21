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
    try {
      if (!['clock_in', 'clock_out', 'break_start', 'break_end'].includes(type)) {
        throw('Invalid Type');
      }

      const result = new QueryBuilder('attendance_events')
        .insert({
          user_id: userId,
          event_type: type,
          event_time: new Date(),
          ip_address: ipAddress,
          location
        })
    } catch (error) {
      return this.handleError(error)
    }
  }
}