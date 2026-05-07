import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi, fileApi } from '../api';
import { useToast } from '../components/Toast';
import './Profile.css';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nickname: user?.nickname || '', profileImage: user?.profileImage || '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!user) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setUploading(true);

    try {
      const res = await fileApi.upload(file);
      setForm(p => ({ ...p, profileImage: res.data.fileUrl }));
      toast('이미지가 업로드되었습니다.', 'success');
    } catch (err: any) {
      toast(err.message || '업로드 실패', 'error');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userApi.patchMyProfile({ nickname: form.nickname, profileImage: form.profileImage || undefined });
      await refreshUser();
      toast('프로필이 수정되었습니다.', 'success');
      setEditing(false);
      setPreviewUrl(null);
    } catch (err: any) {
      toast(err.message || '수정 실패', 'error');
    } finally {
      setSaving(false);
    }
  };

  const currentImage = previewUrl || (editing ? form.profileImage : user.profileImage);

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>내 프로필</h1>
        </div>

        <div className="profile-card fade-up">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {currentImage
                ? <img src={currentImage} alt="" />
                : <span>{user.nickname[0]}</span>
              }
            </div>
            {editing && (
              <div className="avatar-upload-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  className="btn btn-ghost avatar-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? '업로드 중...' : '📷 사진 변경'}
                </button>
              </div>
            )}
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
              <div className="profile-form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                  {saving ? '저장 중...' : '저장'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setEditing(false);
                    setPreviewUrl(null);
                    setForm({ nickname: user.nickname, profileImage: user.profileImage || '' });
                  }}
                >
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
              <button
                className="btn btn-outline"
                onClick={() => {
                  setForm({ nickname: user.nickname, profileImage: user.profileImage || '' });
                  setEditing(true);
                }}
              >
                ✏️ 프로필 수정
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
