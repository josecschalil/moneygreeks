import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Flame,
  Gauge,
  Mail,
  MapPinned,
  MonitorUp,
  Newspaper,
  Search,
  SearchX,
  Sun,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Zap,
} from "lucide-react";

const iconMap = {
  article: Newspaper,
  arrow_downward: ArrowDown,
  arrow_forward: ArrowRight,
  arrow_upward: ArrowUp,
  bolt: Zap,
  check_circle: CheckCircle2,
  dark_mode: Bell,
  feed: Newspaper,
  filter_list: Filter,
  flash_on: Flame,
  light_mode: Sun,
  location_city: MapPinned,
  mail: Mail,
  monitoring: BarChart3,
  north_east: ArrowUpRight,
  open_in_new: ArrowUpRight,
  schedule: Clock,
  search: Search,
  search_off: SearchX,
  speed: Gauge,
  terminal: Terminal,
  thumb_down: ThumbsDown,
  thumb_up: ThumbsUp,
  trending_up: TrendingUp,
};

export default function Icon({ name, className = "", filled = false, ...props }) {
  const Component = iconMap[name] || MonitorUp;

  return (
    <Component
      className={`inline-block h-4 w-4 shrink-0 ${filled ? "fill-current" : ""} ${className}`}
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    />
  );
}
