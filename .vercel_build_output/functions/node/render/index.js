var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// node_modules/@sveltejs/kit/dist/node.js
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      fulfil(data);
    });
  });
}

// .svelte-kit/output/server/app.js
var __require2 = typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue$1 = [];
function writable$1(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue$1.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page2, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page: page2
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page: page2
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(request2.path);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
function is_promise(value) {
  return value && typeof value === "object" && typeof value.then === "function";
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$7 = {
  code: "#svelte-announcer.svelte-u7bl1d{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>#svelte-announcer {\\n  position: absolute;\\n  left: 0;\\n  top: 0;\\n  clip: rect(0 0 0 0);\\n  clip-path: inset(50%);\\n  overflow: hidden;\\n  white-space: nowrap;\\n  width: 1px;\\n  height: 1px;\\n}</style>"],"names":[],"mappings":"AAqDO,iBAAiB,cAAC,CAAC,AACxB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACb,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$7);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-bd38ac33.js",
      css: [assets + "/_app/assets/start-808c0b29.css"],
      js: [assets + "/_app/start-bd38ac33.js", assets + "/_app/chunks/vendor-57f7ae41.js", assets + "/_app/chunks/singletons-12a22614.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var empty = () => ({});
var manifest = {
  assets: [{ "file": "favicon.png", "size": 1571, "type": "image/png" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/recommendations\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/recommendations/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/profile\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/profile/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/profile\/my-recommendations\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/profile/my-recommendations.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/profile\/watchlist\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/profile/watchlist.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/auth\/register\/?$/,
      params: empty,
      a: ["src/routes/auth/__layout.reset.svelte", "src/routes/auth/register.svelte"],
      b: []
    },
    {
      type: "page",
      pattern: /^\/auth\/sign-in\/?$/,
      params: empty,
      a: ["src/routes/auth/__layout.reset.svelte", "src/routes/auth/sign-in.svelte"],
      b: []
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$2;
  }),
  "src/routes/recommendations/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/profile/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/profile/my-recommendations.svelte": () => Promise.resolve().then(function() {
    return myRecommendations;
  }),
  "src/routes/profile/watchlist.svelte": () => Promise.resolve().then(function() {
    return watchlist;
  }),
  "src/routes/auth/__layout.reset.svelte": () => Promise.resolve().then(function() {
    return __layout_reset;
  }),
  "src/routes/auth/register.svelte": () => Promise.resolve().then(function() {
    return register;
  }),
  "src/routes/auth/sign-in.svelte": () => Promise.resolve().then(function() {
    return signIn;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-fb87748b.js", "css": ["assets/pages/__layout.svelte-f6afe7c5.css", "assets/RecommendationCard-a64eb665.css"], "js": ["pages/__layout.svelte-fb87748b.js", "chunks/vendor-57f7ae41.js", "chunks/api-a70f9d43.js", "chunks/RecommendationCard-cd1cc2c7.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-a8c5ab48.js", "css": [], "js": ["error.svelte-a8c5ab48.js", "chunks/vendor-57f7ae41.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-512b5b90.js", "css": [], "js": ["pages/index.svelte-512b5b90.js", "chunks/vendor-57f7ae41.js"], "styles": [] }, "src/routes/recommendations/index.svelte": { "entry": "pages/recommendations/index.svelte-e42a3a62.js", "css": ["assets/SortDropdowns.svelte_svelte&type=style&lang-3690ce98.css", "assets/RecommendationCard-a64eb665.css"], "js": ["pages/recommendations/index.svelte-e42a3a62.js", "chunks/vendor-57f7ae41.js", "chunks/RecommendationCard-cd1cc2c7.js", "chunks/api-a70f9d43.js"], "styles": [] }, "src/routes/profile/index.svelte": { "entry": "pages/profile/index.svelte-629c4cbf.js", "css": ["assets/RecommendationCard-a64eb665.css"], "js": ["pages/profile/index.svelte-629c4cbf.js", "chunks/vendor-57f7ae41.js", "chunks/api-a70f9d43.js", "chunks/RecommendationCard-cd1cc2c7.js"], "styles": [] }, "src/routes/profile/my-recommendations.svelte": { "entry": "pages/profile/my-recommendations.svelte-8d11f8e8.js", "css": [], "js": ["pages/profile/my-recommendations.svelte-8d11f8e8.js", "chunks/vendor-57f7ae41.js"], "styles": [] }, "src/routes/profile/watchlist.svelte": { "entry": "pages/profile/watchlist.svelte-8ba3d5b0.js", "css": ["assets/SortDropdowns.svelte_svelte&type=style&lang-3690ce98.css", "assets/RecommendationCard-a64eb665.css"], "js": ["pages/profile/watchlist.svelte-8ba3d5b0.js", "chunks/vendor-57f7ae41.js", "chunks/RecommendationCard-cd1cc2c7.js", "chunks/api-a70f9d43.js"], "styles": [] }, "src/routes/auth/__layout.reset.svelte": { "entry": "pages/auth/__layout.reset.svelte-42de8afb.js", "css": [], "js": ["pages/auth/__layout.reset.svelte-42de8afb.js", "chunks/vendor-57f7ae41.js"], "styles": [] }, "src/routes/auth/register.svelte": { "entry": "pages/auth/register.svelte-324d30f1.js", "css": [], "js": ["pages/auth/register.svelte-324d30f1.js", "chunks/vendor-57f7ae41.js"], "styles": [] }, "src/routes/auth/sign-in.svelte": { "entry": "pages/auth/sign-in.svelte-a2fba41f.js", "css": [], "js": ["pages/auth/sign-in.svelte-a2fba41f.js", "chunks/vendor-57f7ae41.js", "chunks/api-a70f9d43.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
var token = writable("");
var localTags = writable([]);
var showCreateRecommendation = writable(false);
var currentUser = writable();
var showUserMenu = writable(false);
var showUserRecommendations = writable(false);
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var baseURL = "http://localhost:3001";
var createURLString = (obj) => {
  let params = "";
  for (const key in obj.params) {
    params += `${key}=${obj.params[key]}&`;
  }
  let string = `${baseURL}/${obj.endpoint}`;
  if (params) {
    string += `?${params}`;
  }
  console.log(string);
  return string;
};
var api = (fetch2, queryObject, method = "GET") => __awaiter(void 0, void 0, void 0, function* () {
  const url = createURLString(queryObject);
  const resp = yield fetch2(url, { mode: "cors", method });
  const data = yield resp.json();
  return data;
});
var apiGet = (queryObject) => __awaiter(void 0, void 0, void 0, function* () {
  const url = createURLString(queryObject);
  let headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${get_store_value(token)}`
  };
  const resp = yield fetch(url, { method: "GET", headers, mode: "cors" });
  return resp;
});
var TagsInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_localTags;
  $$unsubscribe_localTags = subscribe(localTags, (value2) => value2);
  let { tags = [] } = $$props;
  let { hideNewTags } = $$props;
  let { handleSubmitTag = void 0 } = $$props;
  let { autoFocus } = $$props;
  let { value = "" } = $$props;
  let autocompleteTagValue = void 0;
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
    $$bindings.tags(tags);
  if ($$props.hideNewTags === void 0 && $$bindings.hideNewTags && hideNewTags !== void 0)
    $$bindings.hideNewTags(hideNewTags);
  if ($$props.handleSubmitTag === void 0 && $$bindings.handleSubmitTag && handleSubmitTag !== void 0)
    $$bindings.handleSubmitTag(handleSubmitTag);
  if ($$props.autoFocus === void 0 && $$bindings.autoFocus && autoFocus !== void 0)
    $$bindings.autoFocus(autoFocus);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  $$unsubscribe_localTags();
  return `<div class="${"flex flex-col"}"><div class="${"flex flex-row items-center"}"><div class="${"relative h-8 w-60"}">${value && autocompleteTagValue ? `<span class="${"absolute top-0 text-gray-400"}">${escape(autocompleteTagValue.name)}</span>` : ``}
      <input class="${"absolute top-0 recommendation-input bg-transparent border-b border-solid outline-none w-full hover:border-b-indigo-300 focus:border-b-indigo-700"}" placeholder="${"Type a tag here (*Enter)"}" type="${"text"}" ${autoFocus ? "autofocus" : ""}${add_attribute("value", value, 0)}></div>
    <button class="${"h-8 flex items-center text-xs ml-2 text-indigo-700"}">${escape("Need inspiration?")}</button></div>
  ${!hideNewTags ? `<div class="${"flex flex-row"}">${each(tags, (tag) => `<button class="${"text-xs rounded-full border-solid border-1 px-2 mr-1 mb-1 border-indigo-600"}">${escape(tag.name)} x</button>`)}</div>` : ``}

  ${``}</div>`;
});
var nonCapTitleWords = [
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "of",
  "off",
  "on",
  "onto",
  "or",
  "so",
  "than",
  "the",
  "to",
  "up",
  "via",
  "with",
  "yet"
];
var toTitleCase = (s2, splitOn = " ") => {
  const mapFunc = (w, i, a) => {
    if (nonCapTitleWords.includes(w) && (i !== 0 || i !== a.length - 1)) {
      return w;
    } else {
      return w[0].toUpperCase() + w.substr(1);
    }
  };
  return s2 == null ? void 0 : s2.toLowerCase().split(splitOn).map(mapFunc).join(" ");
};
var css$6 = {
  code: ".radio-input.selected.svelte-106gxlp{--tw-border-opacity:1;border-color:rgba(79, 70, 229, var(--tw-border-opacity))}.circle.selected.svelte-106gxlp{--tw-bg-opacity:1;background-color:rgba(79, 70, 229, var(--tw-bg-opacity));--tw-border-opacity:1;border-color:rgba(67, 56, 202, var(--tw-border-opacity))}",
  map: `{"version":3,"file":"RadioInput.svelte","sources":["RadioInput.svelte"],"sourcesContent":["<script lang='ts'>import { toTitleCase } from \\"../helpers\\";\\nexport let classes = '';\\nexport let text;\\nexport let selected;\\nexport let onClick;\\n<\/script>\\n\\n<button on:click={onClick} class='{classes} radio-input h-6 px-2 rounded-lg border-1 border-indigo-200 hover:border-indigo-400 flex items-center text-sm' class:selected>\\n  <div class='circle h-2 w-2 rounded-full border-solid border-1 border-indigo-200 mr-2' class:selected />\\n  {toTitleCase(text)}\\n</button>\\n\\n<style>.radio-input.selected {\\n  --tw-border-opacity: 1;\\n  border-color: rgba(79, 70, 229, var(--tw-border-opacity));\\n}\\n.circle.selected {\\n  --tw-bg-opacity: 1;\\n  background-color: rgba(79, 70, 229, var(--tw-bg-opacity));\\n  --tw-border-opacity: 1;\\n  border-color: rgba(67, 56, 202, var(--tw-border-opacity));\\n}</style>"],"names":[],"mappings":"AAYO,YAAY,SAAS,eAAC,CAAC,AAC5B,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AAC3D,CAAC,AACD,OAAO,SAAS,eAAC,CAAC,AAChB,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,CACzD,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AAC3D,CAAC"}`
};
var RadioInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { classes = "" } = $$props;
  let { text } = $$props;
  let { selected } = $$props;
  let { onClick } = $$props;
  if ($$props.classes === void 0 && $$bindings.classes && classes !== void 0)
    $$bindings.classes(classes);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.onClick === void 0 && $$bindings.onClick && onClick !== void 0)
    $$bindings.onClick(onClick);
  $$result.css.add(css$6);
  return `<button class="${[
    escape(classes) + " radio-input h-6 px-2 rounded-lg border-1 border-indigo-200 hover:border-indigo-400 flex items-center text-sm svelte-106gxlp",
    selected ? "selected" : ""
  ].join(" ").trim()}"><div class="${[
    "circle h-2 w-2 rounded-full border-solid border-1 border-indigo-200 mr-2 svelte-106gxlp",
    selected ? "selected" : ""
  ].join(" ").trim()}"></div>
  ${escape(toTitleCase(text))}
</button>`;
});
var NetflixLogo = "/_app/assets/netflix-logo-4948a7b6.jpg";
var HboMaxLogo = "/_app/assets/hbo-max-logo-a762c294.png";
var HuluLogo = "/_app/assets/hulu-logo-a7b04462.png";
var PrimeVideoLogo = "/_app/assets/prime-video-logo-d1efc8f4.jpeg";
var DisneyPlusLogo = "/_app/assets/disney-plus-logo-6ea15fc3.jpeg";
var css$5 = {
  code: ".recommendation-input.svelte-cbmdi7:hover{--tw-border-opacity:1;border-bottom-color:rgba(165, 180, 252, var(--tw-border-opacity))}.recommendation-input.svelte-cbmdi7:focus{--tw-border-opacity:1;border-bottom-color:rgba(67, 56, 202, var(--tw-border-opacity))}.recommendation-input.svelte-cbmdi7{border-style:solid;border-bottom-width:1px;outline:2px solid transparent;outline-offset:2px}.selected.svelte-cbmdi7{--tw-border-opacity:1;border-color:rgba(79, 70, 229, var(--tw-border-opacity))}.selected.svelte-cbmdi7:hover{--tw-border-opacity:1;border-color:rgba(79, 70, 229, var(--tw-border-opacity))}.submit-btn.disabled.svelte-cbmdi7{cursor:default;opacity:0.5}.form-label.svelte-cbmdi7{font-weight:600;font-size:0.75rem;line-height:1rem;margin-bottom:0.25rem}",
  map: `{"version":3,"file":"CreateRecommendation.svelte","sources":["CreateRecommendation.svelte"],"sourcesContent":["<script lang='ts'>var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { apiPatch, baseURL } from \\"../api/api.svelte\\";\\nimport { currentUser, token } from \\"../stores/main\\";\\nimport TagsInput from \\"./TagsInput.svelte\\";\\nimport RadioInput from \\"./RadioInput.svelte\\";\\nimport NetflixLogo from '../assets/netflix-logo.jpg';\\nimport HboMaxLogo from '../assets/hbo-max-logo.png';\\nimport HuluLogo from '../assets/hulu-logo.png';\\nimport PrimeVideoLogo from '../assets/prime-video-logo.jpeg';\\nimport DisneyPlusLogo from '../assets/disney-plus-logo.jpeg';\\nconst catOptions = ['Yes', 'No', 'Maybe'];\\nconst orionSeenOptions = ['Seen', 'Want to see', 'Do not want to see', \\"Seen so you don't have to\\", \\"?\\", \\"???\\", \\"Not Sure\\", \\"huh\\"];\\nconst colorOptions = ['Color', 'Black and White', 'Blue', 'Color but like really low chroma-keyed', 'Neon', 'Nightcam', 'Varied'];\\nconst mediumOptions = [\\n    'movie',\\n    'film',\\n    'tv series',\\n    'tv episode',\\n    'tv episodes',\\n    'miniseries',\\n    'album',\\n    'song',\\n    'video game'\\n];\\nconst ernestPhotoLinks = [\\n    'https://lh6.googleusercontent.com/_LW0Bz4dAW5_5-Y1rRnPhrj1FkP3J4oJq7wzrDcm4XFHFf6xaD9dWTCf_qeW6l4tXAsJN7UWHD_6uHWBhbxhnPaLHuvqA5MohWsyLPQ0LNk9T7vfHiRfAHTH1fnpb6csW2slEK4dAA=s0',\\n    'https://lh3.googleusercontent.com/G9D7tb-WrbFNcXd5531tOKMpR6pa4dkOvFkBGwkthlXuZy44GGY2u8meFlznDBQXWR1rDPkZ0fFsfKlDdJ_NxTJbLITkHo3kVYVdqh25AxvIMjRp0NnQmZKqCG6hvffshcg4CkWuyA=s0',\\n    'https://lh5.googleusercontent.com/nCdhhIY7TQW9l2blKWzbdFhMlo6e3Js0YCJjId88MZE8E3XJ_5wAwJvr5ln5FQNSCpc_oTgT_ZvY3eqDnHg5E6tbXO1P8d8W9taToMZFOCRD51g4nLBWN55xjTmQ6tu5rsbwFh8SOQ=s0',\\n    'https://lh3.googleusercontent.com/kHs8JOatiCodtjrHjpyv9Zmn2pd_Vna1aldOFXST88UTNwVLpYNWjh3X8WJ-7etIgkDxpEdd42xDrVhj1IrfEbAkTM_e0nWnZ2A_mKVasNmS5lnOQp00PzHhcLzztcrgs24Gi7ZJaw=s0',\\n    'https://lh6.googleusercontent.com/oht67JP_emMwFTjEGyQ9H7qTezVT6SJNA4Qtndn74pxgZalYDepCAFuo_zaXxNcdTntPjSsF3DOU2SMH9pMbLAzDdlfm-xRI4ocYSYlHfBIuLF6jCchMQm9PUeKGGJNqw77Ul1Y0OA=s0',\\n    'https://lh6.googleusercontent.com/Wp9wFKBCSjE_9-lMRSQ6Q8_OTNXg3DCxn50ahU2ESgBP_z6v74CjDTACMOwbhk52SO3IWKj6gLPQbMVaH7pykNJIFx0cTLopk7ifFoyq62pgd9bicu_NIjtNfZuPKg1RSV4csiNqdw=s0',\\n    'https://lh3.googleusercontent.com/GSzaxovkjK9MlAGK-wQC-fjcQFP0E51t1XI4PJLeqQ4RIlqbUefUp92Rp5lG-heXAyd0KDzw2z5QVae6klUAu-cfQt86_7FIP-sPhk8OoM3acbzrlkHT-CwFhz2DEGlxIkCN8XY4LQ=s0',\\n    'https://lh5.googleusercontent.com/4JMEyf8cZHhfm4NUKYDqo7uGYHvNjWAmXlrcnmbNW2_7b60PhOQ7PmIIu53taNotib_IWa_a0vfwuykler06AFinBwFtuX_sZ2R9JTRu-sl_psv4_FN-oxKgf-aLJS1UaFERJk-b-g=s0'\\n];\\nconst streamingOptions = [\\n    {\\n        key: 'netflix',\\n        name: 'Netflix',\\n        img: NetflixLogo\\n    },\\n    {\\n        key: 'hulu',\\n        name: 'Hulu',\\n        img: HuluLogo\\n    },\\n    {\\n        key: 'prime-video',\\n        name: 'Prime Video',\\n        img: PrimeVideoLogo\\n    },\\n    {\\n        key: 'disney-plus',\\n        name: 'Disney Plus',\\n        img: DisneyPlusLogo\\n    },\\n    {\\n        key: 'hbo-max',\\n        name: 'HBO Max',\\n        img: HboMaxLogo\\n    },\\n];\\nexport let editMode = false;\\nexport let existingRecommendation = undefined;\\nexport let editModeCallback = undefined;\\nexport let onHideModal = undefined;\\nexport let title = '';\\nexport let medium = '';\\nexport let catsHate = '';\\nexport let orionSeen = 'Not Sure';\\nexport let ernestRating = '';\\nexport let colorization = '';\\nexport let tags = [];\\nexport let availableOn = '';\\nexport let trailerLink = '';\\nexport let spotifyLink = '';\\nexport let bandcampLink = '';\\nexport let soundcloudLink = '';\\nlet showOrionError = false;\\nconst handleSubmit = () => __awaiter(void 0, void 0, void 0, function* () {\\n    const body = {\\n        recommendation: {\\n            title,\\n            medium,\\n            do_journeys_cats_hate: catsHate,\\n            has_orion_seen: orionSeen,\\n            ernest_rating: ernestRating,\\n            colorization: colorization,\\n            youtube_link: trailerLink,\\n            available_on: availableOn\\n        },\\n        tags\\n    };\\n    const url = baseURL + '/recommendations';\\n    const resp = yield fetch(url, {\\n        method: 'POST',\\n        headers: {\\n            'Authorization': \`Bearer \${$token}\`,\\n            'Content-Type': 'application/json'\\n        },\\n        body: JSON.stringify(body)\\n    });\\n    if (resp.status === 200) {\\n        const data = yield resp.json();\\n        onHideModal();\\n    }\\n});\\nconst handlePatchRecommendation = () => __awaiter(void 0, void 0, void 0, function* () {\\n    const recommendation = {};\\n    if (title !== existingRecommendation.title) {\\n        recommendation.title = title;\\n    }\\n    if (medium !== existingRecommendation.medium) {\\n        recommendation.medium = medium;\\n    }\\n    if (catsHate !== existingRecommendation.do_journeys_cats_hate) {\\n        recommendation.do_journeys_cats_hate = catsHate;\\n    }\\n    if (orionSeen !== existingRecommendation.has_orion_seen) {\\n        recommendation.has_orion_seen = orionSeen;\\n    }\\n    if (ernestRating !== existingRecommendation.ernest_rating) {\\n        recommendation.ernest_rating = ernestRating;\\n    }\\n    if (colorization !== existingRecommendation.colorization) {\\n        recommendation.colorization = colorization;\\n    }\\n    if (availableOn !== existingRecommendation.available_on) {\\n        recommendation.available_on = availableOn;\\n    }\\n    if (trailerLink !== existingRecommendation.youtube_link) {\\n        recommendation.youtube_link = trailerLink;\\n    }\\n    if (spotifyLink !== existingRecommendation.spotify_link) {\\n        recommendation.spotify_link = spotifyLink;\\n    }\\n    if (bandcampLink !== existingRecommendation.bandcamp_link) {\\n        recommendation.bandcamp_link = bandcampLink;\\n    }\\n    if (soundcloudLink !== existingRecommendation.soundcloud_link) {\\n        recommendation.soundcloud_link = soundcloudLink;\\n    }\\n    const obj = {\\n        endpoint: \`recommendations/\${existingRecommendation.id}\`,\\n        body: {\\n            recommendation\\n        }\\n    };\\n    const resp = yield apiPatch(obj);\\n    if (resp.status === 200) {\\n        const body = yield resp.json();\\n        if (editModeCallback) {\\n            editModeCallback(body);\\n        }\\n    }\\n});\\nconst handleOrionSeen = (option) => {\\n    if (!$currentUser.name.toLowerCase().includes('orion')) {\\n        showOrionError = true;\\n    }\\n    else {\\n        orionSeen = option;\\n    }\\n};\\n$: isVisualMedia = medium === 'movie' || medium === 'film' || medium === 'tv series' || medium === 'tv episode' || medium === 'tv episodes' || medium === 'miniseries';\\n$: disableSubmit = !title || !medium || !colorization || (!editMode && tags.length === 0);\\n<\/script>\\n\\n<div class='space-y-5'>\\n  <div class='flex flex-col'>\\n    <span class='text-xs mb-1'>Title*</span>\\n    <input\\n      class='recommendation-input'\\n      placeholder='Enter Movie Name'\\n      type='text'\\n      bind:value={title}\\n    >\\n  </div>\\n\\n  {#if !editMode}\\n    <div>\\n      <span class='text-xs mb-1'>Tags (hit \\"enter\\" or \\"tab\\" to submit)*</span>\\n      <TagsInput\\n        bind:tags={tags}\\n      />\\n    </div>\\n  {/if}\\n\\n  <div>\\n    <span class='form-label'>Medium:*</span>\\n    <div class='flex flex-wrap -mt-2'>\\n      {#each mediumOptions as option}\\n        <RadioInput\\n          classes='mt-2 mr-2'\\n          text={option}\\n          onClick={() => medium = option}\\n          selected={medium === option}\\n        />\\n      {/each}\\n    </div>\\n  </div>\\n\\n  {#if isVisualMedia}\\n    <div class='w-full flex flex-col'>\\n      <span class='form-label'>Add Trailer Link</span>\\n      <input\\n        class='recommendation-input'\\n        placeholder='Paste a Youtube Link Here'\\n        type='text'\\n        bind:value={trailerLink}\\n      >\\n    </div>\\n    \\n    <div class='w-full flex flex-col'>\\n      <span class='form-label'>Available On</span>\\n      <div class='flex space-x-2'>\\n        {#each streamingOptions as option}\\n          <button class:selected={availableOn === option.key} class='rounded-lg overflow-hidden border-3 border-solid border-transparent hover:border-indigo-200' on:click={() => availableOn = option.key}>\\n            <img alt={option.name} src={option.img} />\\n          </button>\\n        {/each}\\n      </div>\\n    </div>\\n\\n    <div class='flex flex-col'>\\n      <span class='form-label'>Colorization*</span>\\n      <div class='flex flex-wrap -mt-2'>\\n        {#each colorOptions as option}\\n          <RadioInput\\n            classes='mt-2 mr-2'\\n            text={option}\\n            onClick={() => colorization = option}\\n            selected={colorization === option}\\n          />\\n        {/each}\\n      </div>\\n    </div>\\n  {/if}\\n\\n  {#if colorization}\\n    <div>\\n      <span class='form-label'>Do Journey's cats hate this?*</span>\\n      <div class='flex space-x-2'>\\n        {#each catOptions as option}\\n          <RadioInput\\n            text={option}\\n            onClick={() => catsHate = option}\\n            selected={catsHate === option}\\n          />\\n        {/each}\\n      </div>\\n    </div>\\n\\n    <div class='w-full'>\\n      <div class='flex flex-col mb-1'>\\n        <span class='form-label'>Has Orion seen this?</span>\\n        {#if showOrionError}\\n          <span class='text-xs text-red-600'>Oops! Only Orion can update this. If you feel you're seeing this message in error, please contact Orion for his login information.</span>\\n        {/if}\\n      </div>\\n      <div class='flex flex-wrap -mt-2'>\\n        {#each orionSeenOptions as option}\\n          <RadioInput\\n            classes='mr-2 mt-2'\\n            text={option}\\n            onClick={() => handleOrionSeen(option)}\\n            selected={orionSeen === option}\\n          />\\n        {/each}\\n      </div>\\n    </div>\\n\\n    <div class='flex flex-col'>\\n      <span class='mb-1 text-xs font-semibold'>Ernest Rating</span>\\n      <div class='flex'>\\n        <span class='text-xs mr-2'>Select</span>\\n        {#if ernestPhotoLinks.includes(ernestRating)}\\n          <button class='text-xs text-red-500' on:click={() => ernestRating = ''}>clear</button>\\n        {/if}\\n      </div>\\n      <div class='flex flex-wrap'>\\n        {#each ernestPhotoLinks as photoLink}\\n          <button class='rounded-lg img-wrap mr-1 mb-2 border-3 border-solid border-transparent hover:border-indigo-200' class:selected={ernestRating === photoLink} on:click={() => ernestRating = photoLink}>\\n            <img class='h-20 w-auto' alt='ernest' src={photoLink} />\\n          </button>\\n        {/each}\\n      </div>\\n      <span class='text-xs mb-1'>Or paste a link</span>\\n      <input\\n        class='recommendation-input'\\n        placeholder='If none of these fit, paste a link to a photo here'\\n        type='text'\\n        bind:value={ernestRating}\\n      >\\n    </div>\\n  {/if}\\n\\n  <div class='w-full flex justify-center'>\\n    <button disabled={disableSubmit} class:disabled={disableSubmit} on:click={editMode ? handlePatchRecommendation : handleSubmit} class='submit-btn bg-indigo-600 hover:bg-indigo-700 h-12 flex items-center px-4 text-white rounded-lg'>\\n      {editMode ? \\"Save Changes\\" : \\"Submit this Recommendation\\"}\\n    </button>\\n  </div>\\n  \\n</div>\\n\\n<style>.recommendation-input:hover {\\n  --tw-border-opacity: 1;\\n  border-bottom-color: rgba(165, 180, 252, var(--tw-border-opacity));\\n}\\n.recommendation-input:focus {\\n  --tw-border-opacity: 1;\\n  border-bottom-color: rgba(67, 56, 202, var(--tw-border-opacity));\\n}\\n.recommendation-input {\\n  border-style: solid;\\n  border-bottom-width: 1px;\\n  outline: 2px solid transparent;\\n  outline-offset: 2px;\\n}\\n.selected {\\n  --tw-border-opacity: 1;\\n  border-color: rgba(79, 70, 229, var(--tw-border-opacity));\\n}\\n.selected:hover {\\n  --tw-border-opacity: 1;\\n  border-color: rgba(79, 70, 229, var(--tw-border-opacity));\\n}\\n.submit-btn.disabled {\\n  cursor: default;\\n  opacity: 0.5;\\n}\\n.form-label {\\n  font-weight: 600;\\n  font-size: 0.75rem;\\n  line-height: 1rem;\\n  margin-bottom: 0.25rem;\\n}</style>"],"names":[],"mappings":"AAwTO,mCAAqB,MAAM,AAAC,CAAC,AAClC,mBAAmB,CAAE,CAAC,CACtB,mBAAmB,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AACpE,CAAC,AACD,mCAAqB,MAAM,AAAC,CAAC,AAC3B,mBAAmB,CAAE,CAAC,CACtB,mBAAmB,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AAClE,CAAC,AACD,qBAAqB,cAAC,CAAC,AACrB,YAAY,CAAE,KAAK,CACnB,mBAAmB,CAAE,GAAG,CACxB,OAAO,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,CAC9B,cAAc,CAAE,GAAG,AACrB,CAAC,AACD,SAAS,cAAC,CAAC,AACT,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AAC3D,CAAC,AACD,uBAAS,MAAM,AAAC,CAAC,AACf,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AAC3D,CAAC,AACD,WAAW,SAAS,cAAC,CAAC,AACpB,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,GAAG,AACd,CAAC,AACD,WAAW,cAAC,CAAC,AACX,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,OAAO,CAClB,WAAW,CAAE,IAAI,CACjB,aAAa,CAAE,OAAO,AACxB,CAAC"}`
};
var CreateRecommendation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isVisualMedia;
  let disableSubmit;
  let $currentUser, $$unsubscribe_currentUser;
  let $$unsubscribe_token;
  $$unsubscribe_currentUser = subscribe(currentUser, (value) => $currentUser = value);
  $$unsubscribe_token = subscribe(token, (value) => value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  const catOptions = ["Yes", "No", "Maybe"];
  const orionSeenOptions = [
    "Seen",
    "Want to see",
    "Do not want to see",
    "Seen so you don't have to",
    "?",
    "???",
    "Not Sure",
    "huh"
  ];
  const colorOptions = [
    "Color",
    "Black and White",
    "Blue",
    "Color but like really low chroma-keyed",
    "Neon",
    "Nightcam",
    "Varied"
  ];
  const mediumOptions = [
    "movie",
    "film",
    "tv series",
    "tv episode",
    "tv episodes",
    "miniseries",
    "album",
    "song",
    "video game"
  ];
  const ernestPhotoLinks = [
    "https://lh6.googleusercontent.com/_LW0Bz4dAW5_5-Y1rRnPhrj1FkP3J4oJq7wzrDcm4XFHFf6xaD9dWTCf_qeW6l4tXAsJN7UWHD_6uHWBhbxhnPaLHuvqA5MohWsyLPQ0LNk9T7vfHiRfAHTH1fnpb6csW2slEK4dAA=s0",
    "https://lh3.googleusercontent.com/G9D7tb-WrbFNcXd5531tOKMpR6pa4dkOvFkBGwkthlXuZy44GGY2u8meFlznDBQXWR1rDPkZ0fFsfKlDdJ_NxTJbLITkHo3kVYVdqh25AxvIMjRp0NnQmZKqCG6hvffshcg4CkWuyA=s0",
    "https://lh5.googleusercontent.com/nCdhhIY7TQW9l2blKWzbdFhMlo6e3Js0YCJjId88MZE8E3XJ_5wAwJvr5ln5FQNSCpc_oTgT_ZvY3eqDnHg5E6tbXO1P8d8W9taToMZFOCRD51g4nLBWN55xjTmQ6tu5rsbwFh8SOQ=s0",
    "https://lh3.googleusercontent.com/kHs8JOatiCodtjrHjpyv9Zmn2pd_Vna1aldOFXST88UTNwVLpYNWjh3X8WJ-7etIgkDxpEdd42xDrVhj1IrfEbAkTM_e0nWnZ2A_mKVasNmS5lnOQp00PzHhcLzztcrgs24Gi7ZJaw=s0",
    "https://lh6.googleusercontent.com/oht67JP_emMwFTjEGyQ9H7qTezVT6SJNA4Qtndn74pxgZalYDepCAFuo_zaXxNcdTntPjSsF3DOU2SMH9pMbLAzDdlfm-xRI4ocYSYlHfBIuLF6jCchMQm9PUeKGGJNqw77Ul1Y0OA=s0",
    "https://lh6.googleusercontent.com/Wp9wFKBCSjE_9-lMRSQ6Q8_OTNXg3DCxn50ahU2ESgBP_z6v74CjDTACMOwbhk52SO3IWKj6gLPQbMVaH7pykNJIFx0cTLopk7ifFoyq62pgd9bicu_NIjtNfZuPKg1RSV4csiNqdw=s0",
    "https://lh3.googleusercontent.com/GSzaxovkjK9MlAGK-wQC-fjcQFP0E51t1XI4PJLeqQ4RIlqbUefUp92Rp5lG-heXAyd0KDzw2z5QVae6klUAu-cfQt86_7FIP-sPhk8OoM3acbzrlkHT-CwFhz2DEGlxIkCN8XY4LQ=s0",
    "https://lh5.googleusercontent.com/4JMEyf8cZHhfm4NUKYDqo7uGYHvNjWAmXlrcnmbNW2_7b60PhOQ7PmIIu53taNotib_IWa_a0vfwuykler06AFinBwFtuX_sZ2R9JTRu-sl_psv4_FN-oxKgf-aLJS1UaFERJk-b-g=s0"
  ];
  const streamingOptions2 = [
    {
      key: "netflix",
      name: "Netflix",
      img: NetflixLogo
    },
    { key: "hulu", name: "Hulu", img: HuluLogo },
    {
      key: "prime-video",
      name: "Prime Video",
      img: PrimeVideoLogo
    },
    {
      key: "disney-plus",
      name: "Disney Plus",
      img: DisneyPlusLogo
    },
    {
      key: "hbo-max",
      name: "HBO Max",
      img: HboMaxLogo
    }
  ];
  let { editMode = false } = $$props;
  let { existingRecommendation = void 0 } = $$props;
  let { editModeCallback = void 0 } = $$props;
  let { onHideModal = void 0 } = $$props;
  let { title = "" } = $$props;
  let { medium = "" } = $$props;
  let { catsHate = "" } = $$props;
  let { orionSeen = "Not Sure" } = $$props;
  let { ernestRating = "" } = $$props;
  let { colorization = "" } = $$props;
  let { tags = [] } = $$props;
  let { availableOn = "" } = $$props;
  let { trailerLink = "" } = $$props;
  let { spotifyLink = "" } = $$props;
  let { bandcampLink = "" } = $$props;
  let { soundcloudLink = "" } = $$props;
  let showOrionError = false;
  const handleOrionSeen = (option) => {
    if (!$currentUser.name.toLowerCase().includes("orion")) {
      showOrionError = true;
    } else {
      orionSeen = option;
    }
  };
  if ($$props.editMode === void 0 && $$bindings.editMode && editMode !== void 0)
    $$bindings.editMode(editMode);
  if ($$props.existingRecommendation === void 0 && $$bindings.existingRecommendation && existingRecommendation !== void 0)
    $$bindings.existingRecommendation(existingRecommendation);
  if ($$props.editModeCallback === void 0 && $$bindings.editModeCallback && editModeCallback !== void 0)
    $$bindings.editModeCallback(editModeCallback);
  if ($$props.onHideModal === void 0 && $$bindings.onHideModal && onHideModal !== void 0)
    $$bindings.onHideModal(onHideModal);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.medium === void 0 && $$bindings.medium && medium !== void 0)
    $$bindings.medium(medium);
  if ($$props.catsHate === void 0 && $$bindings.catsHate && catsHate !== void 0)
    $$bindings.catsHate(catsHate);
  if ($$props.orionSeen === void 0 && $$bindings.orionSeen && orionSeen !== void 0)
    $$bindings.orionSeen(orionSeen);
  if ($$props.ernestRating === void 0 && $$bindings.ernestRating && ernestRating !== void 0)
    $$bindings.ernestRating(ernestRating);
  if ($$props.colorization === void 0 && $$bindings.colorization && colorization !== void 0)
    $$bindings.colorization(colorization);
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
    $$bindings.tags(tags);
  if ($$props.availableOn === void 0 && $$bindings.availableOn && availableOn !== void 0)
    $$bindings.availableOn(availableOn);
  if ($$props.trailerLink === void 0 && $$bindings.trailerLink && trailerLink !== void 0)
    $$bindings.trailerLink(trailerLink);
  if ($$props.spotifyLink === void 0 && $$bindings.spotifyLink && spotifyLink !== void 0)
    $$bindings.spotifyLink(spotifyLink);
  if ($$props.bandcampLink === void 0 && $$bindings.bandcampLink && bandcampLink !== void 0)
    $$bindings.bandcampLink(bandcampLink);
  if ($$props.soundcloudLink === void 0 && $$bindings.soundcloudLink && soundcloudLink !== void 0)
    $$bindings.soundcloudLink(soundcloudLink);
  $$result.css.add(css$5);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    isVisualMedia = medium === "movie" || medium === "film" || medium === "tv series" || medium === "tv episode" || medium === "tv episodes" || medium === "miniseries";
    disableSubmit = !title || !medium || !colorization || !editMode && tags.length === 0;
    $$rendered = `<div class="${"space-y-5"}"><div class="${"flex flex-col"}"><span class="${"text-xs mb-1"}">Title*</span>
    <input class="${"recommendation-input svelte-cbmdi7"}" placeholder="${"Enter Movie Name"}" type="${"text"}"${add_attribute("value", title, 0)}></div>

  ${!editMode ? `<div><span class="${"text-xs mb-1"}">Tags (hit &quot;enter&quot; or &quot;tab&quot; to submit)*</span>
      ${validate_component(TagsInput, "TagsInput").$$render($$result, { tags }, {
      tags: ($$value) => {
        tags = $$value;
        $$settled = false;
      }
    }, {})}</div>` : ``}

  <div><span class="${"form-label svelte-cbmdi7"}">Medium:*</span>
    <div class="${"flex flex-wrap -mt-2"}">${each(mediumOptions, (option) => `${validate_component(RadioInput, "RadioInput").$$render($$result, {
      classes: "mt-2 mr-2",
      text: option,
      onClick: () => medium = option,
      selected: medium === option
    }, {}, {})}`)}</div></div>

  ${isVisualMedia ? `<div class="${"w-full flex flex-col"}"><span class="${"form-label svelte-cbmdi7"}">Add Trailer Link</span>
      <input class="${"recommendation-input svelte-cbmdi7"}" placeholder="${"Paste a Youtube Link Here"}" type="${"text"}"${add_attribute("value", trailerLink, 0)}></div>
    
    <div class="${"w-full flex flex-col"}"><span class="${"form-label svelte-cbmdi7"}">Available On</span>
      <div class="${"flex space-x-2"}">${each(streamingOptions2, (option) => `<button class="${[
      "rounded-lg overflow-hidden border-3 border-solid border-transparent hover:border-indigo-200 svelte-cbmdi7",
      availableOn === option.key ? "selected" : ""
    ].join(" ").trim()}"><img${add_attribute("alt", option.name, 0)}${add_attribute("src", option.img, 0)}>
          </button>`)}</div></div>

    <div class="${"flex flex-col"}"><span class="${"form-label svelte-cbmdi7"}">Colorization*</span>
      <div class="${"flex flex-wrap -mt-2"}">${each(colorOptions, (option) => `${validate_component(RadioInput, "RadioInput").$$render($$result, {
      classes: "mt-2 mr-2",
      text: option,
      onClick: () => colorization = option,
      selected: colorization === option
    }, {}, {})}`)}</div></div>` : ``}

  ${colorization ? `<div><span class="${"form-label svelte-cbmdi7"}">Do Journey&#39;s cats hate this?*</span>
      <div class="${"flex space-x-2"}">${each(catOptions, (option) => `${validate_component(RadioInput, "RadioInput").$$render($$result, {
      text: option,
      onClick: () => catsHate = option,
      selected: catsHate === option
    }, {}, {})}`)}</div></div>

    <div class="${"w-full"}"><div class="${"flex flex-col mb-1"}"><span class="${"form-label svelte-cbmdi7"}">Has Orion seen this?</span>
        ${showOrionError ? `<span class="${"text-xs text-red-600"}">Oops! Only Orion can update this. If you feel you&#39;re seeing this message in error, please contact Orion for his login information.</span>` : ``}</div>
      <div class="${"flex flex-wrap -mt-2"}">${each(orionSeenOptions, (option) => `${validate_component(RadioInput, "RadioInput").$$render($$result, {
      classes: "mr-2 mt-2",
      text: option,
      onClick: () => handleOrionSeen(option),
      selected: orionSeen === option
    }, {}, {})}`)}</div></div>

    <div class="${"flex flex-col"}"><span class="${"mb-1 text-xs font-semibold"}">Ernest Rating</span>
      <div class="${"flex"}"><span class="${"text-xs mr-2"}">Select</span>
        ${ernestPhotoLinks.includes(ernestRating) ? `<button class="${"text-xs text-red-500"}">clear</button>` : ``}</div>
      <div class="${"flex flex-wrap"}">${each(ernestPhotoLinks, (photoLink) => `<button class="${[
      "rounded-lg img-wrap mr-1 mb-2 border-3 border-solid border-transparent hover:border-indigo-200 svelte-cbmdi7",
      ernestRating === photoLink ? "selected" : ""
    ].join(" ").trim()}"><img class="${"h-20 w-auto"}" alt="${"ernest"}"${add_attribute("src", photoLink, 0)}>
          </button>`)}</div>
      <span class="${"text-xs mb-1"}">Or paste a link</span>
      <input class="${"recommendation-input svelte-cbmdi7"}" placeholder="${"If none of these fit, paste a link to a photo here"}" type="${"text"}"${add_attribute("value", ernestRating, 0)}></div>` : ``}

  <div class="${"w-full flex justify-center"}"><button ${disableSubmit ? "disabled" : ""} class="${[
      "submit-btn bg-indigo-600 hover:bg-indigo-700 h-12 flex items-center px-4 text-white rounded-lg svelte-cbmdi7",
      disableSubmit ? "disabled" : ""
    ].join(" ").trim()}">${escape(editMode ? "Save Changes" : "Submit this Recommendation")}</button></div>
  
</div>`;
  } while (!$$settled);
  $$unsubscribe_currentUser();
  $$unsubscribe_token();
  return $$rendered;
});
var getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
var page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
var ProfileIconMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"fixed top-22 right-4 bg-white shadow-md z-100"}"><div class="${"flex flex-col p-4 space-y-2"}"><a href="${"/profile"}">View Profile</a>
    <a href="${"/profile/watchlist"}">View Group</a>
    <a href="${"/profile/my-recommendations"}">My Recommendations</a>
    <button class="${"text-left"}">Log Out</button></div></div>`;
});
var Logo = "/_app/assets/grouprec-logo-9be75482.png";
var css$4 = {
  code: ".active.svelte-nfhgto{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity));border-radius:0px}.active.svelte-nfhgto:after{content:'';width:100%;height:5px;position:absolute;bottom:0;left:0;--tw-bg-opacity:1;background-color:rgba(30, 58, 138, var(--tw-bg-opacity))}.modalOut.svelte-nfhgto{--tw-bg-opacity:1;background-color:rgba(238, 242, 255, var(--tw-bg-opacity))}",
  map: `{"version":3,"file":"Header.svelte","sources":["Header.svelte"],"sourcesContent":["<script lang='ts'>import { page } from \\"$app/stores\\";\\nimport \\"../api/api.svelte\\";\\nimport { currentUser, showCreateRecommendation, showUserMenu, showUserRecommendations } from '../stores/main';\\nimport ProfileIconMenu from \\"./ProfileIconMenu.svelte\\";\\nimport Logo from '../assets/grouprec-logo.png';\\nexport let handleShowUserRecommendations;\\nconst handleAddRecommendation = () => {\\n    showCreateRecommendation.set(true);\\n};\\nconst handleUserIconClick = () => {\\n    showUserMenu.set(true);\\n};\\n<\/script>\\n\\n<div class='fixed top-0 w-screen z-100'>\\n  <header class='flex items-center justify-between h-17 px-4 bg-white shadow-md'>\\n    <a href='/recommendations'>\\n      <img src={Logo} class='h-12 w-auto' />\\n    </a>\\n\\n    <div class='flex h-full items-center space-x-2'>\\n      <div class='flex h-full items-center'>\\n        <a class:active={$page?.path?.includes('/recommendations')} class='relative h-full flex items-center px-4 hover:bg-indigo-50' href='/recommendations'>\\n          Browse All\\n        </a>\\n        <a class:active={$page?.path?.includes('/profile/watchlist')} class='relative h-full flex items-center px-4 hover:bg-indigo-50' href='/profile/watchlist'>\\n          My Watchlist\\n        </a>\\n        <button on:click={handleShowUserRecommendations} class:modalOut={$showUserRecommendations} class='relative h-full flex items-center px-4 hover:bg-indigo-50'>\\n          My Recommendations\\n        </button>\\n      </div>\\n      <button on:click={handleAddRecommendation} class='flex px-4 py-2 border-1 border-indigo-900 items-center rounded-lg hover:bg-indigo-50'>\\n        + Add Recommendation\\n      </button>\\n\\n      {#if $currentUser?.id}\\n        <button class='w-10 h-10 border-2 border-solid border-indigo-900 rounded-full flex items-center justify-center overflow-hidden bg-indigo-300' on:click={handleUserIconClick}>\\n          {#if $currentUser?.image}\\n            <img class='h-full w-auto' src={$currentUser.image} />\\n          {:else if $currentUser?.name}\\n            <span>{$currentUser.name.charAt(0).toUpperCase()}</span>\\n          {/if}\\n        </button>\\n      {:else}\\n        <button>Sign Up</button>\\n      {/if}\\n    </div>\\n  </header>\\n\\n  {#if $showUserMenu}\\n    <ProfileIconMenu\\n\\n    />\\n  {/if}\\n</div>\\n\\n<style>.active {\\n  --tw-bg-opacity: 1;\\n  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));\\n  border-radius: 0px;\\n}\\n.active:after {\\n  content: '';\\n  width: 100%;\\n  height: 5px;\\n  position: absolute;\\n  bottom: 0;\\n  left: 0;\\n  --tw-bg-opacity: 1;\\n  background-color: rgba(30, 58, 138, var(--tw-bg-opacity));\\n}\\n.modalOut {\\n  --tw-bg-opacity: 1;\\n  background-color: rgba(238, 242, 255, var(--tw-bg-opacity));\\n}</style>"],"names":[],"mappings":"AAyDO,OAAO,cAAC,CAAC,AACd,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,CAC3D,aAAa,CAAE,GAAG,AACpB,CAAC,AACD,qBAAO,MAAM,AAAC,CAAC,AACb,OAAO,CAAE,EAAE,CACX,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,AAC3D,CAAC,AACD,SAAS,cAAC,CAAC,AACT,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,AAC7D,CAAC"}`
};
var Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a, _b;
  let $page, $$unsubscribe_page;
  let $showUserRecommendations, $$unsubscribe_showUserRecommendations;
  let $currentUser, $$unsubscribe_currentUser;
  let $showUserMenu, $$unsubscribe_showUserMenu;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_showUserRecommendations = subscribe(showUserRecommendations, (value) => $showUserRecommendations = value);
  $$unsubscribe_currentUser = subscribe(currentUser, (value) => $currentUser = value);
  $$unsubscribe_showUserMenu = subscribe(showUserMenu, (value) => $showUserMenu = value);
  let { handleShowUserRecommendations } = $$props;
  if ($$props.handleShowUserRecommendations === void 0 && $$bindings.handleShowUserRecommendations && handleShowUserRecommendations !== void 0)
    $$bindings.handleShowUserRecommendations(handleShowUserRecommendations);
  $$result.css.add(css$4);
  $$unsubscribe_page();
  $$unsubscribe_showUserRecommendations();
  $$unsubscribe_currentUser();
  $$unsubscribe_showUserMenu();
  return `<div class="${"fixed top-0 w-screen z-100"}"><header class="${"flex items-center justify-between h-17 px-4 bg-white shadow-md"}"><a href="${"/recommendations"}"><img${add_attribute("src", Logo, 0)} class="${"h-12 w-auto"}"></a>

    <div class="${"flex h-full items-center space-x-2"}"><div class="${"flex h-full items-center"}"><a class="${[
    "relative h-full flex items-center px-4 hover:bg-indigo-50 svelte-nfhgto",
    ((_a = $page == null ? void 0 : $page.path) == null ? void 0 : _a.includes("/recommendations")) ? "active" : ""
  ].join(" ").trim()}" href="${"/recommendations"}">Browse All
        </a>
        <a class="${[
    "relative h-full flex items-center px-4 hover:bg-indigo-50 svelte-nfhgto",
    ((_b = $page == null ? void 0 : $page.path) == null ? void 0 : _b.includes("/profile/watchlist")) ? "active" : ""
  ].join(" ").trim()}" href="${"/profile/watchlist"}">My Watchlist
        </a>
        <button class="${[
    "relative h-full flex items-center px-4 hover:bg-indigo-50 svelte-nfhgto",
    $showUserRecommendations ? "modalOut" : ""
  ].join(" ").trim()}">My Recommendations
        </button></div>
      <button class="${"flex px-4 py-2 border-1 border-indigo-900 items-center rounded-lg hover:bg-indigo-50"}">+ Add Recommendation
      </button>

      ${($currentUser == null ? void 0 : $currentUser.id) ? `<button class="${"w-10 h-10 border-2 border-solid border-indigo-900 rounded-full flex items-center justify-center overflow-hidden bg-indigo-300"}">${($currentUser == null ? void 0 : $currentUser.image) ? `<img class="${"h-full w-auto"}"${add_attribute("src", $currentUser.image, 0)}>` : `${($currentUser == null ? void 0 : $currentUser.name) ? `<span>${escape($currentUser.name.charAt(0).toUpperCase())}</span>` : ``}`}</button>` : `<button>Sign Up</button>`}</div></header>

  ${$showUserMenu ? `${validate_component(ProfileIconMenu, "ProfileIconMenu").$$render($$result, {}, {}, {})}` : ``}
