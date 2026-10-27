import NavMenu from "@/components/NavMenu/NavMenu";
import CenterBlock from "@/components/CenterBlock/CenterBlock";
import Sidebar from "@/components/Sidebar/Sidebar";
import PlayerBar from "@/components/PlayerBar/PlayerBar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <NavMenu />
          <CenterBlock />
          <Sidebar />
        </main>
        <PlayerBar />
        <footer />
      </div>
    </div>
  );
}
