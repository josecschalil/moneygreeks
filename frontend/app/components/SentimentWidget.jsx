"use client";

import { useState, useEffect } from "react";
import styles from "../news-today/MarketInsight.module.css";
import Icon from "./Icon";

export default function SentimentWidget({ compact = false }) {
  const [bullishVotes, setBullishVotes] = useState(0);
  const [bearishVotes, setBearishVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSentiment();
    checkIfVotedToday();
  }, []);

  const fetchSentiment = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/sentiment/today/");
      if (res.ok) {
        const data = await res.json();
        setBullishVotes(data.bullish_votes || 0);
        setBearishVotes(data.bearish_votes || 0);
      }
    } catch (err) {
      console.error("Failed to fetch sentiment:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfVotedToday = () => {
    const today = new Date().toISOString().split("T")[0];
    const voted = localStorage.getItem(`sentiment_voted_${today}`);
    if (voted) {
      setHasVoted(true);
    }
  };

  const handleVote = async (voteType) => {
    if (hasVoted) return;

    // Optimistic update
    if (voteType === "bullish") setBullishVotes((v) => v + 1);
    if (voteType === "bearish") setBearishVotes((v) => v + 1);
    setHasVoted(true);

    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(`sentiment_voted_${today}`, "true");

    try {
      const res = await fetch("http://127.0.0.1:8000/sentiment/vote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: voteType }),
      });
      if (res.ok) {
        const data = await res.json();
        setBullishVotes(data.bullish_votes);
        setBearishVotes(data.bearish_votes);
      }
    } catch (err) {
      console.error("Failed to submit vote:", err);
    }
  };

  const totalVotes = bullishVotes + bearishVotes;
  let bullishPercentage = 50;
  if (totalVotes > 0) {
    bullishPercentage = Math.round((bullishVotes / totalVotes) * 100);
  }

  let sentimentText = "Neutral";
  if (totalVotes === 0) sentimentText = "Awaiting Votes";
  else if (bullishPercentage >= 60) sentimentText = "Optimistic";
  else if (bullishPercentage <= 40) sentimentText = "Pessimistic";

  return (
    <div
      className={`${styles.card} ${compact ? `${styles.compactPanel} ${styles.compactSentiment}` : styles.widget}`}
    >
      <h3 className={compact ? styles.panelTitleSmall : styles.widgetTitle}>
        <Icon name="speed" /> {compact ? "Sentiment" : "Market Sentiment"}
      </h3>

      <div>
        <div className={styles.sentimentLabels}>
          <span className={styles.down}>Bearish</span>
          <span className={styles.up}>Bullish</span>
        </div>
        <div className={styles.meter}>
          <div className={styles.meterFill} />
          <div
            className={styles.needle}
            style={{
              left: `${bullishPercentage}%`,
              transition: "left 0.5s ease",
            }}
          />
        </div>
        <div className={styles.sentimentValue}>
          {loading
            ? "Loading..."
            : `${sentimentText} (${bullishPercentage}/100)`}
        </div>
      </div>

      <div className={styles.voteGrid}>
        <button
          onClick={() => handleVote("bearish")}
          disabled={hasVoted || loading}
          className={`${styles.voteButton} ${compact ? styles.voteCompact : ""} ${styles.bearishButton} ${hasVoted ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Icon name="thumb_down" /> Vote Bearish
        </button>
        <button
          onClick={() => handleVote("bullish")}
          disabled={hasVoted || loading}
          className={`${styles.voteButton} ${compact ? styles.voteCompact : ""} ${styles.bullishButton} ${hasVoted ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Icon name="thumb_up" /> Vote Bullish
        </button>
      </div>

      {compact ? (
        <p className={styles.voteCount}>
          Based on {totalVotes.toLocaleString()} votes today
        </p>
      ) : (
        <p className={styles.widgetFoot}>
          Based on {totalVotes.toLocaleString()} aggregate votes today.
        </p>
      )}
    </div>
  );
}
