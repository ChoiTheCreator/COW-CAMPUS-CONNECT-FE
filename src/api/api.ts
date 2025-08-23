// src/api/api.ts
import axios from 'axios';

// Vite는 브라우저 노출 가능한 환경변수에 반드시 VITE_ 프리픽스가 필요해요!
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

// 공용 axios 인스턴스
export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // 세션 쓸거면 true, 지금은 무토큰 방식이라 false
  headers: { 'Content-Type': 'application/json' },
});

// ====== 타입 ======
export interface User {
  id: number; // 학번(Primary Key)
  name: string;
  gender: string | null;
  checkNum: number; // check_num
  createdAt: string; // ISO
}

export interface Profile {
  userId: number;
  nickname: string;
  mbti: string;
  description?: string | null;
  instaProfile?: string | null;
  createdAt: string;
}

export interface Match {
  id: number;
  userId: number;
  targetId: number;
  createdAt: string;
}

export interface Stats {
  id: number; // v2로 LONG PK
  matchCount: number;
}

// ====== USERS ======

// 로그인 (있으면 이름 갱신, 없으면 생성 방식)
export async function login(params: { id: number; name: string }) {
  const { data } = await http.post<User>('/api/users/login', params);
  return data;
}

// 회원가입
export async function signUp(params: {
  id: number;
  name: string;
  gender: string;
}) {
  const { data } = await http.post<User>('/api/users/signup', params);
  return data;
}

// 존재 여부 체크
export async function getIsSignedUser(userId: number) {
  const { data } = await http.get<boolean>(`/api/users/${userId}/exists`);
  return data;
}

// check_num +1
export async function increaseCheckNum(userId: number) {
  await http.post<void>(`/api/users/${userId}/checknum/increase`);
}

// (선택) 유저 단건 조회가 필요하면 이런 것도 있어도 좋아요
export async function getUser(userId: number) {
  const { data } = await http.get<User>(`/api/users/${userId}`);
  return data;
}

// ====== PROFILES ======
// 회원 프로필 생성/수정(백엔드가 upsert 처리하도록 했으면 그대로 사용)
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

// 성별 + 오프셋/리밋 목록
export async function getAllProfile(params: {
  studentGender: string; // 'M' | 'F' 등
  startPage: number; // 기존 프론트 파라미터 호환
  endPage: number;
}) {
  const offset = params.startPage;
  const limit = params.endPage - params.startPage + 1;
  const { data } = await http.get<Profile[]>('/api/profiles', {
    params: { gender: params.studentGender, offset, limit },
  });
  return data;
}

// ====== MATCHES ======
// 매칭 생성 (중복 시 백엔드에서 null 반환/409 등 처리)
export async function matchingUpdate(params: {
  userId: number;
  targetId: number;
}) {
  const { data } = await http.post<Match>('/api/matches', params);
  return data; // 필요 시 null 가능 → 프론트에서 분기
}

// 내가 매칭한 사람 목록 (id들)
export async function getMyMatches(userId: number) {
  const { data } = await http.get<Match[]>('/api/matches/my', {
    params: { userId },
  });
  return data;
}

// 내가 매칭한 상대의 프로필 묶음
export async function getMatchesWithProfile(userId: number) {
  const { data } = await http.get<Profile[]>('/api/matches/my/profiles', {
    params: { userId },
  });
  return data;
}

// ====== STATS ======
// 전체 매칭 카운트(대시보드에서 사용)
export async function getGlobalStats() {
  const { data } = await http.get<Stats>('/api/stats');
  return data;
}

// 유저별 매칭 카운트
export async function getUserStats(userId: number) {
  const { data } = await http.get<Stats>(`/api/stats/${userId}`);
  return data;
}
