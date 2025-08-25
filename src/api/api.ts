// src/api/api.ts
import axios from 'axios';
import type { User, Profile, Match, Stats } from '../types';

// env 값을 읽되, 브라우저가 https라면 동일출처로 호출(= '' 사용)
const ENV_BASE = import.meta.env.VITE_API_BASE_URL;

function resolveBaseURL() {
  if (typeof window !== 'undefined') {
    const isHttpsPage = window.location.protocol === 'https:';
    if (isHttpsPage) {
      // Vercel(https)에서는 /api/... 로 호출해서 rewrites 타게 함
      return '';
    }
  }

  return ENV_BASE || 'http://localhost:8080';
}

export const http = axios.create({
  baseURL: resolveBaseURL(),
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
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
  const { data } = await http.get<boolean>(
    `/api/users/${encodeURIComponent(userId)}/exists`
  );
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
  studentGender: string;
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
  const { data } = await http.get<Match[]>('/api/matches/my', {
    params: { userId },
  });
  return data;
}

export async function getMatchesWithProfile(userId: number) {
  const { data } = await http.get<Profile[]>('/api/matches/my/profiles', {
    params: { userId },
  });
  return data;
}

// ===== STATS =====
export async function getGlobalStats() {
  const { data } = await http.get<Stats>('/api/stats');
  return data;
}

export async function getUserStats(userId: number) {
  const { data } = await http.get<Stats>(`/api/stats/${userId}`);
  return data;
}
