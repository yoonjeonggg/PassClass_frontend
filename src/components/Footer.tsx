import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <p>자격증 합격의 지름길, PassClass</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>서비스</h4>
            <Link to="/lectures">강의 목록</Link>
            <Link to="/certificates">자격증</Link>
          </div>
          <div className="footer-col">
            <h4>계정</h4>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© 2025 PassClass. 3학년 1학기 응개 프로젝트.</p>
        </div>
      </div>
    </footer>
  );
}
