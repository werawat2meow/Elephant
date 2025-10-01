"use client";
import { useEffect } from "react";

export default function AutoTranslateLoader() {
  useEffect(() => {
    if ((window as any).__gtLoaded) return;
    (window as any).__gtLoaded = true;

    (window as any).googleTranslateElementInit = () => {
      // eslint-disable-next-line no-new
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "auto", includedLanguages: "th,en", autoDisplay: false },
        "google_translate_element"
      );
      // ล้าง banner/offset ที่ Google ใส่
      const hide = () => {
        const b1 = document.querySelector<HTMLIFrameElement>("iframe.goog-te-banner-frame");
        const w1 = document.querySelector<HTMLElement>(".skiptranslate");
        if (b1) b1.style.display = "none";
        if (w1) w1.style.display = "none";
        document.documentElement.style.marginTop = "0px";
        document.body.style.top = "0px";
        document.body.style.position = "static";
      };
      hide();
      setTimeout(hide, 100);  // กันเคสที่ Google ปรับซ้ำ
      window.addEventListener("resize", hide);
    };

    const s = document.createElement("script");
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
    return () => {
      s.remove();
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return <div id="google_translate_element" />;
}
