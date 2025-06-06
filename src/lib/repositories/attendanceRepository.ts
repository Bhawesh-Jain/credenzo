import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";

export class AttendanceRepository extends RepositoryBase {

  constructor() {
    super();
  }

  async addAttendanceActivity({
    userId,
    type,
    ipAddress,
    deviceInfo,
    location,
  }: {
    userId: string,
    type: string,
    ipAddress: string,
    deviceInfo: string,
    location: { latitude: number; longitude: number; }
  }) {
    try {
      if (!['clock_in', 'clock_out', 'break_start', 'break_end'].includes(type)) {
        throw ('Invalid Type');
      }

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

  async getAttendance_events() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      const result = await new QueryBuilder('attendance_events')
        .where('event_time >= ?', startOfDay)
        .where('event_time < ?', endOfDay)
        .limit(15)
        .select(['id', 'event_type', 'event_time'])

      if (result.length > 0) {
        return this.success(result);
      } else {
        return this.failure('No branches found');
      }
    } catch (error) {
      return this.handleError(error);
    }
  }
}