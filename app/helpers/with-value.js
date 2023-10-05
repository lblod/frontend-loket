export default function withValue(handler) {
  return function (event) {
    return handler(event.target.value);
  };
}
