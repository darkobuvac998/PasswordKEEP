export function Confirmable(message: string) {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
      const original = descriptor.value;
  };
}
