import { formatDate } from "@angular/common";

export function PrimaryKey() {
  return function (target: Object, key: string | symbol) {
    let val = target[key];

    const getter = () => {
      return val;
    };

    const setter = (next: string | null) => {
      val = next?.toLowerCase();
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

export function FormatDate(prop: string){
  return function(target: Object, key: string | symbol){
    let val = target[prop];
    if(val){
      val = formatDate(val, 'dd-MM-yyyy', 'en');
    }
  }
}
