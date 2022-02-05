import { FormMode } from './form-mode';

export class QueryParameters {
  public search: string = null;
  public pageSize: number = 50;
  public pageNumber: number = 1;
  public currentItem: any;
  public baseUrl: string = null;
  public mode: FormMode;
  constructor() {}

  public buildQueryParameters() {
    let appendComa = false;

    let result = `?`;
    let queryObject = this.buildQueryParamsObject();
    result += Object.keys(queryObject)
      .map((prop) => {
        return `${prop}=${queryObject[prop]}`;
      })
      .join('&');

    return result;
  }

  private buildQueryParamsObject() {
    let result = {};

    if (
      this.currentItem &&
      (this.mode == FormMode.Detail || this.mode == FormMode.Edit)
    ) {
      result = { ...result, itemId: this.currentItem.id };
    }
    if (this.search) {
      result = { ...result, search: this.search };
    }
    if (this.pageNumber) {
      result = { ...result, pageNumber: this.pageNumber };
    }
    if (this.pageSize) {
      result = { ...result, pageSize: this.pageSize };
    }
    return result;
  }
}
