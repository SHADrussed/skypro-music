import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import styles from "./signin.module.css";

export default function Signin() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <div className={styles.modal__form}>
            <Link href="/" className={styles.modal__logo}>
              <Image
                src="/img/logo_modal.png"
                alt="Skypro.Music"
                width={140}
                height={21}
              />
            </Link>
            <input
              className={cn(styles.modal__input, styles.login)}
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
              autoComplete="current-password"
            />
            <button className={styles.modal__btnEnter} type="button">
              Войти
            </button>
            <Link href="/signup" className={styles.modal__btnSignup}>
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
