import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lectureApi, enrollmentApi, chapterApi } from "../api";
import type { LectureDetailResponse, ChapterWatchResponse } from "../types";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import "./LectureDetail.css";

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

  useEffect(() => {
    if (!lectureId) return;

    lectureApi
      .getDetail(Number(lectureId))
      .then((res) => setLecture(res.data))
      .catch(() => toast("강의를 불러올 수 없습니다.", "error"))
      .finally(() => setLoading(false));
  }, [lectureId]);

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

  if (loading)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "120px" }}
      >
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

  // ⭐ null-safe 값 처리
  const rating = (lecture.rating ?? 0).toFixed(1);
  const studentCount = (lecture.studentCount ?? 0).toLocaleString();
  const likeCount = (lecture.likeCount ?? 0).toLocaleString();

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
              <span>❤️ {likeCount}</span>
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
                  <div style={{ fontSize: 12, color: "var(--gray-400)" }}>
                    강사
                  </div>
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
                  src={watchData.videoUrl}
                  title={watchData.title}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>

              {!watchData.completed && (
                <button
                  className="btn btn-primary"
                  onClick={handleComplete}
                  style={{ marginTop: 12 }}
                >
                  ✓ 시청 완료 처리
                </button>
              )}
            </div>
          )}

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
                      <div
                        className="spinner"
                        style={{ width: 16, height: 16, borderWidth: 2 }}
                      />
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
        </div>

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
                  <span
                    className="spinner"
                    style={{ width: 18, height: 18, borderWidth: 2 }}
                  />
                ) : enrolled ? (
                  "✓ 수강 중"
                ) : (
                  "수강 신청하기"
                )}
              </button>

              {!user && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--gray-400)",
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  로그인 후 수강 신청 가능합니다
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
