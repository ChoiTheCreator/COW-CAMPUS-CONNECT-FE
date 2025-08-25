// src/api/api.ts
import axios from 'axios';
import type { User, Profile, Match, Stats } from '../types';

/**
 * 배포(PROD): baseURL을 빈 문자열('')로 두면, 브라우저가 현재 Origin으로 보냄.
 *             Vercel rewrites가 /api/** 를 EC2로 프록시하므로 혼합콘텐츠(HTTPS→HTTP) 문제 없음.
 * 로컬(DEV):  .env.local의 VITE_API_BASE_URL이 있으면 사용, 없으면 8080.
 */
const BASE_URL = import.meta.env.PROD
  ? '' // e.g. https://cow-campus-connect.vercel.app + /api/...
  : import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000, // 무한 대기 방지
});

// ===== USERS =====
export async function login(params: { id: number; name: string }) {
  const { data } = await http.post<User>('/api/users/login', params);
  return data;
}

export async function signUp(params: {
  id: number;
  name: string;
  gender: string;
}) {
  const { data } = await http.post<User>('/api/users/signup', params);
  return data;
}

export async function getIsSignedUser(userId: string) {
  const { data } = await http.get<boolean>(`/api/users/${userId}/exists`);
  return data;
}

export async function increaseCheckNum(userId: number) {
  await http.post<void>(`/api/users/${userId}/checknum/increase`);
}

export async function checkNumGet(userId: number) {
  const { data } = await http.get<number>(`/api/users/${userId}/checknum`);
  return data;
}

export async function getUser(userId: number) {
  const { data } = await http.get<User>(`/api/users/${userId}`);
  return data;
}

// ===== PROFILES =====
export async function signUpProfile(params: {
  userId: number;
  nickname: string;
  mbti: string;
  description?: string;
  instaProfile?: string;
}) {
  const { data } = await http.post<Profile>('/api/profiles', params);
  return data;
}

export async function getAllProfile(params: {
  studentGender: string; // 'male' | 'female'
  offset: number;
  limit: number;
}) {
  const { data } = await http.get<Profile[]>('/api/profiles', {
    params: {
      gender: params.studentGender,
      offset: params.offset,
      limit: params.limit,
    },
  });
  return data;
}

// ===== MATCHES =====
// 백엔드: POST /api/matches  (OK)
export async function matchingUpdate(params: {
  userId: number;
  targetId: number;
}) {
  const { data } = await http.post<Match>('/api/matches', params);
  return data;
}

// 백엔드: GET /api/matches/mine?userId=...
export async function getMyMatches(userId: number) {
  const { data } = await http.get<Match[]>('/api/matches/mine', {
    params: { userId },
  });
  return data;
}

// 백엔드: GET /api/matches/my/profiles?userId=...
export async function getMatchesWithProfile(userId: number) {
  const { data } = await http.get<Profile[]>('/api/matches/my/profiles', {
    params: { userId },
  });
  return data;
}

// ===== STATS / METRICS =====
// 백엔드: GET /api/metrics/summary
export async function getGlobalStats() {
  const { data } = await http.get<Stats>('/api/metrics/summary');
  return data;
}

//  백엔드에 사용자별 통계 엔드포인트가 없으면 임시로 전역 요약을 재사용하거나 주석 처리
// export async function getUserStats(_userId: number) {
//   const { data } = await http.get<Stats>('/api/metrics/summary');
//   return data;
// }
