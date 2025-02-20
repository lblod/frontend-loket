/**
 * A simple fetch wrapper that throws an error if the response is not "ok"
 */
export default async function fetch() {
  const response = await globalThis.fetch(...arguments);

  if (!response.ok) {
    throw new Error(
      `Something went wrong: ${response.status} ${response.statusText}`,
    );
  }

  return response;
}
