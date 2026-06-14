"use client";

import { useEffect, useState } from "react";
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
    setHasVoted(Boolean(localStorage.getItem(`sentiment_voted_${today}`)));
  };

  const handleVote = async (voteType) => {
    if (hasVoted) return;

    if (voteType === "bullish") setBullishVotes((value) => value + 1);
    if (voteType === "bearish") setBearishVotes((value) => value + 1);
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
  const bullishPercentage =
    totalVotes > 0 ? Math.round((bullishVotes / totalVotes) * 100) : 50;
  const sentimentText =
    totalVotes === 0
      ? "Awaiting votes"
      : bullishPercentage >= 60
        ? "Optimistic"
        : bullishPercentage <= 40
          ? "Pessimistic"
          : "Neutral";
  const needlePosition =
    bullishPercentage >= 60 ? "left-2/3" : bullishPercentage <= 40 ? "left-1/3" : "left-1/2";

  return (
    <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
      <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-[var(--mg-text)]">
        <Icon name="speed" />
        {compact ? "Sentiment" : "Market Sentiment"}
      </h3>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-[var(--mg-text-soft)]">
          <span>Bearish</span>
          <span>Bullish</span>
        </div>
        <div className="relative h-3 rounded-full bg-[var(--mg-surface-muted)]">
          <div className="h-full w-1/2 rounded-full bg-[var(--mg-positive)]" />
          <div className={`absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--mg-text)] shadow ${needlePosition}`} />
        </div>
        <div className="mt-3 text-sm font-medium text-[var(--mg-text)]">
          {loading ? "Loading..." : `${sentimentText} (${bullishPercentage}/100)`}
        </div>
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
        <button
          type="button"
          onClick={() => handleVote("bearish")}
          disabled={hasVoted || loading}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--mg-border)] bg-[var(--mg-negative-soft)] px-3 py-2 text-sm font-medium text-[var(--mg-negative)] transition hover:border-[var(--mg-border-strong)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="thumb_down" />
          Bearish
        </button>
        <button
          type="button"
          onClick={() => handleVote("bullish")}
          disabled={hasVoted || loading}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--mg-border)] bg-[var(--mg-positive-soft)] px-3 py-2 text-sm font-medium text-[var(--mg-positive)] transition hover:border-[var(--mg-border-strong)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="thumb_up" />
          Bullish
        </button>
      </div>

      <p className="mt-4 text-xs leading-5 text-[var(--mg-text-soft)]">
        Based on {totalVotes.toLocaleString()} aggregate votes today.
      </p>
    </section>
  );
}
