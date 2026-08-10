"use client"

import NavMenu from "./NavMenu";
import { useEffect } from "react";
import AOS from '@/public/aos/aos.js';
import styles from './MainLayout.module.css';
import BackToTop from "./BackToTop";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {

  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }
  }, []);

  return (
    <>
      <NavMenu />
      <main className={`${styles.main} d-flex flex-column min-vh-100`}>

        {/* Header spacer */}
        <div className={styles.headerSpacer}></div>

        {children}
      </main>

      <BackToTop />
    </>
  );
}
