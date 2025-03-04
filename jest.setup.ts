import "@testing-library/jest-dom";
import "whatwg-fetch";
import { server } from "./mocks/server";
import { TextEncoder, TextDecoder } from "util";

// TextEncoder/TextDecoder のポリフィルを追加
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// グローバルなJest設定
global.jest = jest;

// MSWサーバーの設定
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});
afterAll(() => server.close());
