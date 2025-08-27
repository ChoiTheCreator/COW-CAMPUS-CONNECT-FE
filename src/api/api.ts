// src/api/api.ts
import axios from 'axios';
import type { User, Profile, Match, Stats, SummaryDto } from '../types';

export const http = axios.create({
  baseURL: '',
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000, // 무한로딩 방지용
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
  // 204 No Content 반환 → 에러 아님
  await http.post(`/api/users/${userId}/checknum/increase`);
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

// 컨트롤러에 /api/profiles 와 /api/profiles/page 둘 다 있음.
// 기존 호출과 맞추려면 /api/profiles?gender&offset&limit 유지
export async function getAllProfile(params: {
  studentGender?: string;
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
export async function matchingUpdate(params: {
  userId: number;
  targetId: number;
}) {
  const { data } = await http.post<Match>('/api/matches', params);
  return data;
}

export async function getMyMatches(userId: number) {
  // 컨트롤러: GET /api/matches/mine?userId=...
  const { data } = await http.get<Match[]>('/api/matches/mine', {
    params: { userId },
  });
  return data;
}

export async function getMatchesWithProfile(userId: number) {
  // 컨트롤러: GET /api/matches/my/profiles?userId=...
  const { data } = await http.get<Profile[]>('/api/matches/my/profiles', {
    params: { userId },
  });
  return data;
}

// ===== METRICS / STATS =====

// 컨트롤러: GET /api/stats/{userId}
export async function getUserStats(userId: number) {
  const { data } = await http.get<Stats>(`/api/stats/${userId}`);
  return data;
}

// 컨트롤러: POST /api/stats/{userId}/increment-match
export async function incrementUserMatch(userId: number) {
  const { data } = await http.post<Stats>(
    `/api/stats/${userId}/increment-match`
  );
  return data;
}

//
export async function getSummaryMetrics() {
  const { data } = await http.get<SummaryDto>('/api/metrics/summary');
  console.log(data);
  return data;
}
