import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { lectureApi } from '../api';
import type { LectureListDto } from '../types';
import LectureCard from '../components/LectureCard';
import './Lectures.css';

const SORT_OPTIONS = [
  { value: 'LATEST', label: '최신순' },
  { value: 'POPULAR', label: '인기순' },
  { value: 'OLDEST', label: '오래된순' },
];

const CATEGORIES = ['전체', '정보기술', '경영/회계', '어학', '의료/보건', '건축/안전', '기계/전기', '기타'];

export default function Lectures() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lectures, setLectures] = useState<LectureListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState(searchParams.get('sort') || 'LATEST');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const fetchLectures = useCallback(async (p: number, s: string, c: string) => {
    setLoading(true);
    try {
      const res = await lectureApi.getList({
        page: p,
        size: 12,
        sort: s,
        category: c || undefined,
      });
      setLectures(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setLectures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLectures(page, sort, category);
  }, [page, sort, category, fetchLectures]);

  const handleSort = (s: string) => {
    setSort(s);
    setPage(0);
  };

  const handleCategory = (c: string) => {
    setCategory(c === '전체' ? '' : c);
    setPage(0);
  };

  return (
    <div className="lectures-page">
      <div className="container">
        <div className="page-header">
          <h1>강의 목록</h1>
          <p style={{color:'var(--gray-400)',marginTop:8,fontSize:15}}>자격증 합격을 위한 최고의 강의를 만나보세요</p>
        </div>

        {/* Filters */}
        <div className="filters-row">
          <div className="category-tabs">
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`category-tab ${(c === '전체' ? !category : category === c) ? 'active' : ''}`}
                onClick={() => handleCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="sort-select-wrap">
            <select
              className="sort-select"
              value={sort}
              onChange={e => handleSort(e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
          </div>
        ) : lectures.length > 0 ? (
          <>
            <div className="lectures-grid" style={{marginBottom:40}}>
              {lectures.map((l, i) => (
                <div key={l.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <LectureCard lecture={l} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                >
                  ← 이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${page === i ? 'active' : ''}`}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="page-btn"
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                >
                  다음 →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p style={{fontSize:16,fontWeight:600}}>강의가 없습니다</p>
            <p style={{fontSize:14,color:'var(--gray-400)'}}>다른 카테고리를 선택해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
