"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ApiError, login, register } from "@/lib/api";
import styles from "@/app/signin/signin.module.css";

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const signup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 6) {
      setError("Укажите корректную почту и пароль не короче 6 символов."); return;
    }
    if (signup && (!username.trim() || password !== confirm)) {
      setError(password !== confirm ? "Пароли не совпадают." : "Укажите имя пользователя."); return;
    }
    setBusy(true);
    try {
      if (signup) {
        await register(email.trim(), password, username.trim());
        router.push("/signin");
      } else {
        const session = await login(email.trim(), password);
        localStorage.setItem("skypro-session", JSON.stringify(session));
        router.push("/");
      }
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Не удалось выполнить запрос.");
    } finally { setBusy(false); }
  }

  return <div className={styles.wrapper}><div className={styles.containerEnter}><div className={styles.modal__block}>
    <form className={styles.modal__form} onSubmit={submit}>
      <Link href="/" className={styles.modal__logo}><Image src="/img/logo_modal.png" alt="Skypro.Music" width={140} height={21} /></Link>
      {signup && <input className={styles.modal__input} name="username" placeholder="Имя пользователя" aria-label="Имя пользователя" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required />}
      <input className={styles.modal__input} type="email" name="email" placeholder="Почта" aria-label="Почта" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input className={styles.modal__input} type="password" name="password" placeholder="Пароль" aria-label="Пароль" autoComplete={signup ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
      {signup && <input className={styles.modal__input} type="password" name="confirmPassword" placeholder="Повторите пароль" aria-label="Повторите пароль" value={confirm} onChange={e => setConfirm(e.target.value)} required />}
      {error && <p role="alert" className={styles.errorContainer}>{error}</p>}
      <button className={styles.modal__btnEnter} type="submit" disabled={busy}>{busy ? "Подождите…" : signup ? "Зарегистрироваться" : "Войти"}</button>
      <Link href={signup ? "/signin" : "/signup"} className={styles.modal__btnSignup}>{signup ? "Войти" : "Зарегистрироваться"}</Link>
    </form>
  </div></div></div>;
}
