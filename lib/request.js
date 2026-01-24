"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequest = sendRequest;
function sendRequest(language) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * @param {string} language - name of the language.
         * @returns {Promise<string>} Promise, that resolves as string.
         */
        const url = `https://endoflife.date/api/v1/products/${language.toLowerCase()}`;
        const header = new Headers();
        header.append("Content-Type", "application/json");
        try {
            const response = yield fetch(url, {
                method: "GET",
                headers: header,
            });
            if (!response.ok) {
                console.error(`Response status: ${response.status}`);
                return "";
            }
            else if (response.status == 404) {
                console.error(`${language} was not found on https://endoflife.date.`);
                return "";
            }
            ;
            const result = yield response.text();
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Caught an error: ${error.message}`);
            }
            return "";
        }
        ;
    });
}
;
