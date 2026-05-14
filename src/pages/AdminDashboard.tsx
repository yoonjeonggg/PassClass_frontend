import React, { useEffect, useState } from 'react';
import { certificateApi } from '../api';
import type { CertificateResponse } from '../types';
import { useToast } from '../components/Toast';
import StaffProblemsMockSection from './StaffProblemsMockSection';
import './StaffDashboard.css';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [list, setList] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [editRow, setEditRow] = useState<CertificateResponse | null>(null);

  const load = () => {
    certificateApi.getAll()
      .then(r => setList(r.data))
      .catch(() => toast('자격증 목록을 불러오지 못했습니다.', 'error'));
  };

  useEffect(() => {
    setLoading(true);
    certificateApi.getAll()
      .then(r => setList(r.data))
      .catch(() => toast('자격증 목록을 불러오지 못했습니다.', 'error'))
      .finally(() => setLoading(false));
  }, [toast]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast('자격증 이름을 입력하세요.', 'error');
      return;
    }
    setSaving(true);
    try {
      await certificateApi.create({ name: form.name.trim(), description: form.description.trim() });
      toast('자격증이 등록되었습니다.', 'success');
      setForm({ name: '', description: '' });
      load();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : '등록 실패', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRow) return;
    setSaving(true);
    try {
      await certificateApi.update(editRow.id, {
        name: editRow.name.trim(),
        description: editRow.description?.trim() ?? '',
      });
      toast('수정되었습니다.', 'success');
      setEditRow(null);
      load();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : '수정 실패', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('이 자격증을 삭제할까요?')) return;
    try {
      await certificateApi.delete(id);
      toast('삭제되었습니다.', 'success');
      load();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : '삭제 실패', 'error');
    }
  };

  return (
    <div className="staff-page">
      <div className="staff-hero">
        <div className="container">
          <h1 className="staff-hero-title">관리자</h1>
          <p className="staff-hero-sub">자격증을 관리하고, 문제와 모의고사를 구성합니다.</p>
        </div>
      </div>

      <div className="container staff-body">
        <section className="staff-panel">
          <h2 className="staff-panel-title">자격증 등록 · 수정 · 삭제</h2>
          <p className="staff-panel-desc">사이트에 노출될 자격증 정보를 관리합니다.</p>

          <form onSubmit={handleCreate}>
            <div className="staff-form-grid">
              <div className="staff-field">
                <label>이름</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="예: 정보처리기사"
                  required
                />
              </div>
              <div className="staff-field">
                <label>설명</label>
                <input
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="한 줄 설명"
                />
              </div>
            </div>
            <div className="staff-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? '처리 중…' : '자격증 등록'}
              </button>
            </div>
          </form>

          <h3 className="staff-subtitle" style={{ marginTop: 28 }}>등록된 자격증</h3>
          {loading ? (
            <div className="loading-center" style={{ padding: 40 }}><div className="spinner" /></div>
          ) : (
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>이름</th>
                    <th>설명</th>
                    <th style={{ width: 160 }}>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 ? (
                    <tr><td colSpan={4} className="cell-muted">등록된 자격증이 없습니다.</td></tr>
                  ) : (
                    list.map(c => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td className="cell-muted">{c.description || '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button type="button" className="staff-btn-sm staff-btn-muted" onClick={() => setEditRow(c)}>수정</button>
                            <button type="button" className="staff-btn-sm staff-btn-danger" onClick={() => handleDelete(c.id)}>삭제</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <StaffProblemsMockSection />
      </div>

      {editRow && (
        <div className="staff-modal-backdrop" role="presentation" onClick={() => setEditRow(null)}>
          <div className="staff-modal" role="dialog" aria-modal onClick={e => e.stopPropagation()}>
            <h3>자격증 수정</h3>
            <form onSubmit={handleUpdate}>
              <div className="staff-field">
                <label>이름</label>
                <input
                  value={editRow.name}
                  onChange={e => setEditRow(r => r && { ...r, name: e.target.value })}
                  required
                />
              </div>
              <div className="staff-field">
                <label>설명</label>
                <textarea
                  value={editRow.description || ''}
                  onChange={e => setEditRow(r => r && { ...r, description: e.target.value })}
                />
              </div>
              <div className="staff-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditRow(null)}>취소</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
