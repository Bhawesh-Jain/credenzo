import { customLog } from "../utils";
import { DatabaseError } from "./db-helper";

export class RepositoryBase {
  constructor() {

  }

  private getClassName() {
    return this.constructor.name;
  }

  handleError(error: any) {
    customLog(this.getClassName(), error);

    if (error instanceof DatabaseError) {
      throw error;
    }

    return {
      success: false,
      error: 'Internal Server Error!',
      result: {},
    }
  }

  failure(reason: string) {
    return {
      success: false,
      error: reason,
      result: {},
    }
  }

  success(data: any) {
    return {
      success: true,
      error: '',
      result: data,
    }
  }
}