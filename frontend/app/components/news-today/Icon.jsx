import {
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Gauge,
  ThumbsDown,
  ThumbsUp,
  ArrowRight,
  Activity,
  Zap,
  Rss,
  Filter,
  Terminal,
  LineChart,
} from "lucide-react";

export default function Icon({ name, className = "", size = 16 }) {
  const iconMap = {
    trending_up: TrendingUp,
    arrow_upward: ArrowUp,
    arrow_downward: ArrowDown,
    speed: Gauge,
    thumb_down: ThumbsDown,
    thumb_up: ThumbsUp,
    arrow_forward: ArrowRight,
    monitoring: LineChart,
    bolt: Zap,
    feed: Rss,
    filter_list: Filter,
    flash_on: Zap,
    terminal: Terminal,
  };

  const LucideIcon = iconMap[name] || Activity;

  return (
    <LucideIcon 
      size={size} 
      className={`inline-block ${className}`} 
      strokeWidth={2}
    />
  );
}
