"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./NavMenu.module.css";
import { useState } from "react";

export default function NavMenu() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Image
          width={250}
          height={170}
          className={styles.logo__image}
          src="/img/logo.png"
          alt={"logo"}
        />
      </div>
      <div
        onClick={() => setIsOpenMenu(!isOpenMenu)}
        className={styles.nav__burger}
      >
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>
      {isOpenMenu && (
        <div className={styles.nav__menu}>
          <ul className={styles.menu__list}>
            <li className={styles.menu__item}>
              <Link href="/" className={styles.menu__link}>
                Главное
              </Link>
            </li>
            <li className={styles.menu__item}>
              <Link href="/favourites" className={styles.menu__link}>
                Мои треки
              </Link>
            </li>
            <li className={styles.menu__item}>
              <Link href="/signin" className={styles.menu__link}>
                Войти
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
