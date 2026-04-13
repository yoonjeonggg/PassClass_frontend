import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { lectureApi, certificateApi } from "../api";
import type { LectureListDto, CertificateResponse } from "../types";
import LectureCard from "../components/LectureCard";
import "./Home.css";

export default function Home() {
  const [lectures, setLectures] = useState<LectureListDto[]>([]);
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      lectureApi.getList({ page: 0, size: 8, sort: "POPULAR" }),
      certificateApi.getAll(),
    ])
      .then(([lRes, cRes]) => {
        setLectures(lRes.data.content);
        setCertificates(cRes.data.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-tag">자격증 합격의 지름길</div>
          <h1 className="hero-title">
            Pass<span>Class</span>에서
            <br />
            자격증 공부를 시작하세요
          </h1>
          <p className="hero-desc">
            강의와 문제 풀이를 한 곳에서,
            <br />
            체계적으로 학습하세요
          </p>
          <div className="hero-actions">
            <Link
              to="/lectures"
              className="btn btn-primary"
              style={{ padding: "16px 32px", fontSize: "16px" }}
            >
              강의 둘러보기 →
            </Link>
            <Link
              to="/certificates"
              className="btn btn-outline"
              style={{ padding: "16px 32px", fontSize: "16px" }}
            >
              자격증 보기
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>500+</strong>
              <span>강의</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <strong>10만+</strong>
              <span>수강생</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <strong>98%</strong>
              <span>합격률</span>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates */}
      {certificates.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">인기 자격증</h2>
              <Link to="/certificates" className="section-more">
                전체 보기 →
              </Link>
            </div>
            <div className="cert-grid">
              {certificates.map((cert, i) => (
                <Link
                  key={cert.id}
                  to={`/lectures?certificate=${cert.id}`}
                  className="cert-chip"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="cert-icon">📋</span>
                  <span>{cert.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Lectures */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">인기 강의</h2>
            <Link to="/lectures" className="section-more">
              전체 보기 →
            </Link>
          </div>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "60px",
              }}
            >
              <div className="spinner" />
            </div>
          ) : lectures.length > 0 ? (
            <div className="lectures-grid">
              {lectures.map((l, i) => (
                <div
                  key={l.id}
                  className="fade-up"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <LectureCard lecture={l} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>아직 등록된 강의가 없습니다</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <h2>지금 바로 시작하세요</h2>
            <p>무료로 가입하고 다양한 자격증 강의를 경험해보세요</p>
            <Link
              to="/signup"
              className="btn btn-primary"
              style={{ padding: "16px 36px", fontSize: "16px" }}
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
