export function onError(error) {
  let message = error.toString();

  // Auth errors are different than the JS Error object so any Auth errors will be dealt with in this if statement.
  // It is saying that if there is no JS error object and there is an error.message, it is an Auth error so show that error.
  if (!(error instanceof Error) && error.message) {
    message = error.message;
  }

  alert(message);
}
