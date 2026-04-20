import { api } from './client';
import type {
  ApiResponse,
  SignupRequest, SignupResponse,
  LoginRequest, TokenResponse, AutoLoginRequest,
  MyProfileResponse, ProfileResponse, PatchMyProfileRequest,
  CertificateRequest, CertificateResponse,
  LectureRequest, LectureCreateResponse, LectureDetailResponse, PageLectureListDto,
  LectureChapterRequest, LectureChapterResponse, ChapterWatchResponse,
  EnrollmentResponse,
  ReviewRequest, ReviewResponse, ReviewSummaryResponse,
  LikeResponse,
  NotificationResponse, UnreadCountResponse, PageResponse,
} from '../types';

// Auth
export const authApi = {
  signup: (data: SignupRequest) =>
    api.post<ApiResponse<SignupResponse>>('/api/auth/signup', data),
  login: (data: LoginRequest) =>
    api.post<ApiResponse<TokenResponse>>('/api/auth/login', data),
  logout: () => api.post<ApiResponse<void>>('/api/auth/log-out'),
  autoLogin: (data: AutoLoginRequest) =>
    api.post<ApiResponse<TokenResponse>>('/api/auth/auto-login', data),
};

// User
export const userApi = {
  getMyProfile: () => api.get<ApiResponse<MyProfileResponse>>('/api/user/profile/me'),
  patchMyProfile: (data: PatchMyProfileRequest) =>
    api.patch<ApiResponse<MyProfileResponse>>('/api/user/profile/me', data),
  getProfile: (userId: number) =>
    api.get<ApiResponse<ProfileResponse>>(`/api/user/profile/${userId}`),
};

// Certificate
export const certificateApi = {
  getAll: () => api.get<ApiResponse<CertificateResponse[]>>('/api/certificates'),
  search: (keyword: string) =>
    api.get<ApiResponse<CertificateResponse[]>>(`/api/certificates/search?keyword=${encodeURIComponent(keyword)}`),
  create: (data: CertificateRequest) =>
    api.post<ApiResponse<CertificateResponse>>('/api/certificates', data),
  update: (id: number, data: CertificateRequest) =>
    api.put<ApiResponse<CertificateResponse>>(`/api/certificates/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/api/certificates/${id}`),
};

// Lecture
export const lectureApi = {
  getList: (params: { page?: number; size?: number; category?: string; sort?: string }) => {
    const q = new URLSearchParams();
    if (params.page !== undefined) q.set('page', String(params.page));
    if (params.size !== undefined) q.set('size', String(params.size));
    if (params.category) q.set('category', params.category);
    if (params.sort) q.set('sort', params.sort);
    return api.get<ApiResponse<PageLectureListDto>>(`/api/lecture?${q}`);
  },
  getDetail: (lectureId: number) =>
    api.get<ApiResponse<LectureDetailResponse>>(`/api/lecture/${lectureId}`),
  create: (data: LectureRequest) =>
    api.post<ApiResponse<LectureCreateResponse>>('/api/lecture', data),
};

// LectureChapter
export const chapterApi = {
  getChapters: (lectureId: number) =>
    api.get<ApiResponse<LectureChapterResponse[]>>(`/api/lecture/chapters?lectureId=${lectureId}`),
  create: (data: LectureChapterRequest) =>
    api.post<ApiResponse<LectureChapterResponse>>('/api/lecture/chapters', data),
  update: (chapterId: number, data: LectureChapterRequest) =>
    api.put<ApiResponse<LectureChapterResponse>>(`/api/lecture/chapters/${chapterId}`, data),
  delete: (chapterId: number) =>
    api.delete<ApiResponse<void>>(`/api/lecture/chapters/${chapterId}`),
  watch: (chapterId: number) =>
    api.get<ApiResponse<ChapterWatchResponse>>(`/api/lecture/chapters/${chapterId}/watch`),
  complete: (chapterId: number) =>
    api.post<ApiResponse<void>>(`/api/lecture/chapters/${chapterId}/complete`),
};

// Enrollment
export const enrollmentApi = {
  enroll: (lectureId: number) =>
    api.post<ApiResponse<EnrollmentResponse>>(`/api/enrollment/${lectureId}`),
  cancel: (lectureId: number) =>
    api.delete<ApiResponse<void>>(`/api/enrollment/${lectureId}`),
  getMyEnrollments: () =>
    api.get<ApiResponse<EnrollmentResponse[]>>('/api/enrollment/me'),
};

// Review
export const reviewApi = {
  create: (data: ReviewRequest) =>
    api.post<ApiResponse<void>>('/api/reviews', data),
  update: (reviewId: number, data: ReviewRequest) =>
    api.put<ApiResponse<void>>(`/api/reviews/${reviewId}`, data),
  getSummary: (lectureId: number) =>
    api.get<ApiResponse<ReviewSummaryResponse>>(`/api/reviews/summary?lectureId=${lectureId}`),
  getList: (lectureId: number) =>
    api.get<ApiResponse<ReviewResponse[]>>(`/api/reviews?lectureId=${lectureId}`),
};

// Like
export const likeApi = {
  toggle: (lectureId: number) =>
    api.post<ApiResponse<LikeResponse>>(`/api/lectures/${lectureId}/like`),
};

// Notification
export const notificationApi = {
  getList: (page = 0, size = 10) =>
    api.get<ApiResponse<PageResponse<NotificationResponse>>>(`/api/notifications?page=${page}&size=${size}`),
  markAsRead: (notificationId: number) =>
    api.patch<ApiResponse<void>>(`/api/notifications/${notificationId}/read`),
  getUnreadCount: () =>
    api.get<ApiResponse<UnreadCountResponse>>('/api/notifications/unread-count'),
};
