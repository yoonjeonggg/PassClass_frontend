import React, { useEffect, useState } from 'react';
import { certificateApi } from '../api';
import type { CertificateResponse } from '../types';
import { useToast } from '../components/Toast';
import './Certificates.css';

export default function Certificates() {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    certificateApi.getAll()
      .then(res => setCertificates(res.data))
      .catch(() => toast('자격증 목록을 불러올 수 없습니다.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setSearching(true);
    try {
      const res = await certificateApi.search(keyword.trim());
      setCertificates(res.data);
    } catch {
      toast('검색 실패', 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleReset = async () => {
    setKeyword('');
    setLoading(true);
    try {
      const res = await certificateApi.getAll();
      setCertificates(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="certs-page">
      <div className="container">
        <div className="page-header">
          <h1>자격증 목록</h1>
          <p style={{ color: 'var(--gray-400)', marginTop: 8, fontSize: 15 }}>
            목표 자격증을 찾고 맞춤 강의를 수강하세요
          </p>
        </div>

        {/* Search */}
        <form className="cert-search" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-input"
            placeholder="자격증 검색 (예: 정보처리기사)"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={searching}>
            {searching ? '검색 중...' : '🔍 검색'}
          </button>
          {keyword && (
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              초기화
            </button>
          )}
        </form>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <div className="spinner" />
          </div>
        ) : certificates.length > 0 ? (
          <div className="cert-cards fade-up">
            {certificates.map((cert, i) => (
              <div key={cert.id} className="cert-card card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="cert-card-icon">📋</div>
                <div className="cert-card-body">
                  <h3 className="cert-card-name">{cert.name}</h3>
                  {cert.description && (
                    <p className="cert-card-desc">{cert.description}</p>
                  )}
                  <div className="cert-card-date">
                    등록일: {new Date(cert.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p style={{ fontSize: 16, fontWeight: 600 }}>검색 결과가 없습니다</p>
            <p style={{ fontSize: 14, color: 'var(--gray-400)' }}>다른 키워드로 검색해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
