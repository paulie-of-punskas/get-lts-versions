async function sendRequest(url: string, language: string): Promise<string> {
    /**
     * @param {string} language - name of the language.
     * @returns {Promise<string>} Promise, that resolves as string.
     */

    if (url === null) {
        const url :string = "https://endoflife.date/api/v1/products/`${language.toLowerCase()`";
    }

    const header = new Headers();
    header.append("Content-Type", "application/json");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: header,
        });
        if (!response.ok) {
            console.error(`Response status: ${response.status}`);
            return "";
        } else if (response.status == 404) {
            console.error(`${language} was not found on https://endoflife.date.`);
            return "";
        };
        const result = await response.text();
        return result;
    } catch(error) {
        if (error instanceof Error) {
            console.error(`Caught an error: ${error.message}`);
        }
        return "";
    };
};

