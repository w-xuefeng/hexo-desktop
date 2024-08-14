import { ICommonResponse } from '../../../shared/utils/types';

export default class R {
  static json<T>(data: ICommonResponse<T>) {
    return data;
  }

  static success<T>(data?: T, message?: string) {
    return this.json<T>({
      success: true,
      message,
      data
    });
  }

  static fail<T>(message?: string, data?: T) {
    return this.json<T>({
      success: false,
      message,
      data
    });
  }
}
