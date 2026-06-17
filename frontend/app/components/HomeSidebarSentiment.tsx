"use client";

import { useState, useEffect } from "react";
import styles from "./HomeSidebarSentiment.module.css";

export default function HomeSidebarSentiment() {
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sentiment/today/`,
      );

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

  const handleVote = async (voteType: "bullish" | "bearish") => {
    if (hasVoted) return;

    if (voteType === "bullish") {
      setBullishVotes((v) => v + 1);
    } else {
      setBearishVotes((v) => v + 1);
    }

    setHasVoted(true);

    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(`sentiment_voted_${today}`, "true");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sentiment/vote/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vote: voteType,
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();

        setBullishVotes(data.bullish_votes || 0);
        setBearishVotes(data.bearish_votes || 0);
      }
    } catch (err) {
      console.error("Failed to submit vote:", err);
    }
  };

  const totalVotes = bullishVotes + bearishVotes;

  const bullishPercentage =
    totalVotes > 0 ? Math.round((bullishVotes / totalVotes) * 100) : 50;

  let sentimentText = "Neutral";

  if (totalVotes === 0) {
    sentimentText = "Awaiting Votes";
  } else if (bullishPercentage >= 60) {
    sentimentText = "Bullish";
  } else if (bullishPercentage <= 40) {
    sentimentText = "Bearish";
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>MARKET SENTIMENT</div>

      <div className={styles.sentimentHeader}>
        <span className={styles.sentimentBear}>Bearish</span>
        <span className={styles.sentimentBull}>Bullish</span>
      </div>

      <div className={styles.sentimentBar}>
        <div
          className={styles.sentimentFill}
          style={{
            width: `${bullishPercentage}%`,
          }}
        />
      </div>

      <div className={styles.sentimentScore}>
        <span>{bullishPercentage}% Bullish</span>
        <span>{totalVotes.toLocaleString()} votes</span>
      </div>

      <div className={styles.sentimentStatus}>
        {loading ? "Loading..." : sentimentText}
      </div>

      <div className={styles.sentimentActions}>
        <button
          onClick={() => handleVote("bearish")}
          disabled={hasVoted || loading}
          className={styles.sentimentSellBtn}
        >
          Bearish
        </button>

        <button
          onClick={() => handleVote("bullish")}
          disabled={hasVoted || loading}
          className={styles.sentimentBuyBtn}
        >
          Bullish
        </button>
      </div>

      {hasVoted && (
        <div className={styles.voteMessage}>✓ Thanks for voting today</div>
      )}
    </div>
  );
}
