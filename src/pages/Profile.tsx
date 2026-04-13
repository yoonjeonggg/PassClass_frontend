import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api';
import { useToast } from '../components/Toast';
import './Profile.css';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nickname: user?.nickname || '', profileImage: user?.profileImage || '' });
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userApi.patchMyProfile({ nickname: form.nickname, profileImage: form.profileImage || undefined });
      await refreshUser();
      toast('프로필이 수정되었습니다.', 'success');
      setEditing(false);
    } catch (err: any) {
      toast(err.message || '수정 실패', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>내 프로필</h1>
        </div>

        <div className="profile-card fade-up">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {user.profileImage
                ? <img src={user.profileImage} alt="" />
                : <span>{user.nickname[0]}</span>
              }
            </div>
          </div>

          {editing ? (
            <form className="profile-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>닉네임</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.nickname}
                  onChange={e => setForm(p => ({ ...p, nickname: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>프로필 이미지 URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={form.profileImage}
                  onChange={e => setForm(p => ({ ...p, profileImage: e.target.value }))}
                />
              </div>
              <div className="profile-form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? '저장 중...' : '저장'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>
                  취소
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="profile-field">
                <span className="profile-label">닉네임</span>
                <span className="profile-value">{user.nickname}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">이메일</span>
                <span className="profile-value">{user.email}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">계정 ID</span>
                <span className="profile-value">#{user.id}</span>
              </div>
              <button className="btn btn-outline" onClick={() => { setForm({ nickname: user.nickname, profileImage: user.profileImage || '' }); setEditing(true); }}>
                ✏️ 프로필 수정
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
