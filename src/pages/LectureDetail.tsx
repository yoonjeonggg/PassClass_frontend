import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lectureApi, enrollmentApi, chapterApi, likeApi, reviewApi } from "../api";
import type {
  LectureDetailResponse,
  ChapterWatchResponse,
  ReviewResponse,
  ReviewSummaryResponse,
} from "../types";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import "./LectureDetail.css";

function getEmbedUrl(url: string): string {
  if (!url) return url;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return url;
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-input">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`star ${s <= (hover || value) ? "filled" : ""}`}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{ cursor: onChange ? "pointer" : "default" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function LectureDetail() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [lecture, setLecture] = useState<LectureDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [watchData, setWatchData] = useState<ChapterWatchResponse | null>(null);
  const [watchLoading, setWatchLoading] = useState(false);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);

  // Like
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  // Review
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummaryResponse | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, content: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!lectureId) return;
    const id = Number(lectureId);

    const promises: Promise<any>[] = [
      lectureApi.getDetail(id),
      reviewApi.getList(id),
      reviewApi.getSummary(id),
    ];

    if (user) {
      promises.push(enrollmentApi.getMyEnrollments());
    }

    Promise.all(promises)
      .then(([lRes, reviewRes, summaryRes, enrollRes]) => {
        const l = lRes.data;
        setLecture(l);
        setIsLiked(l.isLiked ?? false);
        setLikeCount(l.likeCount ?? 0);
        setReviews(reviewRes.data);
        setReviewSummary(summaryRes.data);
        if (enrollRes) {
          const alreadyEnrolled = enrollRes.data.some(
            (e: any) => e.lectureId === id
          );
          setEnrolled(alreadyEnrolled);
        }
      })
      .catch(() => toast("강의를 불러올 수 없습니다.", "error"))
      .finally(() => setLoading(false));
  }, [lectureId, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setEnrolling(true);
    try {
      await enrollmentApi.enroll(Number(lectureId));
      setEnrolled(true);
      toast("수강 신청 완료!", "success");
    } catch (err: any) {
      toast(err.message || "수강 신청 실패", "error");
    } finally {
      setEnrolling(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (liking) return;
    setLiking(true);
    try {
      const res = await likeApi.toggle(Number(lectureId));
      const liked = res.data.isLiked;
      setIsLiked(liked);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
      toast(liked ? "찜 목록에 추가했습니다." : "찜을 취소했습니다.", "info");
    } catch (err: any) {
      toast(err.message || "오류가 발생했습니다.", "error");
    } finally {
      setLiking(false);
    }
  };

  const handleWatchChapter = async (chapterId: number) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setWatchLoading(true);
    setActiveChapter(chapterId);
    try {
      const res = await chapterApi.watch(chapterId);
      setWatchData(res.data);
    } catch (err: any) {
      toast(err.message || "수강 신청 후 이용 가능합니다.", "error");
      setActiveChapter(null);
    } finally {
      setWatchLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!watchData) return;
    try {
      await chapterApi.complete(watchData.id);
      toast("챕터 완료!", "success");
      setWatchData((prev) => (prev ? { ...prev, completed: true } : null));
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      toast("별점을 선택해주세요.", "error");
      return;
    }
    if (!reviewForm.content.trim()) {
      toast("리뷰 내용을 입력해주세요.", "error");
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewApi.create({
        lectureId: Number(lectureId),
        rating: reviewForm.rating,
        content: reviewForm.content,
      });
      toast("리뷰가 등록되었습니다.", "success");
      setReviewForm({ rating: 0, content: "" });
      setShowReviewForm(false);
      // Refresh reviews
      const [reviewRes, summaryRes] = await Promise.all([
        reviewApi.getList(Number(lectureId)),
        reviewApi.getSummary(Number(lectureId)),
      ]);
      setReviews(reviewRes.data);
      setReviewSummary(summaryRes.data);
    } catch (err: any) {
      toast(err.message || "리뷰 등록 실패", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "120px" }}>
        <div className="spinner" />
      </div>
    );

  if (!lecture)
    return (
      <div className="empty-state" style={{ marginTop: 80 }}>
        <div className="empty-state-icon">😕</div>
        <p>강의를 찾을 수 없습니다</p>
      </div>
    );

  const rating = (lecture.rating ?? 0).toFixed(1);
  const studentCount = (lecture.studentCount ?? 0).toLocaleString();

  return (
    <div className="lecture-detail-page">
      <div className="detail-hero">
        <div className="container detail-hero-inner">
          <div className="detail-hero-info">
            <div className="detail-breadcrumb">
              {lecture.certificate && (
                <span className="badge badge-orange" style={{ fontSize: 12 }}>
                  📋 {lecture.certificate.name}
                </span>
              )}
              {lecture.category && (
                <span className="badge badge-gray" style={{ fontSize: 12 }}>
                  {lecture.category}
                </span>
              )}
            </div>

            <h1 className="detail-title">{lecture.title}</h1>

            {lecture.description && (
              <p className="detail-desc">{lecture.description}</p>
            )}

            <div className="detail-stats">
              <span>⭐ {rating}</span>
              <span>·</span>
              <span>👤 수강생 {studentCount}명</span>
              <span>·</span>
              <span>❤️ {likeCount.toLocaleString()}</span>
              <span>·</span>
              <span>📹 {lecture.chapterCount}개 챕터</span>
            </div>

            {lecture.instructor && (
              <div className="detail-instructor">
                <div className="instructor-avatar">
                  {lecture.instructor.profileImage ? (
                    <img src={lecture.instructor.profileImage} alt="" />
                  ) : (
                    <span>{lecture.instructor.nickname[0]}</span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)" }}>강사</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {lecture.instructor.nickname}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="detail-hero-thumb">
            {lecture.thumbnailUrl ? (
              <img src={lecture.thumbnailUrl} alt={lecture.title} />
            ) : (
              <div className="thumb-placeholder-large">🎓</div>
            )}
          </div>
        </div>
      </div>

      <div className="container detail-body">
        <div className="detail-main">
          {watchData && (
            <div className="video-player-section fade-up">
              <div className="video-header">
                <h3>{watchData.title}</h3>
                {watchData.completed && (
                  <span className="badge badge-orange">✓ 완료</span>
                )}
              </div>
              <div className="video-embed">
                <iframe
                  src={getEmbedUrl(watchData.videoUrl)}
                  title={watchData.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {!watchData.completed && (
                <button
                  className="btn btn-primary"
                  onClick={handleComplete}
                  style={{ margin: "12px 20px" }}
                >
                  ✓ 시청 완료 처리
                </button>
              )}
            </div>
          )}

          {/* 강의 목차 */}
          <div className="chapters-section">
            <h2 className="section-heading">강의 목차</h2>
            {lecture.chapters?.length > 0 ? (
              <div className="chapters-list">
                {lecture.chapters.map((ch, i) => (
                  <div
                    key={ch.id}
                    className={`chapter-item ${activeChapter === ch.id ? "active" : ""}`}
                    onClick={() => handleWatchChapter(ch.id)}
                  >
                    <div className="chapter-num">{i + 1}</div>
                    <div className="chapter-title">{ch.title}</div>
                    {watchLoading && activeChapter === ch.id ? (
                      <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    ) : (
                      <span className="chapter-play">▶</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--gray-400)", fontSize: 14 }}>
                아직 등록된 챕터가 없습니다.
              </p>
            )}
          </div>

          {/* 리뷰 섹션 */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h2 className="section-heading">수강생 리뷰</h2>
              {reviewSummary && reviewSummary.reviewCount > 0 && (
                <div className="review-summary">
                  <span className="review-avg">{reviewSummary.averageRating.toFixed(1)}</span>
                  <StarRating value={Math.round(reviewSummary.averageRating)} />
                  <span style={{ fontSize: 13, color: "var(--gray-400)" }}>
                    ({reviewSummary.reviewCount}개 리뷰)
                  </span>
                </div>
              )}
            </div>

            {user && enrolled && !showReviewForm && (
              <button
                className="btn btn-outline"
                style={{ alignSelf: "flex-start" }}
                onClick={() => setShowReviewForm(true)}
              >
                ✏️ 리뷰 작성
              </button>
            )}

            {showReviewForm && (
              <form className="review-form" onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label>별점</label>
                  <StarRating
                    value={reviewForm.rating}
                    onChange={(v) => setReviewForm((p) => ({ ...p, rating: v }))}
                  />
                </div>
                <div className="form-group">
                  <label>리뷰 내용</label>
                  <textarea
                    className="form-input review-textarea"
                    placeholder="강의에 대한 솔직한 리뷰를 작성해주세요."
                    value={reviewForm.content}
                    onChange={(e) =>
                      setReviewForm((p) => ({ ...p, content: e.target.value }))
                    }
                    rows={4}
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submittingReview}
                  >
                    {submittingReview ? "등록 중..." : "리뷰 등록"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowReviewForm(false)}
                  >
                    취소
                  </button>
                </div>
              </form>
            )}

            {reviews.length > 0 ? (
              <div className="review-list">
                {reviews.map((r) => (
                  <div key={r.reviewId} className="review-item">
                    <div className="review-top">
                      <div className="review-author">
                        <div className="review-avatar">
                          {r.profileUrl ? (
                            <img src={r.profileUrl} alt="" />
                          ) : (
                            <span>{r.nickname[0]}</span>
                          )}
                        </div>
                        <div>
                          <div className="review-nickname">{r.nickname}</div>
                          <div className="review-date">
                            {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                          </div>
                        </div>
                      </div>
                      <StarRating value={Math.round(r.rating)} />
                    </div>
                    <p className="review-content">{r.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="review-empty">
                <span>아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</span>
              </div>
            )}
          </div>
        </div>

        {/* 사이드바 */}
        <div className="detail-sidebar">
          <div className="enroll-card">
            <div className="enroll-card-thumb">
              {lecture.thumbnailUrl ? (
                <img src={lecture.thumbnailUrl} alt="" />
              ) : (
                <div className="thumb-placeholder-large">🎓</div>
              )}
            </div>
            <div className="enroll-card-body">
              <div className="enroll-stats">
                <div className="enroll-stat">
                  <strong>{lecture.chapterCount}</strong>
                  <span>챕터</span>
                </div>
                <div className="enroll-stat">
                  <strong>{studentCount}</strong>
                  <span>수강생</span>
                </div>
                <div className="enroll-stat">
                  <strong>{rating}</strong>
                  <span>평점</span>
                </div>
              </div>

              <button
                className={`btn ${enrolled ? "btn-ghost" : "btn-primary"} enroll-btn`}
                onClick={handleEnroll}
                disabled={enrolling || enrolled}
              >
                {enrolling ? (
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                ) : enrolled ? (
                  "✓ 수강 중"
                ) : (
                  "수강 신청하기"
                )}
              </button>

              <button
                className={`btn like-btn ${isLiked ? "like-btn-active" : "btn-ghost"}`}
                onClick={handleLike}
                disabled={liking}
              >
                {isLiked ? "❤️ 찜 취소" : "🤍 찜하기"}
                <span className="like-count">{likeCount.toLocaleString()}</span>
              </button>

              {!user && (
                <p style={{ fontSize: 12, color: "var(--gray-400)", textAlign: "center" }}>
                  로그인 후 이용 가능합니다
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
