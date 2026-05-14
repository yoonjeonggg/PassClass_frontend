import type { MyProfileResponse, UserRole } from '../types';

/** 프로필 JSON에서 역할 문자열 후보 추출 (백엔드 키·표기 차이 흡수) */
function pickRoleRaw(user: MyProfileResponse | null | undefined): string | undefined {
  if (!user) return undefined;
  const u = user as unknown as Record<string, unknown>;
  const candidates = [
    user.userRole,
    user.role,
    u.user_role,
    u.role,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim() !== '') return c;
  }
  return undefined;
}

/** 디버그·안내용: 서버가 내려준 역할 원문 (미인식 시 표시) */
export function getProfileRoleRawString(user: MyProfileResponse | null | undefined): string | undefined {
  return pickRoleRaw(user);
}

/**
 * 프로필의 역할을 `ADMIN` | `TEACHER` | `STUDENT` 중 하나로 통일.
 * `ROLE_TEACHER`, `teacher`, 공백 등 흔한 변형을 처리합니다.
 */
export function normalizeUserRole(user: MyProfileResponse | null | undefined): UserRole | null {
  const raw = pickRoleRaw(user);
  if (!raw) return null;
  const s = raw.trim().toUpperCase().replace(/^ROLE_/, '');
  if (s === 'ADMIN' || s === 'TEACHER' || s === 'STUDENT') return s;
  return null;
}

export function isAdmin(user: MyProfileResponse | null | undefined): boolean {
  return normalizeUserRole(user) === 'ADMIN';
}

export function isTeacher(user: MyProfileResponse | null | undefined): boolean {
  return normalizeUserRole(user) === 'TEACHER';
}

/** `/admin`, `/teacher` 라우트 가드용 */
export function canAccessStaffRoute(
  user: MyProfileResponse | null | undefined,
  roles: ('ADMIN' | 'TEACHER')[],
): boolean {
  const r = normalizeUserRole(user);
  if (r !== 'ADMIN' && r !== 'TEACHER') return false;
  return roles.includes(r);
}
