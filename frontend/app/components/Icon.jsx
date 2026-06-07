import styles from "../news-today/MarketInsight.module.css";

export default function Icon({ name, className = "", filled = false }) {
  return (
    <span
      className={`${styles.material} ${filled ? styles.filledIcon : ""} ${className}`}
    >
      {name}
    </span>
  );
}
