
export class RepositoryBase {
  constructor() {

  }

  private getClassName() {
    return this.constructor.name;
  }

  handleError(error: any) {
    console.log(this.getClassName(), error);

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