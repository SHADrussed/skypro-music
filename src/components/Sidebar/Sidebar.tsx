import Image from "next/image";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import type { Selection } from "@/lib/api";

export default function Sidebar({ selections }: { selections: Selection[] }) {
  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <p className={styles.sidebar__personalName}>Sergey.Ivanov</p>
        <div className={styles.sidebar__icon}>
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>
      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href={`/selection/${selections.find(s => s._id === 2)?._id ?? 2}`}>
              <Image
                src="/img/playlist01.png"
                loading="eager"
                alt="day's playlist"
                width={250}
                height={150}
                sizes="250px"
                style={{ width: "100%", height: "auto" }}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href={`/selection/${selections.find(s => s._id === 3)?._id ?? 3}`}>
              <Image
                src="/img/playlist02.png"
                alt="day's playlist"
                width={250}
                height={150}
                sizes="250px"
                style={{ width: "100%", height: "auto" }}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href={`/selection/${selections.find(s => s._id === 4)?._id ?? 4}`}>
              <Image
                src="/img/playlist03.png"
                alt="day's playlist"
                width={250}
                height={150}
                sizes="250px"
                style={{ width: "100%", height: "auto" }}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
