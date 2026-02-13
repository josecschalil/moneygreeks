"use client";

import { useState } from "react";

export default function UnderDevelopment() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');

        .ud-wrap {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 72px 24px;
          font-family: 'Instrument Sans', sans-serif;
          background: #ffffff;
        }

        .ud-card {
          width: 100%;
          max-width: 560px;
          text-align: center;
        }

        /* Badge */
        .ud-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f5f2ef;
          border: 1px solid #e8e4de;
          border-radius: 100px;
          padding: 7px 16px;
          margin-bottom: 32px;
        }

        .ud-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #0f0f0f;
          flex-shrink: 0;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(0.8); }
        }

        .ud-badge-text {
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a4540;
        }

        /* Heading */
        .ud-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(34px, 5vw, 50px);
          font-weight: 700;
          color: #0f0f0f;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 18px;
        }

        .ud-heading em {
          font-style: italic;
          font-weight: 600;
          color: #4a4540;
        }

        .ud-subtext {
          font-size: 15.5px;
          font-weight: 400;
          color: #7a7570;
          line-height: 1.72;
          max-width: 440px;
          margin: 0 auto 40px;
        }

        /* Progress */
        .ud-progress-wrap {
          margin-bottom: 40px;
        }

        .ud-progress-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .ud-progress-label {
          font-size: 12px;
          font-weight: 500;
          color: #a09890;
          letter-spacing: 0.04em;
        }

        .ud-progress-pct {
          font-size: 12px;
          font-weight: 600;
          color: #0f0f0f;
        }

        .ud-progress-track {
          width: 100%;
          height: 4px;
          background: #f0ece6;
          border-radius: 100px;
          overflow: hidden;
        }

        .ud-progress-fill {
          height: 100%;
          background: #0f0f0f;
          border-radius: 100px;
          animation: fillIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes fillIn {
          from { width: 0%; }
          to   { width: 68%; }
        }

        /* Milestones */
        .ud-milestones {
          display: flex;
          justify-content: center;
          gap: 28px;
          margin-top: 16px;
          flex-wrap: wrap;
        }

        .ud-milestone {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12.5px;
          font-weight: 500;
          color: #b0a89e;
        }

        .ud-milestone.done { color: #0f0f0f; }

        .ud-milestone-icon {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          border: 1.5px solid #d4cfc8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ud-milestone.done .ud-milestone-icon {
          background: #0f0f0f;
          border-color: #0f0f0f;
        }

        /* Divider */
        .ud-divider {
          width: 40px;
          height: 1px;
          background: #e8e4de;
          margin: 0 auto 36px;
        }

        /* Form */
        .ud-form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #7a7570;
          margin-bottom: 14px;
          letter-spacing: 0.02em;
        }

        .ud-form {
          display: flex;
          gap: 10px;
          max-width: 400px;
          margin: 0 auto;
        }

        .ud-input {
          flex: 1;
          padding: 12px 16px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14.5px;
          color: #0f0f0f;
          background: #ffffff;
          border: 1.5px solid #e0dbd4;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.18s ease;
        }

        .ud-input::placeholder { color: #b8b2aa; }
        .ud-input:focus { border-color: #0f0f0f; }

        .ud-form-btn {
          padding: 12px 20px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          background: #0f0f0f;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: 0.01em;
          transition: background 0.18s ease, transform 0.15s ease;
        }

        .ud-form-btn:hover {
          background: #1f1f1f;
          transform: translateY(-1px);
        }

        /* Success */
        .ud-success {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: #f5f2ef;
          border: 1px solid #e0dbd4;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          color: #3a3530;
          animation: fadeUp 0.3s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .ud-form { flex-direction: column; }
        }
      `}</style>

      <div className="ud-wrap">
        <div className="ud-card">
          {/* Badge */}
          <div className="ud-badge">
            <span className="ud-badge-dot" />
            <span className="ud-badge-text">In Development</span>
          </div>

          {/* Heading */}
          <h1 className="ud-heading">
            Something <em>great</em>
            <br />
            is on its way
          </h1>

          <p className="ud-subtext">
            We're building this page to bring you sharper market insights and
            smarter financial tools. Check back soon — it'll be worth the wait.
          </p>

          {/* Progress */}
          <div className="ud-progress-wrap">
            <div className="ud-progress-labels">
              <span className="ud-progress-label">Build Progress</span>
              <span className="ud-progress-pct">68%</span>
            </div>
            <div className="ud-progress-track">
              <div className="ud-progress-fill" />
            </div>
            <div className="ud-milestones">
              {[
                { label: "Design", done: true },
                { label: "Development", done: true },
                { label: "Testing", done: false },
                { label: "Launch", done: false },
              ].map(({ label, done }) => (
                <div
                  key={label}
                  className={`ud-milestone${done ? " done" : ""}`}
                >
                  <div className="ud-milestone-icon">
                    {done && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5L4.2 7.5L8 3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="ud-divider" />

          {/* Email notify */}
          <span className="ud-form-label">Notify me when it's ready</span>

          {submitted ? (
            <div className="ud-success">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8L6.5 11.5L13 4.5"
                  stroke="#0f0f0f"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              You're on the list — we'll let you know!
            </div>
          ) : (
            <form className="ud-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="ud-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="ud-form-btn">
                Notify Me
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
