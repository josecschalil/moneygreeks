import styles from "../news-today/MarketInsight.module.css";
import Icon from "./Icon";

export default function SectionHeader({ title, viewAll = false }) {
  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {viewAll && (
        <a className={styles.viewAll} href="#">
          View All <Icon name="arrow_forward" />
        </a>
      )}
    </div>
  );
}
