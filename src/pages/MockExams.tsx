import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { certificateApi, mockExamApi } from '../api';
import type { CertificateResponse, MockExamListItem } from '../types';
import { IconClipboard, IconArrowRight, IconCheck } from '../components/Icons';
import './MockExams.css';

export default function MockExams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [mockExams, setMockExams]       = useState<MockExamListItem[]>([]);
  const [certLoading, setCertLoading]   = useState(true);
  const [examLoading, setExamLoading]   = useState(false);

  const [selectedCertId, setSelectedCertId] = useState<number | null>(
    searchParams.get('certificateId') ? Number(searchParams.get('certificateId')) : null
  );

  useEffect(() => {
    certificateApi.getAll()
      .then(res => setCertificates(res.data))
      .finally(() => setCertLoading(false));
  }, []);

  const fetchExams = useCallback((certId: number) => {
    setExamLoading(true);
    mockExamApi.getList(certId)
      .then(res => setMockExams(res.data))
      .catch(() => setMockExams([]))
      .finally(() => setExamLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCertId) fetchExams(selectedCertId);
    else setMockExams([]);
  }, [selectedCertId, fetchExams]);

  const handleSelectCert = (id: number) => {
    setSelectedCertId(id);
    setSearchParams({ certificateId: String(id) });
  };

  const selectedCert = certificates.find(c => c.id === selectedCertId);

  return (
    <div className="mock-page">
      <div className="mock-hero">
        <div className="container">
          <h1 className="mock-hero-title">모의고사</h1>
          <p className="mock-hero-sub">실전처럼 문제를 풀고 점수를 확인하세요</p>
        </div>
      </div>

      <div className="container mock-body">
        {/* 자격증 선택 사이드바 */}
        <aside className="mock-sidebar">
          <div className="sidebar-label">자격증 선택</div>
          {certLoading ? (
            <div className="loading-center" style={{ padding: '24px 0' }}><div className="spinner" /></div>
          ) : (
            <div className="mock-cert-list">
              {certificates.map(cert => (
                <button
                  key={cert.id}
                  className={`mock-cert-btn ${selectedCertId === cert.id ? 'active' : ''}`}
                  onClick={() => handleSelectCert(cert.id)}
                >
                  {cert.name}
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* 모의고사 목록 */}
        <div className="mock-main">
          {!selectedCertId ? (
            <div className="mock-placeholder">
              <div className="mock-placeholder-icon"><IconClipboard size={36} /></div>
              <p className="mock-placeholder-title">자격증을 선택하세요</p>
              <p className="mock-placeholder-sub">왼쪽에서 자격증을 선택하면 모의고사가 표시됩니다</p>
            </div>
          ) : examLoading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : mockExams.length === 0 ? (
            <div className="mock-placeholder">
              <div className="mock-placeholder-icon"><IconClipboard size={36} /></div>
              <p className="mock-placeholder-title">등록된 모의고사가 없습니다</p>
              <p className="mock-placeholder-sub">아직 이 자격증의 모의고사가 없습니다</p>
            </div>
          ) : (
            <>
              <div className="mock-toolbar">
                <span className="mock-cert-name">{selectedCert?.name}</span>
                <span className="mock-count">총 {mockExams.length}개</span>
              </div>
              <div className="mock-list">
                {mockExams.map((exam, idx) => (
                  <Link
                    key={exam.id}
                    to={`/mock-exams/${exam.id}`}
                    className={`mock-card fade-up ${exam.completed ? 'completed' : ''}`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="mock-card-left">
                      <div className={`mock-card-num ${exam.completed ? 'done' : ''}`}>
                        {exam.completed ? <IconCheck size={16} /> : idx + 1}
                      </div>
                      <div>
                        <p className="mock-card-title">{exam.title}</p>
                        <p className="mock-card-sub">{selectedCert?.name}</p>
                      </div>
                    </div>
                    <div className="mock-card-right">
                      {exam.completed && exam.score !== null && (
                        <span className={`mock-score-badge ${exam.score >= 60 ? 'pass' : 'fail'}`}>
                          {exam.score}점 {exam.score >= 60 ? '합격' : '불합격'}
                        </span>
                      )}
                      <div className="mock-card-action">
                        {exam.completed ? '다시 풀기' : '응시하기'} <IconArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
