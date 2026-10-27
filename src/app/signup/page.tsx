import Image from "next/image";
import Link from "next/link";
import styles from "./signup.module.css";

export default function Signup() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <div className={styles.modal__form}>
            <Link href="/" className={styles.modal__logo}>
              <Image src="/img/logo_modal.png" alt="Skypro.Music" width={140} height={21} />
            </Link>
            <input
              className={styles.modal__input}
              type="email"
              name="email"
              placeholder="Почта"
              aria-label="Почта"
              autoComplete="email"
            />
            <input
              className={styles.modal__input}
              type="password"
              name="password"
              placeholder="Пароль"
              aria-label="Пароль"
              autoComplete="new-password"
            />
            <input
              className={styles.modal__input}
              type="password"
              name="confirmPassword"
              placeholder="Повторите пароль"
              aria-label="Повторите пароль"
              autoComplete="new-password"
            />
            <button className={styles.modal__btnSignupEnt} type="button">
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
