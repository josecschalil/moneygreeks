"use client";

import { useState, useEffect } from "react";
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
  if (totalVotes === 0) sentimentText = "Awaiting";
  else if (bullishPercentage >= 60) sentimentText = "Optimistic";
  else if (bullishPercentage <= 40) sentimentText = "Pessimistic";

  return (
    <div className={`w-full ${compact ? "mb-6" : ""}`}>
      <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground-secondary mb-6 border-b border-border pb-2 flex items-center gap-2">
        <Icon name="speed" size={16} /> 
        {compact ? "Sentiment" : "Market Sentiment"}
      </h3>

      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold uppercase tracking-wide mb-2">
          <span className="text-market-negative">Bearish</span>
          <span className="text-market-positive">Bullish</span>
        </div>
        
        {/* Simple minimal meter */}
        <div className="relative w-full h-1 bg-border rounded-full overflow-hidden">
          <div 
            className="absolute top-0 bottom-0 left-0 bg-market-positive transition-all duration-1000 ease-out"
            style={{ width: `${bullishPercentage}%` }}
          />
        </div>
        
        <div className="text-center mt-3 text-sm font-medium text-foreground tracking-wide">
          {loading ? "Loading..." : `${sentimentText} (${bullishPercentage}%)`}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => handleVote("bearish")}
          disabled={hasVoted || loading}
          className={`py-2 px-3 rounded-xl border border-border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-all
            ${hasVoted ? "opacity-40 cursor-not-allowed" : "hover:bg-border text-foreground-secondary hover:text-foreground"}`}
        >
          <Icon name="thumb_down" size={14} /> Bearish
        </button>
        <button
          onClick={() => handleVote("bullish")}
          disabled={hasVoted || loading}
          className={`py-2 px-3 rounded-xl border border-border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-all
            ${hasVoted ? "opacity-40 cursor-not-allowed" : "hover:bg-border text-foreground-secondary hover:text-foreground"}`}
        >
          <Icon name="thumb_up" size={14} /> Bullish
        </button>
      </div>

      <p className="text-[10px] text-center text-foreground-secondary uppercase tracking-widest">
        Based on {totalVotes.toLocaleString()} votes
      </p>
    </div>
  );
}
