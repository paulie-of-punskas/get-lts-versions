export async function sendRequest(language: string, endpointURL: string = "https://endoflife.date/api/v1/products/"): Promise<string> {
  /**
   * @param {string} language - name of the language.
   * @param {string} endpointURL - optional, URL with endpoint. By default it's https://endoflife.date/api/v1/products/
   * @returns {Promise<string>} Promise, that resolves as string.
   */

  const url: string = `${endpointURL}/${language.toLowerCase()}`;
  const header: Headers = new Headers();
  header.append("Content-Type", "application/json");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: header,
    });
    if (!response.ok && response.status != 404) {
      console.error(`Response status: ${response.status}`);
      return "";
    } else if (response.status == 404) {
      console.error(`${language} was not found on https://endoflife.date.`);
      return "";
    }
    const result = await response.text();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Caught an error: ${error.message}`);
    }
    return "";
  }
}