</div>`;
});
var LockScroll = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  onDestroy(() => {
  });
  return ``;
});
var css$3 = {
  code: ".overlay.svelte-7zplgr{width:100vw;height:100vh;position:fixed;top:0;left:0;background-color:rgba(0,0,0,.5)}.overlay.all.svelte-7zplgr{z-index:1001}.overlay.allButHeader.svelte-7zplgr{z-index:999}.overlay.whiteFill.svelte-7zplgr{background-color:white}.overlay.noShade.svelte-7zplgr{background-color:transparent}.overlay.withBlur.applyBlur.svelte-7zplgr:not(.whiteFill){transition:.1s ease all;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}",
  map: `{"version":3,"file":"Overlay.svelte","sources":["Overlay.svelte"],"sourcesContent":["<script lang='ts'>import { fade } from 'svelte/transition';\\nimport { cubicOut } from 'svelte/easing';\\nimport LockScroll from './LockScroll.svelte';\\nexport let all = false, allButHeader = false, onClick, duration, noShade = false, withBlur = false, whiteFill = false;\\nlet applyBlur = false;\\nconst handleClick = () => {\\n    applyBlur = false;\\n    onClick();\\n};\\n// Apply blur after mount to reduce laggy experience\\n// onMount(() => setTimeout(() => applyBlur =  true, duration))\\n<\/script>\\n\\n<LockScroll />\\n<div\\n  transition:fade=\\"{{duration, easing: cubicOut}}\\"\\n  on:introend=\\"{() => applyBlur = true}\\"\\n  on:outrostart=\\"{() => applyBlur = false}\\"\\n  class='overlay'\\n  id='overlay'\\n  class:whiteFill\\n  class:withBlur\\n  class:applyBlur\\n  class:all\\n  class:allButHeader\\n  class:noShade\\n  on:click={handleClick}\\n/>\\n\\n<style>.overlay {\\n  width: 100vw;\\n  height: 100vh;\\n  position: fixed;\\n  top: 0;\\n  left: 0;\\n  background-color: rgba(0,0,0,.5);\\n}\\n.overlay.all {\\n  z-index: 1001;\\n}\\n.overlay.allButHeader {\\n  z-index: 999;\\n}\\n.overlay.whiteFill {\\n  background-color: white;\\n}\\n.overlay.noShade {\\n  background-color: transparent;\\n}\\n.overlay.withBlur.applyBlur:not(.whiteFill) {\\n  transition: .1s ease all;\\n  backdrop-filter: blur(2px);\\n  -webkit-backdrop-filter: blur(2px);\\n}</style>"],"names":[],"mappings":"AA6BO,QAAQ,cAAC,CAAC,AACf,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,CACb,QAAQ,CAAE,KAAK,CACf,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,AAClC,CAAC,AACD,QAAQ,IAAI,cAAC,CAAC,AACZ,OAAO,CAAE,IAAI,AACf,CAAC,AACD,QAAQ,aAAa,cAAC,CAAC,AACrB,OAAO,CAAE,GAAG,AACd,CAAC,AACD,QAAQ,UAAU,cAAC,CAAC,AAClB,gBAAgB,CAAE,KAAK,AACzB,CAAC,AACD,QAAQ,QAAQ,cAAC,CAAC,AAChB,gBAAgB,CAAE,WAAW,AAC/B,CAAC,AACD,QAAQ,SAAS,wBAAU,KAAK,UAAU,CAAC,AAAC,CAAC,AAC3C,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,GAAG,CACxB,eAAe,CAAE,KAAK,GAAG,CAAC,CAC1B,uBAAuB,CAAE,KAAK,GAAG,CAAC,AACpC,CAAC"}`
};
var Overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { all = false, allButHeader = false, onClick, duration, noShade = false, withBlur = false, whiteFill = false } = $$props;
  if ($$props.all === void 0 && $$bindings.all && all !== void 0)
    $$bindings.all(all);
  if ($$props.allButHeader === void 0 && $$bindings.allButHeader && allButHeader !== void 0)
    $$bindings.allButHeader(allButHeader);
  if ($$props.onClick === void 0 && $$bindings.onClick && onClick !== void 0)
    $$bindings.onClick(onClick);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.noShade === void 0 && $$bindings.noShade && noShade !== void 0)
    $$bindings.noShade(noShade);
  if ($$props.withBlur === void 0 && $$bindings.withBlur && withBlur !== void 0)
    $$bindings.withBlur(withBlur);
  if ($$props.whiteFill === void 0 && $$bindings.whiteFill && whiteFill !== void 0)
    $$bindings.whiteFill(whiteFill);
  $$result.css.add(css$3);
  return `${validate_component(LockScroll, "LockScroll").$$render($$result, {}, {}, {})}
