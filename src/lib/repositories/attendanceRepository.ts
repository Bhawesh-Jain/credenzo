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
  } : {
    userId: string,
    type: string,
    ipAddress: string,
    deviceInfo: string
  }) {
    try {
      
    } catch (error) {
      return this.handleError(error)
    }
  }
}