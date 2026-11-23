import { request } from "./client";
import type { Session } from "./types";

export function getSession(): Promise<Session> {
  return request<Session>("/session");
}