<div class="${[
    "overlay svelte-7zplgr",
    (whiteFill ? "whiteFill" : "") + " " + (withBlur ? "withBlur" : "") + "  " + (all ? "all" : "") + " " + (allButHeader ? "allButHeader" : "") + " " + (noShade ? "noShade" : "")
  ].join(" ").trim()}" id="${"overlay"}"></div>`;
});
var Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { onHideModal } = $$props;
  let { hideCloseX = false } = $$props;
  let { noFullWidth = false } = $$props;
  if ($$props.onHideModal === void 0 && $$bindings.onHideModal && onHideModal !== void 0)
    $$bindings.onHideModal(onHideModal);
  if ($$props.hideCloseX === void 0 && $$bindings.hideCloseX && hideCloseX !== void 0)
    $$bindings.hideCloseX(hideCloseX);
  if ($$props.noFullWidth === void 0 && $$bindings.noFullWidth && noFullWidth !== void 0)
    $$bindings.noFullWidth(noFullWidth);
  return `<div class="${"fixed w-screen h-screen top-0 left-0 flex items-center justify-center px-6 z-1001"}">${validate_component(Overlay, "Overlay").$$render($$result, {
    all: true,
    duration: 200,
    onClick: onHideModal
  }, {}, {})}
  
  <div class="${"relative rounded-xl bg-white shadow-5 px-4.5 pt-6 pb-10 " + escape(!noFullWidth ? "w-full" : "") + " max-w-170 max-h-5/6 z-1300 overflow-scroll"}"><div class="${"w-full " + escape(hideCloseX ? "hidden" : "flex") + " justify-end"}"><button>X
      </button></div>
    ${slots.default ? slots.default({}) : ``}</div></div>`;
});
var RecommendationCardTag = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a, _b, _c;
  let $currentUser, $$unsubscribe_currentUser;
  $$unsubscribe_currentUser = subscribe(currentUser, (value) => $currentUser = value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { tagJoin } = $$props;
  let showDetails = false;
  if ($$props.tagJoin === void 0 && $$bindings.tagJoin && tagJoin !== void 0)
    $$bindings.tagJoin(tagJoin);
  $$unsubscribe_currentUser();
  return `<div class="${["relative mr-2 mt-1", ""].join(" ").trim()}"><button class="${"flex items-center px-2 border-1 border-solid rounded-lg text-xs"}">${escape((_a = tagJoin.tag) == null ? void 0 : _a.name)}
    ${escape(((_b = tagJoin.added_by) == null ? void 0 : _b.id) === $currentUser.id ? "x" : "")}</button>
  ${((_c = tagJoin.added_by) == null ? void 0 : _c.name) && showDetails ? `<div class="${"z-1 w-25 p-2 absolute top-6 left-4 bg-white border-solid border-1 rounded-lg"}"><span class="${"text-xs"}">Added by ${escape(tagJoin.added_by.name)}</span></div>` : ``}
  <button class="${"z-1 absolute top-0 left-0 w-full h-full rounded-lg cursor-pointer"}"></button></div>

${``}`;
});
var streamingOptions = [
  {
    key: "netflix",
    name: "Netflix",
    img: NetflixLogo
  },
  {
    key: "hulu",
    name: "Hulu",
    img: HuluLogo
  },
  {
    key: "prime-video",
    name: "Prime Video",
    img: PrimeVideoLogo
  },
  {
    key: "disney-plus",
    name: "Disney Plus",
    img: DisneyPlusLogo
  },
  {
    key: "hbo-max",
    name: "HBO Max",
    img: HboMaxLogo
  }
];
var css$2 = {
  code: ".btn.svelte-db0kzt{border-color:transparent;border-radius:0.375rem;border-width:1px;display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%;font-weight:600;font-size:0.75rem;line-height:1rem;padding-top:0.375rem;padding-bottom:0.375rem;--tw-text-opacity:1;color:rgba(107, 114, 128, var(--tw-text-opacity));-webkit-transition-property:all;-o-transition-property:all;transition-property:all;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.btn.svelte-db0kzt:not(.selected):hover{--tw-shadow-color:0, 0, 0;--tw-shadow:0 4px 6px -1px rgba(var(--tw-shadow-color), 0.1), 0 2px 4px -1px rgba(var(--tw-shadow-color), 0.06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.btn.watchlist.svelte-db0kzt{--tw-text-opacity:1;color:rgba(4, 120, 87, var(--tw-text-opacity))}.btn.watchlist-added.svelte-db0kzt{--tw-bg-opacity:1;background-color:rgba(4, 120, 87, var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.rank-btn.neutral-border.svelte-db0kzt{--tw-border-opacity:1;border-color:rgba(165, 180, 252, var(--tw-border-opacity))}.rank-btn.neutral-border.svelte-db0kzt:hover{--tw-border-opacity:1;border-color:rgba(67, 56, 202, var(--tw-border-opacity))}.rank-btn.selected.svelte-db0kzt{--tw-bg-opacity:1;background-color:rgba(229, 231, 235, var(--tw-bg-opacity));--tw-border-opacity:1;border-color:rgba(17, 24, 39, var(--tw-border-opacity));--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}.rank-btn.cancel.svelte-db0kzt{--tw-border-opacity:1;border-color:rgba(252, 165, 165, var(--tw-border-opacity))}.rank-btn.cancel.svelte-db0kzt:hover{--tw-border-opacity:1;border-color:rgba(248, 113, 113, var(--tw-border-opacity))}.rating-btn.selected.svelte-db0kzt{border-style:none;--tw-text-opacity:1;color:rgba(67, 56, 202, var(--tw-text-opacity));box-shadow:1px 1px 5px rgba(0, 0, 0, .2) inset}.rating-btn.selected.svelte-db0kzt:hover{box-shadow:1px 1px 10px rgba(0, 0, 0, .2) inset}.hide.svelte-db0kzt{display:none}.odd.svelte-db0kzt{--tw-bg-opacity:1;background-color:rgba(249, 250, 251, var(--tw-bg-opacity))}",
  map: `{"version":3,"file":"RecommendationCard.svelte","sources":["RecommendationCard.svelte"],"sourcesContent":["<script lang='ts'>var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nvar _a, _b;\\nimport { apiDelete, apiPost, baseURL } from \\"../api/api.svelte\\";\\nimport { currentUser, token } from \\"../stores/main\\";\\nimport TagsInput from \\"./TagsInput.svelte\\";\\nimport RecommendationCardTag from \\"./RecommendationCardTag.svelte\\";\\nimport { toTitleCase } from \\"../helpers\\";\\nimport { streamingOptions } from \\"../constants\\";\\nimport Modal from \\"./Modal.svelte\\";\\nimport CreateRecommendation from \\"./CreateRecommendation.svelte\\";\\nexport let recommendation;\\nexport let hideActions = false;\\nexport let hideRecommendedBy = false;\\nexport let showEditButton = false;\\nexport let editClickCallback = undefined;\\nexport let deleteClickCallback = undefined;\\nexport let insertUpdatedRecommendation = undefined;\\nexport let hide = false;\\nexport let i;\\n// const existingTags = recommendation.tags.map(t => t.id)\\nlet tagIds = [];\\nlet showAddTag;\\nlet tagsToAdd = [];\\nlet newTagVal;\\nlet hideWatchlistButton;\\nlet userRankLocal;\\nlet userSeenStatusLocal;\\nlet editMode;\\nlet submitTagSuccess;\\nlet showRatingMenu;\\n$: handleTagClick = (id) => {\\n    const indexOfId = tagIds.indexOf(id);\\n    if (indexOfId > -1) {\\n        const oldArr = [...tagIds];\\n        oldArr.splice(indexOfId, 1);\\n        tagIds = [...oldArr];\\n    }\\n    else {\\n        tagIds = [...tagIds, id];\\n    }\\n};\\nconst handleSubmitTagSuccess = () => {\\n    submitTagSuccess = true;\\n    setTimeout(() => submitTagSuccess = false, 300);\\n};\\nconst submitTagId = (id) => __awaiter(void 0, void 0, void 0, function* () {\\n    const obj = {\\n        endpoint: 'recommendation_tag_joins',\\n        params: {\\n            recommendation_id: recommendation.id,\\n            tag_id: id\\n        }\\n    };\\n    const resp = yield apiPost(obj);\\n    if (resp.status === 200) {\\n        handleSubmitTagSuccess();\\n    }\\n});\\nconst createTagAndAssociate = (name) => __awaiter(void 0, void 0, void 0, function* () {\\n    const body = {\\n        name,\\n        recommendation_id: recommendation.id\\n    };\\n    const url = baseURL + '/tags/create-and-associate';\\n    const resp = yield fetch(url, {\\n        method: 'POST',\\n        headers: {\\n            'Authorization': \`Bearer \${$token}\`,\\n            'Content-Type': 'application/json'\\n        },\\n        body: JSON.stringify(body)\\n    });\\n    if (resp.status !== 200) {\\n        console.log('error');\\n    }\\n    else {\\n        const data = yield resp.json();\\n    }\\n});\\nconst handleSubmitTag = (tag) => {\\n    if (tag.id) {\\n        submitTagId(tag.id);\\n    }\\n    else {\\n        createTagAndAssociate(tag.name);\\n    }\\n};\\nconst emoji = () => {\\n    switch (recommendation.medium) {\\n        case 'movie':\\n            return \\"\u{1F37F}\\";\\n        case 'film':\\n            return \\"\u{1F3A9}\\";\\n        case 'tv':\\n            return \\"\u{1F4FA}\\";\\n        case 'album':\\n            return \\"\u{1F4BF}\\";\\n        case 'miniseries':\\n            return \\"\u{1F4FA}\\";\\n        case 'song':\\n            return \\"\u{1F3B5}\\";\\n        case 'graphic novel':\\n            return \\"\u{1F4D6}\\";\\n        default:\\n            return \\"\\";\\n    }\\n};\\nconst ratings = [\\n    {\\n        apiValue: 'fuck',\\n        buttonText: 'Fuck this',\\n        readable: 'You hated this'\\n    },\\n    {\\n        apiValue: 'meh',\\n        buttonText: 'Meh',\\n        readable: \\"Meh\\"\\n    },\\n    {\\n        apiValue: 'like',\\n        buttonText: 'Liked it',\\n        readable: 'You liked this'\\n    },\\n    {\\n        apiValue: 'love',\\n        buttonText: 'Loved it',\\n        readable: 'You loved this'\\n    }\\n];\\nconst ratingsApiVals = ratings.map(r => r.apiValue);\\n$: userRankingIds = (_a = recommendation.user_recommendation_rankings) === null || _a === void 0 ? void 0 : _a.map(r => r.user_id);\\n$: userRankingIndex = userRankingIds === null || userRankingIds === void 0 ? void 0 : userRankingIds.indexOf($currentUser.id);\\n$: userRankObj = userRankingIndex > -1 && recommendation.user_recommendation_rankings[userRankingIndex];\\n$: userRank = userRankLocal || (userRankObj === null || userRankObj === void 0 ? void 0 : userRankObj.rank);\\n$: ratingsIndex = userRank && ratingsApiVals.indexOf(userRank);\\n$: userRankDisplay = ratingsIndex > -1 && ((_b = ratings[ratingsIndex]) === null || _b === void 0 ? void 0 : _b.readable);\\n$: userSeenStatus = userSeenStatusLocal || (userRankObj === null || userRankObj === void 0 ? void 0 : userRankObj.seen_status);\\n$: additionalRecommenderIds = recommendation.additional_recommenders.map(u => u.id);\\n$: userHasRecommended = additionalRecommenderIds.includes($currentUser.id);\\nconst availableOn = recommendation.available_on && streamingOptions.find(opt => opt.key === recommendation.available_on);\\nconst handlePostRank = (field, value) => __awaiter(void 0, void 0, void 0, function* () {\\n    const body = {\\n        recommendation_id: recommendation.id,\\n        [field]: value\\n    };\\n    const url = baseURL + '/user-recommendation-ranking';\\n    const resp = yield fetch(url, {\\n        method: 'POST',\\n        headers: {\\n            'Authorization': \`Bearer \${$token}\`,\\n            'Content-Type': 'application/json'\\n        },\\n        body: JSON.stringify(body)\\n    });\\n});\\nconst handlePatchRank = (field, value) => __awaiter(void 0, void 0, void 0, function* () {\\n    const body = {\\n        user_recommendation_ranking: {\\n            id: userRankObj.id,\\n            [field]: value\\n        }\\n    };\\n    const url = baseURL + '/user-recommendation-ranking';\\n    const resp = yield fetch(url, {\\n        method: 'PATCH',\\n        headers: {\\n            'Authorization': \`Bearer \${$token}\`,\\n            'Content-Type': 'application/json'\\n        },\\n        body: JSON.stringify(body)\\n    });\\n});\\nconst postOrPatch = (field, value) => {\\n    (userRankObj === null || userRankObj === void 0 ? void 0 : userRankObj.id) ? handlePatchRank(field, value) : handlePostRank(field, value);\\n    if (field === 'rank') {\\n        userRankLocal = value;\\n    }\\n    else if (field === 'seen_status') {\\n        userSeenStatusLocal = value;\\n    }\\n    showRatingMenu = false;\\n};\\nconst handleAdditionalRecommendation = () => __awaiter(void 0, void 0, void 0, function* () {\\n    const params = {\\n        recommendation_id: recommendation.id\\n    };\\n    const obj = {\\n        endpoint: 'user-seconded-recommendation',\\n        body: params\\n    };\\n    const resp = yield apiPost(obj);\\n    const body = yield resp.json();\\n    insertUpdatedRecommendation(body, i);\\n});\\nconst deleteAdditionalRecommendation = () => __awaiter(void 0, void 0, void 0, function* () {\\n    const index = additionalRecommenderIds.indexOf($currentUser.id);\\n    const id = recommendation.additional_recommenders[index].id;\\n    const resp = yield apiDelete(\`user-seconded-recommendation/\${recommendation.id}/\${id}\`);\\n    if (resp.status === 200) {\\n        const body = yield resp.json();\\n        insertUpdatedRecommendation(body, i);\\n    }\\n});\\nconst handleEditClick = () => {\\n    editMode = true;\\n    if (editClickCallback) {\\n        editClickCallback(recommendation.id);\\n    }\\n};\\nconst handleDeleteClick = () => __awaiter(void 0, void 0, void 0, function* () {\\n    const resp = yield apiDelete(\`recommendations/\${recommendation.id}\`);\\n    if (resp.status === 200) {\\n        deleteClickCallback(recommendation.id);\\n    }\\n});\\nconst handleCancelEditMode = () => {\\n    editMode = false;\\n    if (editClickCallback) {\\n        editClickCallback();\\n    }\\n};\\nconst editModeCallback = (body) => {\\n    recommendation = body;\\n    handleCancelEditMode();\\n};\\n$: additionalRecommendersString = () => {\\n    let string = '';\\n    recommendation.additional_recommenders.forEach((u, i, arr) => {\\n        string += u.name;\\n        if (i + 1 !== arr.length) {\\n            string += ', ';\\n        }\\n    });\\n    return string;\\n};\\n$: handleClearRating = () => {\\n    showRatingMenu = false;\\n    postOrPatch('rank', 'none');\\n};\\n$: currentUserHasSeen = additionalRecommenderIds.includes($currentUser.id) ||\\n    (userRank && userRank !== 'watchlist-removed' && userRank !== 'rating-removed' && userRank !== 'want');\\n<\/script>\\n\\n<div class:hide class:odd={i % 2 === 1} class='relative flex justify-between rounded-xl border-2 border-indigo-400 p-4 pb-1 shadow-sm hover:shadow-md'>\\n  {#if !editMode}\\n    <div class='flex flex-col w-full'>\\n      <div class='flex mb-1 justify-between'>\\n        <div class='mr-2 flex flex-col'>\\n          <span class='text-lg font-semibold'>\\n            {recommendation.title} |\\n            {toTitleCase(recommendation.medium)}\\n            {emoji()}\\n          </span>\\n          {#if recommendation.colorization}\\n            <span class='text-xs font-semibold'>{toTitleCase(recommendation.colorization)}</span>\\n          {/if}\\n        </div>\\n\\n        <div class='flex-1 mr-2'>\\n          <div class='flex flex-wrap flex-1 items-center h-full -mt-1'>\\n            {#each recommendation.recommendation_tag_joins as tagJoin}\\n              <RecommendationCardTag\\n                {tagJoin}\\n              />\\n            {/each}\\n            {#each tagsToAdd as tag}\\n              <RecommendationCardTag\\n                tagJoin={{ tag, added_by: { name: $currentUser.name } }}\\n              />\\n            {/each}\\n            {#if !showEditButton}\\n              <button on:click={() => showAddTag = true} class='text-xs rounded-full border-solid border-1 px-2 mr-1 border-indigo-300 mt-1 hover:border-indigo-500'>+ Add Tag(s)</button>\\n            {/if}\\n          </div>\\n        </div>\\n\\n        <div class='flex flex-col relative'>\\n          {#if !hideRecommendedBy}\\n            <span class='font-light'>Recommended by: <span class='font-semibold'>{toTitleCase(recommendation.recommended_by?.name)}</span></span>\\n          {/if}\\n\\n          {#if showEditButton}\\n            <div class='flex space-x-1'>\\n              <button on:click={handleEditClick} class='text-indigo-600 text-sm font-semibold'>Edit</button>\\n              <span>|</span>\\n              <button on:click={handleDeleteClick} class='text-red-600 text-sm font-semibold'>Delete</button>\\n            </div>\\n          {/if}\\n\\n          {#if (recommendation.available_on)}\\n            <div class='absolute top-6 right-0 flex space-x-2'>\\n              <img class='h-8 w-auto' alt={availableOn.name} src={availableOn.img} />\\n            </div>\\n          {/if}\\n        </div>\\n      </div>\\n\\n      <div class='flex flex-row justify-between items-center w-full mb-1'>\\n\\n        {#if recommendation.additional_recommenders?.length > 0}\\n          <div class='flex flex-col'>\\n            <span class='text-xs'>Also recommended by</span>\\n              <span>{additionalRecommendersString()}</span>\\n          </div>\\n        {/if}\\n\\n        <div class='flex flex-col'>\\n          <span class='text-xs'>Has Orion Seen It?</span>\\n          <span>{recommendation.has_orion_seen ? toTitleCase(recommendation.has_orion_seen) : 'N/A'}</span>\\n        </div>\\n\\n        <div class='flex flex-col'>\\n          <span class='text-xs'>Do Journey's Cats Hate It?</span>\\n          <span>{recommendation.do_journeys_cats_hate ? toTitleCase(recommendation.do_journeys_cats_hate) : 'Maybe'}</span>\\n        </div>\\n\\n        <div class='flex flex-col'>\\n          <span class='text-xs'>Ernest Rating</span>\\n          <img class='h-12 w-auto' src={recommendation.ernest_rating} />\\n        </div>\\n      </div>\\n\\n      {#if !hideActions}\\n        <div class='border-t border-solid pt-1 flex flex-row space-x-2 space-y-0'>\\n          {#if !showRatingMenu}\\n            <button class:selected={!!userRankDisplay} class='btn rating-btn negative' on:click={() => showRatingMenu = true}>\\n              {userRankDisplay ? \`\${userRankDisplay}\` : \\"\u2764\uFE0F Rate It!\\"}\\n            </button>\\n            {#if userHasRecommended}\\n              <button class:selected={userHasRecommended} class='btn rating-btn' on:click={deleteAdditionalRecommendation}>\\n                Also Recommended\\n              </button>\\n            {:else}\\n              <button class:selected={userRank === 'liked'} class='btn rating-btn' on:click={handleAdditionalRecommendation}>\\n                \u{1F44D}&nbsp;Also Recommend\\n              </button>\\n            {/if}\\n            {#if !hideWatchlistButton}\\n              {#if userSeenStatus === 'want'}\\n                <a href='/profile/watchlist' class='btn watchlist-added'>\\n                  Added to Watch List\\n                </a>\\n              {:else}\\n                <button class='btn watchlist' on:click={() => postOrPatch('seen_status', 'want')}>\\n                  + Watch List\\n                </button>\\n              {/if}\\n            {/if}\\n          {:else}\\n            <div class='w-full'>\\n              <div class='flex w-full border-b mb-2 pb-1'>\\n                {#each ratings as r}\\n                  <button class:selected={userRank === r.apiValue} class='btn rank-btn flex-1' on:click={() => postOrPatch('rank', r.apiValue)}>{r.buttonText}</button>\\n                {/each}\\n              </div>\\n              <div class='flex w-full space-x-2 justify-center'>\\n                <button class='max-w-1/5 btn rank-btn neutral-border flex-1 border-1' on:click={() => showRatingMenu = false}>Cancel</button>\\n                {#if userRankDisplay}\\n                  <button class='max-w-1/5 btn rank-btn cancel flex-1 border-1' on:click={handleClearRating}>Clear Rating</button>\\n                {/if}\\n              </div>\\n            </div>\\n          {/if}\\n        </div>\\n      {/if}\\n\\n    </div>\\n  {:else}\\n    <button on:click={handleCancelEditMode} class='absolute top-2 right-4 text-indigo-700 text-sm font-semibold'>Cancel</button>\\n    <CreateRecommendation\\n      editMode\\n      editModeCallback={editModeCallback}\\n      existingRecommendation={recommendation}\\n      title={recommendation.title}\\n      medium={recommendation.medium}\\n      catsHate={recommendation.do_journeys_cats_hate}\\n      orionSeen={recommendation.has_orion_seen}\\n      ernestRating={recommendation.ernest_rating}\\n      colorization={recommendation.colorization}\\n      availableOn={recommendation.available_on}\\n      trailerLink={recommendation.youtube_link}\\n      spotifyLink={recommendation.spotify_link}\\n      bandcampLink={recommendation.bandcamp_link}\\n      soundcloudLink={recommendation.soundcloud_link}\\n    />\\n  {/if}\\n</div>\\n\\n{#if showAddTag}\\n  <Modal onHideModal={() => showAddTag = false} noFullWidth hideCloseX>\\n    <div class='flex flex-col'>\\n      <div class='mb-8'>\\n        <span class='text-lg font-semibold'>\\n          {recommendation.title} |\\n          {toTitleCase(recommendation.medium)}\\n          {emoji()}\\n        </span>\\n      </div>\\n      <div class='w-full flex justify-center'>\\n        <div>\\n          <p class='text-xs mb-1 font-semibold'>{newTagVal ? \\"Hit enter to submit\\" : \\"Enter a new tag\\"}</p>\\n          <TagsInput\\n            bind:tags={tagsToAdd}\\n            bind:value={newTagVal}\\n            hideNewTags\\n            autoFocus\\n            {handleSubmitTag}\\n          />\\n        </div>\\n      </div>\\n    </div>\\n  </Modal>\\n{/if}\\n\\n<style>.btn {\\n  border-color: transparent;\\n  border-radius: 0.375rem;\\n  border-width: 1px;\\n  display: -webkit-box;\\n  display: -ms-flexbox;\\n  display: -webkit-flex;\\n  display: flex;\\n  -webkit-box-align: center;\\n  -ms-flex-align: center;\\n  -webkit-align-items: center;\\n  align-items: center;\\n  -webkit-box-pack: center;\\n  -ms-flex-pack: center;\\n  -webkit-justify-content: center;\\n  justify-content: center;\\n  -webkit-box-flex: 1;\\n  -ms-flex: 1 1 0%;\\n  -webkit-flex: 1 1 0%;\\n  flex: 1 1 0%;\\n  font-weight: 600;\\n  font-size: 0.75rem;\\n  line-height: 1rem;\\n  padding-top: 0.375rem;\\n  padding-bottom: 0.375rem;\\n  --tw-text-opacity: 1;\\n  color: rgba(107, 114, 128, var(--tw-text-opacity));\\n  -webkit-transition-property: all;\\n  -o-transition-property: all;\\n  transition-property: all;\\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\\n  -o-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\\n  -webkit-transition-duration: 150ms;\\n  -o-transition-duration: 150ms;\\n  transition-duration: 150ms;\\n}\\n.btn:not(.selected):hover {\\n  --tw-shadow-color: 0, 0, 0;\\n  --tw-shadow: 0 4px 6px -1px rgba(var(--tw-shadow-color), 0.1), 0 2px 4px -1px rgba(var(--tw-shadow-color), 0.06);\\n  -webkit-box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\\n}\\n.btn.watchlist {\\n  --tw-text-opacity: 1;\\n  color: rgba(4, 120, 87, var(--tw-text-opacity));\\n}\\n.btn.watchlist-added {\\n  --tw-bg-opacity: 1;\\n  background-color: rgba(4, 120, 87, var(--tw-bg-opacity));\\n  --tw-text-opacity: 1;\\n  color: rgba(255, 255, 255, var(--tw-text-opacity));\\n}\\n.rank-btn.neutral-border {\\n  --tw-border-opacity: 1;\\n  border-color: rgba(165, 180, 252, var(--tw-border-opacity));\\n}\\n.rank-btn.neutral-border:hover {\\n  --tw-border-opacity: 1;\\n  border-color: rgba(67, 56, 202, var(--tw-border-opacity));\\n}\\n.rank-btn.selected {\\n  --tw-bg-opacity: 1;\\n  background-color: rgba(229, 231, 235, var(--tw-bg-opacity));\\n  --tw-border-opacity: 1;\\n  border-color: rgba(17, 24, 39, var(--tw-border-opacity));\\n  --tw-text-opacity: 1;\\n  color: rgba(55, 65, 81, var(--tw-text-opacity));\\n}\\n.rank-btn.cancel {\\n  --tw-border-opacity: 1;\\n  border-color: rgba(252, 165, 165, var(--tw-border-opacity));\\n}\\n.rank-btn.cancel:hover {\\n  --tw-border-opacity: 1;\\n  border-color: rgba(248, 113, 113, var(--tw-border-opacity));\\n}\\n.rating-btn.selected {\\n  border-style: none;\\n  --tw-text-opacity: 1;\\n  color: rgba(67, 56, 202, var(--tw-text-opacity));\\n  box-shadow: 1px 1px 5px rgba(0, 0, 0, .2) inset;\\n}\\n.rating-btn.selected:hover {\\n  box-shadow: 1px 1px 10px rgba(0, 0, 0, .2) inset;\\n}\\n.hide {\\n  display: none;\\n}\\n.odd {\\n  --tw-bg-opacity: 1;\\n  background-color: rgba(249, 250, 251, var(--tw-bg-opacity));\\n}</style>"],"names":[],"mappings":"AAsaO,IAAI,cAAC,CAAC,AACX,YAAY,CAAE,WAAW,CACzB,aAAa,CAAE,QAAQ,CACvB,YAAY,CAAE,GAAG,CACjB,OAAO,CAAE,WAAW,CACpB,OAAO,CAAE,WAAW,CACpB,OAAO,CAAE,YAAY,CACrB,OAAO,CAAE,IAAI,CACb,iBAAiB,CAAE,MAAM,CACzB,cAAc,CAAE,MAAM,CACtB,mBAAmB,CAAE,MAAM,CAC3B,WAAW,CAAE,MAAM,CACnB,gBAAgB,CAAE,MAAM,CACxB,aAAa,CAAE,MAAM,CACrB,uBAAuB,CAAE,MAAM,CAC/B,eAAe,CAAE,MAAM,CACvB,gBAAgB,CAAE,CAAC,CACnB,QAAQ,CAAE,CAAC,CAAC,CAAC,CAAC,EAAE,CAChB,YAAY,CAAE,CAAC,CAAC,CAAC,CAAC,EAAE,CACpB,IAAI,CAAE,CAAC,CAAC,CAAC,CAAC,EAAE,CACZ,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,OAAO,CAClB,WAAW,CAAE,IAAI,CACjB,WAAW,CAAE,QAAQ,CACrB,cAAc,CAAE,QAAQ,CACxB,iBAAiB,CAAE,CAAC,CACpB,KAAK,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,iBAAiB,CAAC,CAAC,CAClD,2BAA2B,CAAE,GAAG,CAChC,sBAAsB,CAAE,GAAG,CAC3B,mBAAmB,CAAE,GAAG,CACxB,kCAAkC,CAAE,aAAa,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAChE,6BAA6B,CAAE,aAAa,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAC3D,0BAA0B,CAAE,aAAa,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CACxD,2BAA2B,CAAE,KAAK,CAClC,sBAAsB,CAAE,KAAK,CAC7B,mBAAmB,CAAE,KAAK,AAC5B,CAAC,AACD,kBAAI,KAAK,SAAS,CAAC,MAAM,AAAC,CAAC,AACzB,iBAAiB,CAAE,OAAO,CAC1B,WAAW,CAAE,mGAAmG,CAChH,kBAAkB,CAAE,IAAI,uBAAuB,CAAC,UAAU,CAAC,CAAC,CAAC,IAAI,gBAAgB,CAAC,UAAU,CAAC,CAAC,CAAC,IAAI,WAAW,CAAC,CAC/G,UAAU,CAAE,IAAI,uBAAuB,CAAC,UAAU,CAAC,CAAC,CAAC,IAAI,gBAAgB,CAAC,UAAU,CAAC,CAAC,CAAC,IAAI,WAAW,CAAC,AACzG,CAAC,AACD,IAAI,UAAU,cAAC,CAAC,AACd,iBAAiB,CAAE,CAAC,CACpB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,EAAE,CAAC,CAAC,IAAI,iBAAiB,CAAC,CAAC,AACjD,CAAC,AACD,IAAI,gBAAgB,cAAC,CAAC,AACpB,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,EAAE,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,CACxD,iBAAiB,CAAE,CAAC,CACpB,KAAK,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,iBAAiB,CAAC,CAAC,AACpD,CAAC,AACD,SAAS,eAAe,cAAC,CAAC,AACxB,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AAC7D,CAAC,AACD,SAAS,6BAAe,MAAM,AAAC,CAAC,AAC9B,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AAC3D,CAAC,AACD,SAAS,SAAS,cAAC,CAAC,AAClB,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,CAC3D,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,CACxD,iBAAiB,CAAE,CAAC,CACpB,KAAK,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,IAAI,iBAAiB,CAAC,CAAC,AACjD,CAAC,AACD,SAAS,OAAO,cAAC,CAAC,AAChB,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AAC7D,CAAC,AACD,SAAS,qBAAO,MAAM,AAAC,CAAC,AACtB,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AAC7D,CAAC,AACD,WAAW,SAAS,cAAC,CAAC,AACpB,YAAY,CAAE,IAAI,CAClB,iBAAiB,CAAE,CAAC,CACpB,KAAK,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,iBAAiB,CAAC,CAAC,CAChD,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,KAAK,AACjD,CAAC,AACD,WAAW,uBAAS,MAAM,AAAC,CAAC,AAC1B,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,KAAK,AAClD,CAAC,AACD,KAAK,cAAC,CAAC,AACL,OAAO,CAAE,IAAI,AACf,CAAC,AACD,IAAI,cAAC,CAAC,AACJ,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,AAC7D,CAAC"}`
};
var RecommendationCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a2, _b2;
  let userRankingIds;
  let userRankingIndex;
  let userRankObj;
  let userRank;
  let ratingsIndex;
  let userRankDisplay;
  let userSeenStatus;
  let additionalRecommenderIds;
  let userHasRecommended;
  let additionalRecommendersString;
  let $currentUser, $$unsubscribe_currentUser;
  let $$unsubscribe_token;
  $$unsubscribe_currentUser = subscribe(currentUser, (value) => $currentUser = value);
  $$unsubscribe_token = subscribe(token, (value) => value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  var _a, _b;
  let { recommendation } = $$props;
  let { hideActions = false } = $$props;
  let { hideRecommendedBy = false } = $$props;
  let { showEditButton = false } = $$props;
  let { editClickCallback = void 0 } = $$props;
  let { deleteClickCallback = void 0 } = $$props;
  let { insertUpdatedRecommendation = void 0 } = $$props;
  let { hide = false } = $$props;
  let { i } = $$props;
  let tagsToAdd = [];
  const emoji = () => {
    switch (recommendation.medium) {
      case "movie":
        return "\u{1F37F}";
      case "film":
        return "\u{1F3A9}";
      case "tv":
        return "\u{1F4FA}";
      case "album":
        return "\u{1F4BF}";
      case "miniseries":
        return "\u{1F4FA}";
      case "song":
        return "\u{1F3B5}";
      case "graphic novel":
        return "\u{1F4D6}";
      default:
        return "";
    }
  };
  const ratings = [
    {
      apiValue: "fuck",
      buttonText: "Fuck this",
      readable: "You hated this"
    },
    {
      apiValue: "meh",
      buttonText: "Meh",
      readable: "Meh"
    },
    {
      apiValue: "like",
      buttonText: "Liked it",
      readable: "You liked this"
    },
    {
      apiValue: "love",
      buttonText: "Loved it",
      readable: "You loved this"
    }
  ];
  const ratingsApiVals = ratings.map((r) => r.apiValue);
  const availableOn = recommendation.available_on && streamingOptions.find((opt) => opt.key === recommendation.available_on);
  if ($$props.recommendation === void 0 && $$bindings.recommendation && recommendation !== void 0)
    $$bindings.recommendation(recommendation);
  if ($$props.hideActions === void 0 && $$bindings.hideActions && hideActions !== void 0)
    $$bindings.hideActions(hideActions);
  if ($$props.hideRecommendedBy === void 0 && $$bindings.hideRecommendedBy && hideRecommendedBy !== void 0)
    $$bindings.hideRecommendedBy(hideRecommendedBy);
  if ($$props.showEditButton === void 0 && $$bindings.showEditButton && showEditButton !== void 0)
    $$bindings.showEditButton(showEditButton);
  if ($$props.editClickCallback === void 0 && $$bindings.editClickCallback && editClickCallback !== void 0)
    $$bindings.editClickCallback(editClickCallback);
  if ($$props.deleteClickCallback === void 0 && $$bindings.deleteClickCallback && deleteClickCallback !== void 0)
    $$bindings.deleteClickCallback(deleteClickCallback);
  if ($$props.insertUpdatedRecommendation === void 0 && $$bindings.insertUpdatedRecommendation && insertUpdatedRecommendation !== void 0)
    $$bindings.insertUpdatedRecommendation(insertUpdatedRecommendation);
  if ($$props.hide === void 0 && $$bindings.hide && hide !== void 0)
    $$bindings.hide(hide);
  if ($$props.i === void 0 && $$bindings.i && i !== void 0)
    $$bindings.i(i);
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    userRankingIds = (_a = recommendation.user_recommendation_rankings) === null || _a === void 0 ? void 0 : _a.map((r) => r.user_id);
    userRankingIndex = userRankingIds === null || userRankingIds === void 0 ? void 0 : userRankingIds.indexOf($currentUser.id);
    userRankObj = userRankingIndex > -1 && recommendation.user_recommendation_rankings[userRankingIndex];
    userRank = userRankObj === null || userRankObj === void 0 ? void 0 : userRankObj.rank;
    ratingsIndex = userRank && ratingsApiVals.indexOf(userRank);
    userRankDisplay = ratingsIndex > -1 && ((_b = ratings[ratingsIndex]) === null || _b === void 0 ? void 0 : _b.readable);
    userSeenStatus = userRankObj === null || userRankObj === void 0 ? void 0 : userRankObj.seen_status;
    additionalRecommenderIds = recommendation.additional_recommenders.map((u) => u.id);
    userHasRecommended = additionalRecommenderIds.includes($currentUser.id);
    additionalRecommendersString = () => {
      let string = "";
      recommendation.additional_recommenders.forEach((u, i2, arr) => {
        string += u.name;
        if (i2 + 1 !== arr.length) {
          string += ", ";
        }
      });
      return string;
    };
    additionalRecommenderIds.includes($currentUser.id) || userRank && userRank !== "watchlist-removed" && userRank !== "rating-removed" && userRank !== "want";
    $$rendered = `<div class="${[
      "relative flex justify-between rounded-xl border-2 border-indigo-400 p-4 pb-1 shadow-sm hover:shadow-md svelte-db0kzt",
      (hide ? "hide" : "") + " " + (i % 2 === 1 ? "odd" : "")
    ].join(" ").trim()}">${`<div class="${"flex flex-col w-full"}"><div class="${"flex mb-1 justify-between"}"><div class="${"mr-2 flex flex-col"}"><span class="${"text-lg font-semibold"}">${escape(recommendation.title)} |
            ${escape(toTitleCase(recommendation.medium))}
            ${escape(emoji())}</span>
          ${recommendation.colorization ? `<span class="${"text-xs font-semibold"}">${escape(toTitleCase(recommendation.colorization))}</span>` : ``}</div>

        <div class="${"flex-1 mr-2"}"><div class="${"flex flex-wrap flex-1 items-center h-full -mt-1"}">${each(recommendation.recommendation_tag_joins, (tagJoin) => `${validate_component(RecommendationCardTag, "RecommendationCardTag").$$render($$result, { tagJoin }, {}, {})}`)}
            ${each(tagsToAdd, (tag) => `${validate_component(RecommendationCardTag, "RecommendationCardTag").$$render($$result, {
      tagJoin: {
        tag,
        added_by: { name: $currentUser.name }
      }
    }, {}, {})}`)}
            ${!showEditButton ? `<button class="${"text-xs rounded-full border-solid border-1 px-2 mr-1 border-indigo-300 mt-1 hover:border-indigo-500"}">+ Add Tag(s)</button>` : ``}</div></div>

        <div class="${"flex flex-col relative"}">${!hideRecommendedBy ? `<span class="${"font-light"}">Recommended by: <span class="${"font-semibold"}">${escape(toTitleCase((_a2 = recommendation.recommended_by) == null ? void 0 : _a2.name))}</span></span>` : ``}

          ${showEditButton ? `<div class="${"flex space-x-1"}"><button class="${"text-indigo-600 text-sm font-semibold"}">Edit</button>
              <span>|</span>
              <button class="${"text-red-600 text-sm font-semibold"}">Delete</button></div>` : ``}

          ${recommendation.available_on ? `<div class="${"absolute top-6 right-0 flex space-x-2"}"><img class="${"h-8 w-auto"}"${add_attribute("alt", availableOn.name, 0)}${add_attribute("src", availableOn.img, 0)}></div>` : ``}</div></div>

      <div class="${"flex flex-row justify-between items-center w-full mb-1"}">${((_b2 = recommendation.additional_recommenders) == null ? void 0 : _b2.length) > 0 ? `<div class="${"flex flex-col"}"><span class="${"text-xs"}">Also recommended by</span>
              <span>${escape(additionalRecommendersString())}</span></div>` : ``}

        <div class="${"flex flex-col"}"><span class="${"text-xs"}">Has Orion Seen It?</span>
          <span>${escape(recommendation.has_orion_seen ? toTitleCase(recommendation.has_orion_seen) : "N/A")}</span></div>

        <div class="${"flex flex-col"}"><span class="${"text-xs"}">Do Journey&#39;s Cats Hate It?</span>
          <span>${escape(recommendation.do_journeys_cats_hate ? toTitleCase(recommendation.do_journeys_cats_hate) : "Maybe")}</span></div>

        <div class="${"flex flex-col"}"><span class="${"text-xs"}">Ernest Rating</span>
          <img class="${"h-12 w-auto"}"${add_attribute("src", recommendation.ernest_rating, 0)}></div></div>

      ${!hideActions ? `<div class="${"border-t border-solid pt-1 flex flex-row space-x-2 space-y-0"}">${`<button class="${[
      "btn rating-btn negative svelte-db0kzt",
      !!userRankDisplay ? "selected" : ""
    ].join(" ").trim()}">${escape(userRankDisplay ? `${userRankDisplay}` : "\u2764\uFE0F Rate It!")}</button>
            ${userHasRecommended ? `<button class="${["btn rating-btn svelte-db0kzt", userHasRecommended ? "selected" : ""].join(" ").trim()}">Also Recommended
              </button>` : `<button class="${[
      "btn rating-btn svelte-db0kzt",
      userRank === "liked" ? "selected" : ""
    ].join(" ").trim()}">\u{1F44D}\xA0Also Recommend
              </button>`}
            ${`${userSeenStatus === "want" ? `<a href="${"/profile/watchlist"}" class="${"btn watchlist-added svelte-db0kzt"}">Added to Watch List
                </a>` : `<button class="${"btn watchlist svelte-db0kzt"}">+ Watch List
                </button>`}`}`}</div>` : ``}</div>`}</div>

${``}`;
  } while (!$$settled);
  $$unsubscribe_currentUser();
  $$unsubscribe_token();
  return $$rendered;
});
var css$1 = {
  code: "h2{font-size:1.125rem;line-height:1.75rem}h3{font-size:0.875rem;line-height:1.25rem}.layout-background{background:repeating-linear-gradient(45deg, #c7d2fe, #cffafe, #c7d2fe 25%)}",
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script context='module'>\\n  import { api, apiGet, baseURL } from \\"../api/api.svelte\\";\\n  import { onMount } from \\"svelte\\";\\n<\/script>\\n\\n<script lang='ts'>var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport CreateRecommendation from '../components/CreateRecommendation.svelte';\\nimport 'virtual:windi.css';\\nimport { currentUser, localTags, showCreateRecommendation, showUserRecommendations, token } from '../stores/main';\\nimport Header from '../components/Header.svelte';\\nimport { browser } from '$app/env';\\nimport Modal from \\"$src/components/Modal.svelte\\";\\nimport RecommendationCard from \\"$src/components/RecommendationCard.svelte\\";\\nimport { goto } from '$app/navigation';\\nexport let tags;\\nexport let auth;\\nlet loadingUserRecommendations = false;\\nlet userRecommendations = [];\\nlet notHideId;\\nlet recommendationCount = $currentUser === null || $currentUser === void 0 ? void 0 : $currentUser.recommended_count;\\nconst fetchTags = () => __awaiter(void 0, void 0, void 0, function* () {\\n    const obj = {\\n        endpoint: 'tags'\\n    };\\n    const resp = yield api(fetch, obj);\\n    const body = yield resp;\\n    console.log(resp);\\n    localTags.set(body);\\n});\\nconst checkTokenAndLogin = () => __awaiter(void 0, void 0, void 0, function* () {\\n    if (browser) {\\n        const lsToken = localStorage.getItem(\\"token\\");\\n        if (lsToken) {\\n            token.set(lsToken);\\n            const resp = yield apiGet({ endpoint: 'current-user' });\\n            if (resp.status === 200) {\\n                const user = yield resp.json();\\n                currentUser.set(user);\\n                fetchTags();\\n            }\\n            else {\\n                // HANDLE ERROR\\n            }\\n        }\\n        else {\\n            goto('/auth/sign-in');\\n        }\\n    }\\n});\\nconst handleShowUserRecommendations = () => __awaiter(void 0, void 0, void 0, function* () {\\n    loadingUserRecommendations = true;\\n    showUserRecommendations.set(true);\\n    const obj = {\\n        endpoint: '/user-recommended-by',\\n        params: {\\n            user_id: $currentUser === null || $currentUser === void 0 ? void 0 : $currentUser.id\\n        }\\n    };\\n    const resp = yield apiGet(obj);\\n    if (resp.status === 200) {\\n        const body = yield resp.json();\\n        console.log(body);\\n        loadingUserRecommendations = false;\\n        userRecommendations = body;\\n    }\\n});\\nconst hideAllButOne = (id = undefined) => {\\n    notHideId = id;\\n};\\nconst handleCloseEditModal = () => {\\n    notHideId = undefined;\\n    showUserRecommendations.set(false);\\n};\\nconst removeRecommendation = (id = undefined) => {\\n    const ids = userRecommendations.map(r => r.id);\\n    const index = ids.indexOf(id);\\n    if (index > -1) {\\n        const oldArr = [...userRecommendations];\\n        oldArr.splice(index, 1);\\n        userRecommendations = [...oldArr];\\n        recommendationCount = recommendationCount - 1;\\n    }\\n};\\nlet promise = checkTokenAndLogin();\\n<\/script>\\n\\n{#if $currentUser?.id}\\n  <Header\\n    {handleShowUserRecommendations}\\n  />\\n\\n  <main class='layout-background min-h-screen'>\\n    <div class='w-screen flex justify-center'>\\n      <div class='bg-white w-full max-w-200 min-h-screen pt-20 px-8'>\\n        {#await promise}\\n          <p>loading</p>\\n        {:then}\\n          <slot />\\n        {:catch error}\\n          <p>Sign in error</p>\\n        {/await}\\n\\n      </div>\\n    </div>\\n  </main>\\n\\n  {#if $showCreateRecommendation}\\n    <Modal\\n      onHideModal={() => showCreateRecommendation.set(false)}\\n      hideCloseX\\n    >\\n      <CreateRecommendation\\n        onHideModal={() => showCreateRecommendation.set(false)}\\n      />\\n    </Modal>\\n  {/if}\\n\\n  {#if $showUserRecommendations}\\n    <Modal hideCloseX onHideModal={handleCloseEditModal}>\\n      <div class='space-y-2'>\\n        {#each userRecommendations as recommendation}\\n          <RecommendationCard\\n            {recommendation}\\n            hideActions\\n            hideRecommendedBy\\n            showEditButton\\n            hide={notHideId && notHideId !== recommendation.id }\\n            editClickCallback={hideAllButOne}\\n            deleteClickCallback={removeRecommendation}\\n          />\\n        {/each}\\n      </div>\\n    </Modal>\\n  {/if}\\n{/if}\\n\\n<style global>:global(h2) {\\n  font-size: 1.125rem;\\n  line-height: 1.75rem;\\n}\\n:global(h3) {\\n  font-size: 0.875rem;\\n  line-height: 1.25rem;\\n}\\n:global(.layout-background) {\\n  background: repeating-linear-gradient(45deg, #c7d2fe, #cffafe, #c7d2fe 25%);\\n}</style>"],"names":[],"mappings":"AAgJsB,EAAE,AAAE,CAAC,AACzB,SAAS,CAAE,QAAQ,CACnB,WAAW,CAAE,OAAO,AACtB,CAAC,AACO,EAAE,AAAE,CAAC,AACX,SAAS,CAAE,QAAQ,CACnB,WAAW,CAAE,OAAO,AACtB,CAAC,AACO,kBAAkB,AAAE,CAAC,AAC3B,UAAU,CAAE,0BAA0B,KAAK,CAAC,CAAC,OAAO,CAAC,CAAC,OAAO,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,AAC7E,CAAC"}`
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentUser, $$unsubscribe_currentUser;
  let $showCreateRecommendation, $$unsubscribe_showCreateRecommendation;
  let $showUserRecommendations, $$unsubscribe_showUserRecommendations;
  $$unsubscribe_currentUser = subscribe(currentUser, (value) => $currentUser = value);
  $$unsubscribe_showCreateRecommendation = subscribe(showCreateRecommendation, (value) => $showCreateRecommendation = value);
  $$unsubscribe_showUserRecommendations = subscribe(showUserRecommendations, (value) => $showUserRecommendations = value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let { tags } = $$props;
  let { auth } = $$props;
  let userRecommendations = [];
  let notHideId;
  $currentUser === null || $currentUser === void 0 ? void 0 : $currentUser.recommended_count;
  const checkTokenAndLogin = () => __awaiter2(void 0, void 0, void 0, function* () {
  });
  const handleShowUserRecommendations = () => __awaiter2(void 0, void 0, void 0, function* () {
    showUserRecommendations.set(true);
    const obj = {
      endpoint: "/user-recommended-by",
      params: {
        user_id: $currentUser === null || $currentUser === void 0 ? void 0 : $currentUser.id
      }
    };
    const resp = yield apiGet(obj);
    if (resp.status === 200) {
      const body = yield resp.json();
      console.log(body);
      userRecommendations = body;
    }
  });
  const hideAllButOne = (id = void 0) => {
    notHideId = id;
  };
  const handleCloseEditModal = () => {
    notHideId = void 0;
    showUserRecommendations.set(false);
  };
  const removeRecommendation = (id = void 0) => {
    const ids = userRecommendations.map((r) => r.id);
    const index2 = ids.indexOf(id);
    if (index2 > -1) {
      const oldArr = [...userRecommendations];
      oldArr.splice(index2, 1);
      userRecommendations = [...oldArr];
    }
  };
  let promise = checkTokenAndLogin();
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
    $$bindings.tags(tags);
  if ($$props.auth === void 0 && $$bindings.auth && auth !== void 0)
    $$bindings.auth(auth);
  $$result.css.add(css$1);
  $$unsubscribe_currentUser();
  $$unsubscribe_showCreateRecommendation();
  $$unsubscribe_showUserRecommendations();
  return `${($currentUser == null ? void 0 : $currentUser.id) ? `${validate_component(Header, "Header").$$render($$result, { handleShowUserRecommendations }, {}, {})}

  <main class="${"layout-background min-h-screen"}"><div class="${"w-screen flex justify-center"}"><div class="${"bg-white w-full max-w-200 min-h-screen pt-20 px-8"}">${function(__value) {
    if (is_promise(__value))
      return `
          <p>loading</p>
        `;
    return function() {
      return `
          ${slots.default ? slots.default({}) : ``}
        `;
    }();
  }(promise)}</div></div></main>

  ${$showCreateRecommendation ? `${validate_component(Modal, "Modal").$$render($$result, {
    onHideModal: () => showCreateRecommendation.set(false),
    hideCloseX: true
  }, {}, {
    default: () => `${validate_component(CreateRecommendation, "CreateRecommendation").$$render($$result, {
      onHideModal: () => showCreateRecommendation.set(false)
    }, {}, {})}`
  })}` : ``}

  ${$showUserRecommendations ? `${validate_component(Modal, "Modal").$$render($$result, {
    hideCloseX: true,
    onHideModal: handleCloseEditModal
  }, {}, {
    default: () => `<div class="${"space-y-2"}">${each(userRecommendations, (recommendation) => `${validate_component(RecommendationCard, "RecommendationCard").$$render($$result, {
      recommendation,
      hideActions: true,
      hideRecommendedBy: true,
      showEditButton: true,
      hide: notHideId && notHideId !== recommendation.id,
      editClickCallback: hideAllButOne,
      deleteClickCallback: removeRecommendation
    }, {}, {})}`)}</div>`
  })}` : ``}` : ``}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1 class="${"mb-1"}">Welcome to SvelteKit</h1>
<p>Visit <a href="${"https://kit.svelte.dev"}">kit.svelte.dev</a> to read the documentation</p>`;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var css = {
  code: "select.svelte-1y8520g{-webkit-appearance:none;-moz-appearance:none;appearance:none;--tw-border-opacity:1;border-color:rgba(147, 197, 253, var(--tw-border-opacity));border-radius:0.375rem;border-style:solid;border-width:1px;cursor:pointer;height:2rem;margin-right:0.5rem;padding-left:0.5rem;padding-right:0.5rem}select.svelte-1y8520g:hover{--tw-border-opacity:1;border-color:rgba(30, 64, 175, var(--tw-border-opacity))}button.svelte-1y8520g{--tw-border-opacity:1;border-color:rgba(147, 197, 253, var(--tw-border-opacity));border-radius:0.375rem;border-style:solid;border-width:1px;cursor:pointer;height:2rem;margin-right:0.5rem;padding-left:0.5rem;padding-right:0.5rem}button.svelte-1y8520g:hover{--tw-border-opacity:1;border-color:rgba(30, 64, 175, var(--tw-border-opacity))}",
  map: `{"version":3,"file":"SortDropdowns.svelte","sources":["SortDropdowns.svelte"],"sourcesContent":["<script lang='ts'>const sortOptions = [\\n    {\\n        key: 'title',\\n        name: 'Alphabetical'\\n    },\\n    {\\n        key: 'recommended_by.name',\\n        name: 'Recommended By'\\n    },\\n    {\\n        key: 'medium',\\n        name: 'Medium'\\n    },\\n    {\\n        key: 'do_journeys_cats_hate',\\n        name: \\"Cat Preference\\"\\n    },\\n    {\\n        key: 'has_orion_seen',\\n        name: \\"Orion Viewership\\"\\n    },\\n    {\\n        key: 'ernest_rating',\\n        name: 'Ernest Rating'\\n    }\\n];\\nexport let fetchRecommendations;\\nlet primarySelected = sortOptions[0].key;\\nlet primaryDirectionAsc = true;\\nlet secondarySelected = sortOptions[0].key;\\nlet secondaryDirectionAsc = true;\\nlet tertiarySelected = sortOptions[0].key;\\nlet tertiaryDirectionAsc = true;\\nconst handlePrimarySelect = (e) => {\\n    primarySelected = e.target.value;\\n};\\n$: fetchRecommendations({\\n    primaryString: \`\${primarySelected} \${primaryDirectionAsc ? 'ASC' : 'DESC'}\`,\\n    secondaryString: \`\${secondarySelected} \${secondaryDirectionAsc ? 'ASC' : 'DESC'}\`\\n});\\n<\/script>\\n\\n<div class='flex mb-8 justify-between'>\\n  <div class='flex flex-col'>\\n    <span class='text-xs'>Primary Sort</span>\\n    <div class='flex'>\\n      <select bind:value={primarySelected} on:change={handlePrimarySelect} name='primary'>\\n        {#each sortOptions as option}\\n          <option value={option.key}>{option.name}</option>\\n        {/each}\\n      </select>\\n      <button on:click={() => primaryDirectionAsc = !primaryDirectionAsc}>{primaryDirectionAsc ? 'ASC\u21E1' : 'DSC\u21E3'}</button>\\n    </div>\\n  </div>\\n  <div class='flex flex-col'>\\n    <span class='text-xs'>Secondary Sort</span>\\n    <div class='flex'>\\n      <select name='secondary'>\\n        {#each sortOptions as option}\\n          <option value={option.key} selected={secondarySelected?.key === option.key}>{option.name}</option>\\n        {/each}\\n      </select>\\n      <button on:click={() => secondaryDirectionAsc = !secondaryDirectionAsc}>{secondaryDirectionAsc ? 'ASC\u21E1' : 'DSC\u21E3'}</button>\\n    </div>\\n  </div>\\n  <div class='flex flex-col'>\\n    <span class='text-xs'>Tertiary Sort</span>\\n    <div class='flex'>\\n      <select name='tertiary' bind:value={tertiarySelected}>\\n        {#each sortOptions as option}\\n          <option value={option.key}>{option.name}</option>\\n        {/each}\\n      </select>\\n      <button on:click={() => tertiaryDirectionAsc = !tertiaryDirectionAsc}>{tertiaryDirectionAsc ? 'ASC\u21E1' : 'DSC\u21E3'}</button>\\n    </div>\\n  </div>\\n</div>\\n\\n<style>select {\\n  -webkit-appearance: none;\\n  -moz-appearance: none;\\n  appearance: none;\\n  --tw-border-opacity: 1;\\n  border-color: rgba(147, 197, 253, var(--tw-border-opacity));\\n  border-radius: 0.375rem;\\n  border-style: solid;\\n  border-width: 1px;\\n  cursor: pointer;\\n  height: 2rem;\\n  margin-right: 0.5rem;\\n  padding-left: 0.5rem;\\n  padding-right: 0.5rem;\\n}\\nselect:hover {\\n  --tw-border-opacity: 1;\\n  border-color: rgba(30, 64, 175, var(--tw-border-opacity));\\n}\\nbutton {\\n  --tw-border-opacity: 1;\\n  border-color: rgba(147, 197, 253, var(--tw-border-opacity));\\n  border-radius: 0.375rem;\\n  border-style: solid;\\n  border-width: 1px;\\n  cursor: pointer;\\n  height: 2rem;\\n  margin-right: 0.5rem;\\n  padding-left: 0.5rem;\\n  padding-right: 0.5rem;\\n}\\nbutton:hover {\\n  --tw-border-opacity: 1;\\n  border-color: rgba(30, 64, 175, var(--tw-border-opacity));\\n}</style>"],"names":[],"mappings":"AA8EO,MAAM,eAAC,CAAC,AACb,kBAAkB,CAAE,IAAI,CACxB,eAAe,CAAE,IAAI,CACrB,UAAU,CAAE,IAAI,CAChB,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,CAC3D,aAAa,CAAE,QAAQ,CACvB,YAAY,CAAE,KAAK,CACnB,YAAY,CAAE,GAAG,CACjB,MAAM,CAAE,OAAO,CACf,MAAM,CAAE,IAAI,CACZ,YAAY,CAAE,MAAM,CACpB,YAAY,CAAE,MAAM,CACpB,aAAa,CAAE,MAAM,AACvB,CAAC,AACD,qBAAM,MAAM,AAAC,CAAC,AACZ,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AAC3D,CAAC,AACD,MAAM,eAAC,CAAC,AACN,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,CAC3D,aAAa,CAAE,QAAQ,CACvB,YAAY,CAAE,KAAK,CACnB,YAAY,CAAE,GAAG,CACjB,MAAM,CAAE,OAAO,CACf,MAAM,CAAE,IAAI,CACZ,YAAY,CAAE,MAAM,CACpB,YAAY,CAAE,MAAM,CACpB,aAAa,CAAE,MAAM,AACvB,CAAC,AACD,qBAAM,MAAM,AAAC,CAAC,AACZ,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAAC,AAC3D,CAAC"}`
};
var SortDropdowns = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const sortOptions = [
    { key: "title", name: "Alphabetical" },
    {
      key: "recommended_by.name",
      name: "Recommended By"
    },
    { key: "medium", name: "Medium" },
    {
      key: "do_journeys_cats_hate",
      name: "Cat Preference"
    },
    {
      key: "has_orion_seen",
      name: "Orion Viewership"
    },
    {
      key: "ernest_rating",
      name: "Ernest Rating"
    }
  ];
  let { fetchRecommendations } = $$props;
  let primarySelected = sortOptions[0].key;
  let secondarySelected = sortOptions[0].key;
  sortOptions[0].key;
  if ($$props.fetchRecommendations === void 0 && $$bindings.fetchRecommendations && fetchRecommendations !== void 0)
    $$bindings.fetchRecommendations(fetchRecommendations);
  $$result.css.add(css);
  {
    fetchRecommendations({
      primaryString: `${primarySelected} ${"ASC"}`,
      secondaryString: `${secondarySelected} ${"ASC"}`
    });
  }
  return `<div class="${"flex mb-8 justify-between"}"><div class="${"flex flex-col"}"><span class="${"text-xs"}">Primary Sort</span>
    <div class="${"flex"}"><select name="${"primary"}" class="${"svelte-1y8520g"}">${each(sortOptions, (option) => `<option${add_attribute("value", option.key, 0)}>${escape(option.name)}</option>`)}</select>
      <button class="${"svelte-1y8520g"}">${escape("ASC\u21E1")}</button></div></div>
  <div class="${"flex flex-col"}"><span class="${"text-xs"}">Secondary Sort</span>
    <div class="${"flex"}"><select name="${"secondary"}" class="${"svelte-1y8520g"}">${each(sortOptions, (option) => `<option${add_attribute("value", option.key, 0)} ${(secondarySelected == null ? void 0 : secondarySelected.key) === option.key ? "selected" : ""}>${escape(option.name)}</option>`)}</select>
      <button class="${"svelte-1y8520g"}">${escape("ASC\u21E1")}</button></div></div>
  <div class="${"flex flex-col"}"><span class="${"text-xs"}">Tertiary Sort</span>
    <div class="${"flex"}"><select name="${"tertiary"}" class="${"svelte-1y8520g"}">${each(sortOptions, (option) => `<option${add_attribute("value", option.key, 0)}>${escape(option.name)}</option>`)}</select>
      <button class="${"svelte-1y8520g"}">${escape("ASC\u21E1")}</button></div></div>
</div>`;
});
var Recommendations = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentUser, $$unsubscribe_currentUser;
  $$unsubscribe_currentUser = subscribe(currentUser, (value) => $currentUser = value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let { recommendations = [] } = $$props;
  const fetchRecommendations = (sortObj) => __awaiter2(void 0, void 0, void 0, function* () {
    const obj = {
      endpoint: "recommendations",
      params: {
        user_id: $currentUser === null || $currentUser === void 0 ? void 0 : $currentUser.id,
        primary_sort: sortObj.primaryString,
        secondary_sort: sortObj.secondaryString,
        tertiary_sort: sortObj.tertiaryString
      }
    };
    const recommendationsResponse = yield api(fetch, obj);
    if ((recommendationsResponse === null || recommendationsResponse === void 0 ? void 0 : recommendationsResponse.length) > 0) {
      recommendations = recommendationsResponse;
    }
  });
  const handleInsertUpdatedRecommendation = (recommendation, index2) => {
    recommendations[index2] = recommendation;
  };
  if ($$props.recommendations === void 0 && $$bindings.recommendations && recommendations !== void 0)
    $$bindings.recommendations(recommendations);
  $$unsubscribe_currentUser();
  return `<div class="${"flex mb-4"}"><h1 class="${"text-xl font-bold"}">Recommendations for\xA0</h1>
  <button class="${"text-xl"}">Halloween</button></div>

${validate_component(SortDropdowns, "SortDropdowns").$$render($$result, { fetchRecommendations }, {}, {})}

<div class="${"space-y-3"}">${each(recommendations, (recommendation, i) => `${validate_component(RecommendationCard, "RecommendationCard").$$render($$result, {
    recommendation,
    i,
    insertUpdatedRecommendation: handleInsertUpdatedRecommendation
  }, {}, {})}`)}</div>`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Recommendations
});
var ProfileAttribute = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { label } = $$props;
  let { displayValue } = $$props;
  let { hideEdit } = $$props;
  let { editText = "edit" } = $$props;
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.displayValue === void 0 && $$bindings.displayValue && displayValue !== void 0)
    $$bindings.displayValue(displayValue);
  if ($$props.hideEdit === void 0 && $$bindings.hideEdit && hideEdit !== void 0)
    $$bindings.hideEdit(hideEdit);
  if ($$props.editText === void 0 && $$bindings.editText && editText !== void 0)
    $$bindings.editText(editText);
  return `<div class="${"flex flex-col"}"><div class="${"flex flex-row items-center"}"><span class="${"text-sm font-semibold"}">${escape(label)}</span>

    ${!hideEdit ? `<button class="${"text-xs font-semibold text-indigo-600 ml-2"}">${escape(editText)}</button>` : ``}</div>
  <span class="${"text-lg"}">${escape(displayValue)}</span></div>`;
});
var Profile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentUser, $$unsubscribe_currentUser;
  $$unsubscribe_currentUser = subscribe(currentUser, (value) => $currentUser = value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let recommendationCount = $currentUser.recommended_count;
  $$unsubscribe_currentUser();
  return `<h1 class="${"text-xl font-bold mb-4"}">${escape($currentUser.name)}&#39;s Profile</h1>
<div class="${"flex w-full items-start justify-between"}"><div><div class="${"flex items-center mb-1"}"><span class="${"text-sm font-semibold"}">Img</span>
      <button class="${"text-xs font-semibold text-indigo-600 ml-2"}">edit</button></div>
    <img class="${"w-70 h-auto"}"${add_attribute("src", $currentUser.image, 0)} alt="${"Profile"}"></div>
  <div class="${"flex flex-col space-y-4"}">${validate_component(ProfileAttribute, "ProfileAttribute").$$render($$result, {
    label: "Name",
    displayValue: $currentUser.name,
    hideEdit: true
  }, {}, {})}
    ${validate_component(ProfileAttribute, "ProfileAttribute").$$render($$result, {
    label: "Username",
    displayValue: $currentUser.username
  }, {}, {})}
    ${validate_component(ProfileAttribute, "ProfileAttribute").$$render($$result, {
    label: "Email",
    displayValue: $currentUser.email
  }, {}, {})}
    ${validate_component(ProfileAttribute, "ProfileAttribute").$$render($$result, {
    label: "Password",
    displayValue: "**********",
    editText: "reset"
  }, {}, {})}
    ${validate_component(ProfileAttribute, "ProfileAttribute").$$render($$result, {
    label: "Discord Username",
    displayValue: $currentUser.discord_username
  }, {}, {})}</div>

  <div><p>You&#39;ve made <button class="${"text-indigo-600 underline"}">${escape(recommendationCount)} recommendations</button></p></div></div>

${``}`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Profile
});
var My_recommendations = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var myRecommendations = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": My_recommendations
});
var Watchlist = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_currentUser;
  $$unsubscribe_currentUser = subscribe(currentUser, (value) => value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { recommendations = [] } = $$props;
  if ($$props.recommendations === void 0 && $$bindings.recommendations && recommendations !== void 0)
    $$bindings.recommendations(recommendations);
  $$unsubscribe_currentUser();
  return `<div class="${"flex mb-4"}"><h1 class="${"text-xl font-bold"}">My Watchlist (for me!)</h1></div>

<div class="${"space-y-2"}">${each(recommendations, (recommendation) => `${validate_component(RecommendationCard, "RecommendationCard").$$render($$result, { recommendation, watchlistMode: true }, {}, {})}`)}</div>`;
});
var watchlist = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Watchlist
});
var _layout_reset = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${slots.default ? slots.default({}) : ``}`;
});
var __layout_reset = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout_reset
});
var Register = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var register = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Register
});
var Sign_in = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  return `<div class="${"flex w-screen h-screen items-center justify-center"}"><div class="${"absolute w-full h-1/2 top-0 left-0 bg-indigo-200 .to-green-500"}"></div>
  ${``}</div>`;
});
var signIn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Sign_in
});

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
