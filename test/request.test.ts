import { sendRequest } from "../src/request";
import { jest } from "@jest/globals";

describe("sendRequest()", () => {
  test("function should return empty string, if language is not available", async () => {
    const result: string = await sendRequest("labasrytas");
    expect(result).toEqual("");
  });
});

global.fetch = jest.fn();
const mockedFetch = global.fetch as jest.Mock;
const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("sendRequest() - mock", () => {
  beforeEach(() => {
    mockedFetch.mockClear();
  });

  test("should return an array on success", async () => {
    const mockResponseText = "['version1', 'version2']";

    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(mockResponseText),
    });

    const result: string = await sendRequest("java");
    expect(result).toBe(mockResponseText);
  });

  test("simulate 404", async () => {
    const mockResponseText = "";

    mockedFetch.mockResolvedValue({
      ok: false,
      status: 404,
      text: jest.fn().mockResolvedValue(mockResponseText),
    });

    const result: string = await sendRequest("golang");
    expect(result).toBe(mockResponseText);
  });

  test("simulate network error", async () => {
    const networkError = new Error("Network request failed");
    mockedFetch.mockResolvedValue({
      ok: false,
      status: 400,
    });

    const result: string = await sendRequest(
      "python",
      "https://malformed_url.90s",
    );
    expect(result).toBe("");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Response status: 400");
  });
});
