import React from 'react';
import { Link } from 'react-router-dom';
import type { LectureListDto } from '../types';
import './LectureCard.css';

interface Props {
  lecture: LectureListDto;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#FFC107' : '#E0E0E0' }}>★</span>
      ))}
      <span className="rating-num">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function LectureCard({ lecture }: Props) {
  return (
    <Link to={`/lectures/${lecture.id}`} className="lecture-card card">
      <div className="lecture-thumb">
        {lecture.thumbnailUrl
          ? <img src={lecture.thumbnailUrl} alt={lecture.title} />
          : <div className="thumb-placeholder">🎓</div>
        }
        {lecture.category && (
          <span className="thumb-category">{lecture.category}</span>
        )}
      </div>
      <div className="lecture-info">
        {lecture.certificate && (
          <span className="badge badge-orange" style={{marginBottom:'8px',fontSize:'11px'}}>
            {lecture.certificate.name}
          </span>
        )}
        <h3 className="lecture-title">{lecture.title}</h3>
        <div className="lecture-meta">
          <StarRating rating={lecture.rating || 0} />
        </div>
      </div>
    </Link>
  );
}
