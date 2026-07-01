import { vi } from "vitest";

vi.mock("next/server", () => {
  class MockNextRequest {
    url: string;
    method: string;
    headers: Headers;
    private _cookies: Map<string, string> = new Map();
    private _body: any;

    constructor(input: string | URL, init?: any) {
      this.url = typeof input === "string" ? input : input.href;
      this.method = (init?.method as string) || "GET";
      this.headers = new Headers(init?.headers || {});
      if (init?.cookies) {
        for (const [k, v] of Object.entries(init.cookies)) {
          this._cookies.set(k, v as string);
        }
      }
      if (init?.body) this._body = init.body;
    }

    get cookies() {
      const map = this._cookies;
      return {
        get: (name: string) => {
          const val = map.get(name);
          return val ? { value: val } : undefined;
        },
        set: (name: string, value: string) => map.set(name, value),
        has: (name: string) => map.has(name),
      };
    }

    async json() {
      if (typeof this._body === "string") return JSON.parse(this._body);
      if (typeof this._body === "object") return this._body;
      return {};
    }
  }

  class MockNextResponse extends Response {
    private _cookieValues: Map<string, string> = new Map();

    static json(data: any, init?: ResponseInit) {
      const body = JSON.stringify(data);
      return new MockNextResponse(body, {
        ...init,
        headers: {
          "content-type": "application/json",
          ...(init?.headers || ({} as Record<string, string>)),
        },
      });
    }

    get cookies() {
      return {
        set: (name: string, value: string, _options?: any) => {
          this._cookieValues.set(name, value);
        },
        get: (name: string) => this._cookieValues.get(name),
      };
    }
  }

  return { NextRequest: MockNextRequest, NextResponse: MockNextResponse };
});

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue({ messageId: "mock" }),
    }),
  },
}));

vi.mock("@/lib/mail", () => ({
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

global.fetch = vi.fn().mockResolvedValue(new Response("ok"));
