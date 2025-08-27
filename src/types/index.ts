// 공용 타입 정의

// User 엔티티 (users 테이블)
export interface User {
  id: number;
  name: string;
  gender: string;
  check_num: number;
  created_at?: string; // ISO Timestamp
}

// Profile 엔티티 (profiles 테이블)
export interface Profile {
  user_id: number;
  nickname: string;
  mbti: string;
  description: string;
  insta_profile: string;
  created_at?: string;
}

// Match 엔티티 (matches 테이블)
export interface Match {
  id: number;
  user_id: number;
  target_id: number;
  created_at?: string;
}

// Stats 엔티티 (stats 테이블)
export interface Stats {
  id: number;
  match_count: number;
}

//Metrics 관련
export type SummaryDto = {
  totalUsers: number; // 기본 기대
  total_users?: number; // 혹시 snake_case면 여기로 들어옴
};
