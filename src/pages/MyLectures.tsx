import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentApi } from '../api';
import type { EnrollmentResponse } from '../types';
import { useToast } from '../components/Toast';
import './MyLectures.css';

export default function MyLectures() {
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = () => {
    setLoading(true);
    enrollmentApi.getMyEnrollments()
      .then(res => setEnrollments(res.data))
      .catch(() => toast('수강 목록을 불러올 수 없습니다.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleCancel = async (lectureId: number, title: string) => {
    if (!confirm(`"${title}" 수강을 취소하시겠습니까?`)) return;
    try {
      await enrollmentApi.cancel(lectureId);
      toast('수강이 취소되었습니다.', 'info');
      fetchEnrollments();
    } catch (err: any) {
      toast(err.message || '수강 취소 실패', 'error');
    }
  };

  return (
    <div className="my-lectures-page">
      <div className="container">
        <div className="page-header">
          <h1>내 수강 목록</h1>
          <p style={{ color: 'var(--gray-400)', marginTop: 8, fontSize: 15 }}>
            수강 중인 강의를 확인하고 계속 학습하세요
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <div className="spinner" />
          </div>
        ) : enrollments.length > 0 ? (
          <div className="enrollment-list">
            {enrollments.map((e, i) => (
              <div key={e.enrollmentId} className="enrollment-item fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="enrollment-icon">🎓</div>
                <div className="enrollment-info">
                  <h3 className="enrollment-title">{e.lectureTitle}</h3>
                  <div className="enrollment-date">
                    수강 시작: {new Date(e.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <div className="enrollment-actions">
                  <Link to={`/lectures/${e.lectureId}`} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
                    강의 보기
                  </Link>
                  <button
                    className="btn btn-ghost cancel-btn"
                    onClick={() => handleCancel(e.lectureId, e.lectureTitle)}
                    style={{ padding: '10px 20px', fontSize: 14, color: '#EF4444' }}
                  >
                    취소
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <p style={{ fontSize: 16, fontWeight: 600 }}>수강 중인 강의가 없습니다</p>
            <p style={{ fontSize: 14, color: 'var(--gray-400)', marginBottom: 24 }}>
              원하는 강의를 찾아 수강 신청해보세요
            </p>
            <Link to="/lectures" className="btn btn-primary">강의 둘러보기</Link>
          </div>
        )}
      </div>
    </div>
  );
}
