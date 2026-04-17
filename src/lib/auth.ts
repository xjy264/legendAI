import { createHash, timingSafeEqual } from "node:crypto";

const fallbackPasswordHash =
  "0d91d425f10fcd91050fe8848fbbd1d5e72e0fe7e97028ca6fb6ead45ec4fbd3";
export const adminSessionCookieName = "legendai-admin";

function hashPassword(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function getAdminPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH ?? fallbackPasswordHash;
}

export function isAdminPassword(password: string) {
  const expected = getAdminPasswordHash();
  const actual = hashPassword(password);

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

export function adminSessionValueForPassword(password: string) {
  return hashPassword(password);
}

export function isAdminSessionValue(value: string | null | undefined) {
  return value === getAdminPasswordHash();
}

export function isAdminRequestAuthorized(cookieHeader: string | null | undefined, password: string) {
  return isAdminSessionValue(getCookieValue(cookieHeader, adminSessionCookieName)) || isAdminPassword(password);
}

export function getCookieValue(cookieHeader: string | null | undefined, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const pairs = cookieHeader.split(";").map((item) => item.trim());
  for (const pair of pairs) {
    const index = pair.indexOf("=");
    if (index <= 0) {
      continue;
    }

    const key = pair.slice(0, index);
    if (key === name) {
      return decodeURIComponent(pair.slice(index + 1));
    }
  }

  return null;
}

export function getAdminReturnPath(request: Request) {
  const referer = request.headers.get("referer");

  if (referer) {
    try {
      const url = new URL(referer);
      if (url.pathname.startsWith("/en/studio/xjy-7a9f")) {
        return "/en/studio/xjy-7a9f";
      }
    } catch {
      // Ignore malformed referers and fall back below.
    }
  }

  return "/studio/xjy-7a9f";
}
