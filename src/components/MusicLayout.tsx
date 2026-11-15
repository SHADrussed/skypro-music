import type { ReactNode } from "react";
import NavMenu from "@/components/NavMenu/NavMenu";
import Sidebar from "@/components/Sidebar/Sidebar";
import PlayerBar from "@/components/PlayerBar/PlayerBar";
import styles from "@/app/page.module.css";
import type { Selection } from "@/lib/api";
export default function MusicLayout({ children, selections = [] }: { children: ReactNode; selections?: Selection[] }) {
  return <div className={styles.wrapper}><div className={styles.container}><main className={styles.main}><NavMenu />{children}<Sidebar selections={selections} /></main><PlayerBar /><footer /></div></div>;
}
