import { sendRequest } from "../src/request";

describe("sendRequest()", () => {
  test("function should return empty string, if language is not available", async () => {
    const result: string = await sendRequest("labasrytas");
    expect(result).toEqual("");
  });
});
