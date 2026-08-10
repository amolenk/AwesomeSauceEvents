"use client";

import { useState, useEffect } from "react";
import styles from "./NavMenu.module.css";

export default function NavMenu() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`${styles.header} d-flex align-items-center justify-content-center ${isScrolled ? styles.headerScrolled : ''}`}
    >
      <div className={styles.logo}>
        <img src="/img/logo.png" alt="Awesome Sauce Events" title="Awesome Sauce Events" />
      </div>
    </header>
  );
}
