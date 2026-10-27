"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import BookingCalendar from "../../components/BookingCalendar";
import BookingForm from "../../components/BookingForm";
import Button from "../../components/Button";
import { useLanguage } from "../../contexts/LanguageContext";

import { validateBooking } from "../../lib/booking-validation";

interface Package {
  id: number;
  name: string;
  duration: string;
  price: { adult: number; child: number };
  badge: string;
  times: string[];
  activities: string[];
}

export default function BookingPage({ requestAvailable = false }: { requestAvailable?: boolean }) {
  const { currentLang } = useLanguage();
  // Hydration-safe: always start at step 1 and packageId null, then update client-side
  const [step, setStep] = useState(1);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const requestId = useRef("");
  const sending = useRef(false);
  const [restored, setRestored] = useState(false);
  const [paymentView, setPaymentView] = useState({ checking: false, notificationPending: false, error: "" });
  const [requestSent, setRequestSent] = useState(false);
  const [bookingData, setBookingData] = useState({
    packageId: null as number | null,
    date: null as string | null,
    timeSlot: null as string | null,
    times: [] as string[], // Added times property
    adults: 1,
    children: 0,
    infants: 0,
    totalPrice: 0,
    contactInfo: null as any,
    paymentMethod: "card" as "card",
    paymentStatus: "unpaid" as "unpaid" | "paid",
    paymentReference: "",
    paymentConfirmed: false,
    cardDetails: {
      name: "",
      number: "",
      expiry: "",
      cvc: "",
    },
  });

  const isPaymentValid = bookingData.paymentConfirmed;

  // Move an open tab off the removed unpaid-request screen after a code refresh.
  useEffect(() => { if (step === 5) setStep(4); }, [step]);

  // Restore only a local draft, never a payment or confirmation status.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('jasmine-original-booking-draft') || 'null');
      if (saved?.data && [1, 2, 3, 4, 5].includes(saved.data.packageId)) {
        setBookingData(prev => ({ ...prev, ...saved.data, paymentConfirmed: false, paymentStatus: 'unpaid', cardDetails: { name: '', number: '', expiry: '', cvc: '' } }));
        if (Number.isInteger(saved.step)) setStep(Math.min(4, Math.max(1, saved.step)));
      }
      if (typeof saved?.requestId === 'string' && /^[a-f\d-]{36}$/i.test(saved.requestId)) requestId.current = saved.requestId;
    } catch { /* Keep the form usable when browser storage is disabled. */ }
    const paymentKey = new URLSearchParams(window.location.hash.slice(1)).get('booking_key');
    if (paymentKey && /^[a-f\d-]{36}$/i.test(paymentKey)) {
      requestId.current = paymentKey;
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    if (!requestId.current) requestId.current = crypto.randomUUID();
    const id = Number(new URLSearchParams(window.location.search).get('packageId'));
    if ([1, 2, 3, 4, 5].includes(id)) {
      setBookingData(prev => ({ ...prev, packageId: id }));
      setStep(2);
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      if (step === 6) return;
      else {
        const { cardDetails, paymentStatus, paymentReference, paymentConfirmed, ...data } = bookingData;
        sessionStorage.setItem('jasmine-original-booking-draft', JSON.stringify({ data, step, requestId: requestId.current }));
      }
    } catch { /* Draft stays in React state if session storage is unavailable. */ }
  }, [bookingData, step, restored]);



  // Sync times to bookingData when packageId changes
  useEffect(() => {
    if (bookingData.packageId) {
      const selected = packages.find((p) => p.id === bookingData.packageId);
      if (
        selected &&
        JSON.stringify(bookingData.times) !== JSON.stringify(selected.times)
      ) {
        setBookingData((prev) => ({ ...prev, times: selected.times }));
      }
    }
  }, [bookingData.packageId]);

  const content = {
    th: {
      title: "จองทัวร์ได้เลย",
      subtitle: "จองประสบการณ์ช้างธรรมชาติที่น่าจดจำ",
      steps: [
        "เลือกโปรแกรม",
        "เลือกวันและเวลา",
        "ข้อมูลผู้เข้าร่วม",
        "ตรวจสอบข้อมูล",
        "ส่งคำขอ",
        "สถานะการจอง",
      ],
      selectPackage: "เลือกโปรแกรมทัวร์",
      selectDateTime: "เลือกวันที่และเวลา",
      guestInfo: "ข้อมูลผู้เข้าร่วม",
      confirmation: "ตรวจสอบข้อมูล",
      payment: "ส่งคำขอ",
      invoice: "รอยืนยัน",
    },
    en: {
      title: "Book Now",
      subtitle: "Reserve your unforgettable ethical elephant experience",
      steps: [
        "Select Package",
        "Choose Date & Time",
        "Guest Information",
        "Confirm Booking",
        "Request",
        "Booking status",
      ],
      selectPackage: "Select Tour Package",
      selectDateTime: "Choose Date & Time",
      guestInfo: "Guest Information",
      confirmation: "Confirm Booking",
      payment: "Request",
      invoice: "Await confirmation",
    },
    de: {
      title: "Jetzt buchen",
      subtitle:
        "Reservieren Sie Ihr unvergessliches ethisches Elefantenerlebnis",
      steps: [
        "Paket auswählen",
        "Datum & Zeit wählen",
        "Gästeinformationen",
        "Buchung bestätigen",
        "Anfrage senden",
        "Bestätigung abwarten",
      ],
      selectPackage: "Tourpaket auswählen",
      selectDateTime: "Datum und Zeit wählen",
      guestInfo: "Gästeinformationen",
      confirmation: "Buchung bestätigen",
      payment: "Anfrage senden",
      invoice: "Bestätigung abwarten",
    },
    cn: {
      title: "立即预订",
      subtitle: "预订您难忘的道德大象体验",
      steps: [
        "选择套餐",
        "选择日期和时间",
        "客人信息",
        "确认预订",
        "提交申请",
        "等待确认",
      ],
      selectPackage: "选择旅游套餐",
      selectDateTime: "选择日期和时间",
      guestInfo: "客人信息",
      confirmation: "确认预订",
      payment: "提交申请",
      invoice: "等待确认",
    },
    fr: {
      title: "Réservez maintenant",
      subtitle:
        "Réservez votre expérience éthique inoubliable avec les éléphants",
      steps: [
        "Sélectionner le forfait",
        "Choisir date et heure",
        "Informations invités",
        "Confirmer la réservation",
        "Envoyer la demande",
        "Attendre la confirmation",
      ],
      selectPackage: "Sélectionner le forfait touristique",
      selectDateTime: "Choisir la date et l'heure",
      guestInfo: "Informations des invités",
      confirmation: "Confirmer la réservation",
      payment: "Envoyer la demande",
      invoice: "Attendre la confirmation",
    },
  };

  const currentContent =
    content[currentLang as keyof typeof content] || content.en;

  const getPackageName = (id: number) => {
    const names = {
      1: {
        th: "ช้างธรรมชาติ",
        en: "Elephant Nature",
        de: "Elefanten Natur",
        cn: "大象自然",
        fr: "Nature des Éléphants",
      },
      2: {
        th: "เดินเล่น ป้อนอาหาร",
        en: "Walk & Feed",
        de: "Spazieren & Füttern",
        cn: "散步喂食",
        fr: "Marcher et Nourrir",
      },
      3: {
        th: "มินิช้างธรรมชาติ",
        en: "Mini Elephant Nature",
        de: "Mini Elefanten Natur",
        cn: "迷你大象自然",
        fr: "Mini Nature Éléphants",
      },
      4: {
        th: "คลาสทำอาหารไทย & ป้อนกล้วย",
        en: "Traditional Thai Cooking Class & Feed Me Bananas",
        de: "Traditioneller Thai-Kochkurs & Bananen füttern",
        cn: "传统泰式烹饪课和喂香蕉",
        fr: "Cours de cuisine thaïe traditionnelle & Donne-moi des bananes",
      },
      5: {
        th: "คลาสทำอาหารไทยพิเศษ & สำรวจช้าง",
        en: "Exclusive Thai Cooking Class & Exploring Elephants",
        de: "Exklusiver Thai-Kochkurs & Elefanten erkunden",
        cn: "独家泰式烹饪课和探索大象",
        fr: "Cours de cuisine thaïe exclusif & Exploration des éléphants",
      },
    };
    return (
      names[id as keyof typeof names][currentLang as keyof (typeof names)[1]] ||
      names[id as keyof typeof names]["en"]
    );
  };

  const getPackageBadge = (id: number) => {
    const badges = {
      1: {
        th: "เหมาะกับครอบครัว",
        en: "Family Friendly",
        de: "Familienfreundlich",
        cn: "适合家庭",
        fr: "Adapté aux familles",
      },
      2: {
        th: "ได้รับความนิยมสูงสุด",
        en: "Most Popular",
        de: "Sehr beliebt",
        cn: "最受欢迎",
        fr: "Très populaire",
      },
      3: {
        th: "ตัวเลือกที่เป็นมิตร",
        en: "Budget Friendly",
        de: "Budgetfreundlich",
        cn: "经济实惠",
        fr: "Économique",
      },
      4: {
        th: "ทำอาหารไทย + ป้อนช้าง",
        en: "Thai Cooking + Feed Elephants",
        de: "Thai-Kochkurs + Elefanten füttern",
        cn: "泰式烹饪+喂大象",
        fr: "Cuisine thaïe + Nourrir les éléphants",
      },
      5: {
        th: "ทำอาหารไทย + สำรวจช้าง",
        en: "Thai Cooking + Explore Elephants",
        de: "Thai-Kochkurs + Elefanten erkunden",
        cn: "泰式烹饪+探索大象",
        fr: "Cuisine thaïe + Explorer les éléphants",
      },
    };
    return (
      badges[id as keyof typeof badges][
        currentLang as keyof (typeof badges)[1]
      ] || badges[id as keyof typeof badges]["en"]
    );
  };

  const getPackageActivities = (id: number) => {
    const activities = {
      1: {
        th: [
          "ป้อนอาหารช้าง",
          "ถ่ายภาพกับช้าง",
          "เรียนรู้พฤติกรรม",
          "สาธิตทำอาหารไทย",
          "สาธิตกะทิ",
          "อาหารกลางวัน",
        ],
        en: [
          "Feed elephants",
          "Photo with elephants",
          "Learn behaviors",
          "Thai cooking demo",
          "Coconut milk demo",
          "Lunch included",
        ],
        de: [
          "Elefanten füttern",
          "Fotos mit Elefanten",
          "Verhalten lernen",
          "Thai-Koch-Demo",
          "Kokosmilch-Demo",
          "Mittagessen inklusive",
        ],
        cn: [
          "喂大象",
          "与大象合影",
          "学习行为",
          "泰式烹饪演示",
          "椰浆演示",
          "包含午餐",
        ],
        fr: [
          "Nourrir les éléphants",
          "Photos avec éléphants",
          "Apprendre comportements",
          "Démo cuisine thaï",
          "Démo lait de coco",
          "Déjeuner inclus",
        ],
      },
      2: {
        th: [
          "ป้อนอาหารช้าง",
          "ถ่ายภาพกับช้าง",
          "เรียนรู้พฤติกรรม",
          "เตรียมอาหารช้าง",
        ],
        en: [
          "Feed elephants",
          "Photo with elephants",
          "Learn behaviors",
          "Prepare elephant meal",
        ],
        de: [
          "Elefanten füttern",
          "Fotos mit Elefanten",
          "Verhalten lernen",
          "Elefantenfutter zubereiten",
        ],
        cn: ["喂大象", "与大象合影", "学习行为", "准备大象食物"],
        fr: [
          "Nourrir les éléphants",
          "Photos avec éléphants",
          "Apprendre comportements",
          "Préparer repas éléphant",
        ],
      },
      3: {
        th: [
          "ป้อนอาหารช้าง",
          "ถ่ายภาพกับช้าง",
          "เรียนรู้พฤติกรรม",
          "สาธิตยางพารา",
        ],
        en: [
          "Feed elephants",
          "Photo with elephants",
          "Learn behaviors",
          "Rubber demonstration",
        ],
        de: [
          "Elefanten füttern",
          "Fotos mit Elefanten",
          "Verhalten lernen",
          "Kautschuk-Demonstration",
        ],
        cn: ["喂大象", "与大象合影", "学习行为", "橡胶演示"],
        fr: [
          "Nourrir les éléphants",
          "Photos avec éléphants",
          "Apprendre comportements",
          "Démonstration caoutchouc",
        ],
      },
    };
    return (
      activities[id as keyof typeof activities][
        currentLang as keyof (typeof activities)[1]
      ] || activities[id as keyof typeof activities]["en"]
    );
  };

  const packages = [
    {
      id: 1,
      name: getPackageName(1),
      duration: "3 hours",
      price: { adult: 2700, child: 1500 },
      badge: getPackageBadge(1),
      times: ["9:00 AM", "2:00 PM"],
      activities: getPackageActivities(1),
    },
    {
      id: 2,
      name: getPackageName(2),
      duration: "1.5 hours",
      price: { adult: 1600, child: 1000 },
      badge: getPackageBadge(2),
      times: ["9:00 AM", "11:00 AM", "2:00 PM"],
      activities: getPackageActivities(2),
    },
    {
      id: 3,
      name: getPackageName(3),
      duration: "1.5 hours",
      price: { adult: 1400, child: 800 },
      badge: getPackageBadge(3),
      times: ["9:00 AM", "11:00 AM", "2:00 PM"],
      activities: getPackageActivities(3),
    },
    {
      id: 4,
      name:
        currentLang === "th"
          ? "คลาสทำอาหารไทย & ป้อนกล้วย"
          : currentLang === "en"
          ? "Traditional Thai Cooking Class & Feed Me Bananas"
          : currentLang === "de"
          ? "Traditioneller Thai-Kochkurs & Bananen füttern"
          : currentLang === "cn"
          ? "传统泰式烹饪课和喂香蕉"
          : "Cours de cuisine thaïe traditionnelle & Donne-moi des bananes",
      duration:
        currentLang === "th" ? "3.30 - 4.30 ชั่วโมง" : "3.30 - 4.30 hrs.",
      price: { adult: 2750, child: 1550 },
      badge:
        currentLang === "th"
          ? "ทำอาหารไทย + ป้อนช้าง"
          : currentLang === "en"
          ? "Thai Cooking + Feed Elephants"
          : currentLang === "de"
          ? "Thai-Kochkurs + Elefanten füttern"
          : currentLang === "cn"
          ? "泰式烹饪+喂大象"
          : "Cuisine thaïe + Nourrir les éléphants",
      times: ["9:00 AM", "2:00 PM"],
      activities:
        currentLang === "th"
          ? [
              "เครื่องดื่มต้อนรับชาไทย/กาแฟ",
              "ป้อนกล้วยหรือแตงโมให้ช้าง",
              "เรียนทำอาหารไทยกับครูผู้เชี่ยวชาญ",
              "เมนู: ต้มยำกุ้ง, แกงเขียวหวาน, ผัดไทย",
              "รับประทานอาหารกลางวันท่ามกลางธรรมชาติ",
            ]
          : currentLang === "en"
          ? [
              "Welcoming drink with Thai tea & coffee",
              "Feed bananas or watermelon to elephants",
              "Learn Thai cooking with expert teacher",
              "Menu: Tom Yum Kung, Green Curry, Pad Thai",
              "Enjoy lunch in beautiful scenery",
            ]
          : currentLang === "de"
          ? [
              "Begrüßungsgetränk mit Thai-Tee/Kaffee",
              "Füttern Sie Elefanten mit Bananen oder Wassermelone",
              "Lernen Sie thailändisches Kochen mit Experten",
              "Menü: Tom Yum Kung, Grünes Curry, Pad Thai",
              "Genießen Sie das Mittagessen in schöner Umgebung",
            ]
          : currentLang === "cn"
          ? [
              "泰茶/咖啡迎宾饮品",
              "给大象喂香蕉或西瓜",
              "与专家学习泰式烹饪",
              "菜单：冬阴功、青咖喱、泰式炒河粉",
              "在美丽风景中享用午餐",
            ]
          : [
              "Boisson de bienvenue avec thé thaï/café",
              "Nourrir les éléphants avec bananes ou pastèque",
              "Apprendre la cuisine thaïe avec un expert",
              "Menu : Tom Yum Kung, Curry vert, Pad Thaï",
              "Déjeuner dans un cadre magnifique",
            ],
    },
    {
      id: 5,
      name:
        currentLang === "th"
          ? "คลาสทำอาหารไทยพิเศษ & สำรวจช้าง"
          : currentLang === "en"
          ? "Exclusive Thai Cooking Class & Exploring Elephants"
          : currentLang === "de"
          ? "Exklusiver Thai-Kochkurs & Elefanten erkunden"
          : currentLang === "cn"
          ? "独家泰式烹饪课和探索大象"
          : "Cours de cuisine thaïe exclusif & Exploration des éléphants",
      duration:
        currentLang === "th" ? "5.00 - 6.00 ชั่วโมง" : "5.00 - 6.00 hours",
      price: { adult: 3350, child: 1850 },
      badge:
        currentLang === "th"
          ? "ทำอาหารไทย + สำรวจช้าง"
          : currentLang === "en"
          ? "Thai Cooking + Explore Elephants"
          : currentLang === "de"
          ? "Thai-Kochkurs + Elefanten erkunden"
          : currentLang === "cn"
          ? "泰式烹饪+探索大象"
          : "Cuisine thaïe + Explorer les éléphants",
      times: ["9:00 AM"],
      activities:
        currentLang === "th"
          ? [
              "เครื่องดื่มต้อนรับชาไทย/กาแฟ",
              "ป้อนกล้วยให้ช้าง",
              "เรียนรู้การทำอาหารและวัฒนธรรมไทยกับครูผู้เชี่ยวชาญ",
              "เมนู: ต้มยำกุ้ง, แกงเขียวหวาน, ผัดไทย",
              "สังเกตพฤติกรรมช้าง",
              "รับประทานอาหารกลางวันท่ามกลางธรรมชาติ",
            ]
          : currentLang === "en"
          ? [
              "Welcoming drink with Thai tea & coffee",
              "Feed bananas to elephants",
              "Explore Thai cooking and culture with expert teacher",
              "Menu: Tom Yum Kung, Green Curry, Pad Thai",
              "Observe elephant behaviors",
              "Enjoy lunch in beautiful scenery",
            ]
          : currentLang === "de"
          ? [
              "Begrüßungsgetränk mit Thai-Tee/Kaffee",
              "Füttern Sie Elefanten mit Bananen",
              "Entdecken Sie thailändische Küche und Kultur mit Experten",
              "Menü: Tom Yum Kung, Grünes Curry, Pad Thai",
              "Beobachten Sie das Verhalten der Elefanten",
              "Genießen Sie das Mittagessen in schöner Umgebung",
            ]
          : currentLang === "cn"
          ? [
              "泰茶/咖啡迎宾饮品",
              "给大象喂香蕉",
              "与专家探索泰式烹饪和文化",
              "菜单：冬阴功、青咖喱、泰式炒河粉",
              "观察大象行为",
              "在美丽风景中享用午餐",
            ]
          : [
              "Boisson de bienvenue avec thé thaï/café",
              "Nourrir les éléphants avec bananes",
              "Explorer la cuisine et la culture thaïe avec un expert",
              "Menu : Tom Yum Kung, Curry vert, Pad Thaï",
              "Observer le comportement des éléphants",
              "Déjeuner dans un cadre magnifique",
            ],
    },
  ];

  const buildBookingPayload = () => {
    return {
      packageName: getPackageName(bookingData.packageId!),
      date: bookingData.date,
      time: bookingData.timeSlot,
      adults: bookingData.adults,
      children: bookingData.children,
      infants: bookingData.infants,
      totalPrice: bookingData.totalPrice,
      name: bookingData.contactInfo?.name || "",
      email: bookingData.contactInfo?.email || "",
      phone: bookingData.contactInfo?.phone || "",
      hotel: bookingData.contactInfo?.hotel || "",
      roomNumber: bookingData.contactInfo?.roomNumber || "",
      whatsapp: bookingData.contactInfo?.whatsapp || "",
      transferOption: bookingData.contactInfo?.transferOption || "",
      specialRequests: bookingData.contactInfo?.specialRequests || "",
      paymentReference: bookingData.paymentReference || "",
    };
  };

  const requestPayload = (acknowledged = bookingData.paymentConfirmed) => ({
    ...buildBookingPayload(), packageId: bookingData.packageId,
    notes: bookingData.contactInfo?.specialRequests || "",
    transferOption: bookingData.contactInfo?.transferOption === "no_transfer" ? "no_transfer" : "requested",
    acknowledged,
  });
  const handleSubmitRequest = async () => {
    if (sending.current || !requestAvailable) return;
    const payload = requestPayload();
    const checked = validateBooking(payload);
    if (checked.errors.length) { alert(checked.errors.join("\n")); return; }
    if (!requestId.current) requestId.current = crypto.randomUUID();
    sending.current = true; setIsFinalizing(true);
    try {
      const response = await fetch("/api/booking-notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, requestId: requestId.current }) });
      const data = await response.json();
      if (!response.ok || data.success !== true) { alert(data.errors?.join("\n") || data.message || "ส่งคำขอไม่สำเร็จ / Could not send request"); return; }
      setBookingData(prev => ({ ...prev, paymentReference: data.reference, paymentStatus: 'unpaid' }));
      setRequestSent(true); setStep(6);
    } catch { alert("ส่งคำขอไม่สำเร็จ ข้อมูลยังอยู่ กรุณาลองใหม่ / Could not send request. Your entries remain available."); }
    finally { sending.current = false; setIsFinalizing(false); }
  };

  async function verifyPayment() {
    const id = new URLSearchParams(window.location.search).get("session_id");
    if (!id) return;
    setStep(6); setPaymentView(prev => ({ ...prev, checking: true, error: "" }));
    try {
      const response = await fetch("/api/payments/status?session_id=" + encodeURIComponent(id), { headers: { "x-booking-key": requestId.current }, cache: "no-store" });
      if (!response.ok) throw new Error('verification_failed');
      const data = await response.json();
      if (!data.paid) { setPaymentView({ checking: false, notificationPending: false, error: "ยังไม่พบการชำระสำเร็จ กรุณาตรวจสอบอีกครั้ง อย่าจ่ายซ้ำ / Payment is not yet verified. Check again before paying again." }); return; }
      setBookingData(prev => ({ ...prev, ...(data.booking ? { packageId: data.booking.packageId, date: data.booking.date, timeSlot: data.booking.time, adults: data.booking.adults, children: data.booking.children, infants: data.booking.infants || 0, contactInfo: { ...data.booking, specialRequests: data.booking.notes } } : {}), paymentStatus: "paid", paymentReference: data.reference, totalPrice: data.amountTHB }));
      setPaymentView({ checking: false, notificationPending: data.notificationPending, error: "" });
    } catch { setPaymentView(prev => ({ ...prev, checking: false, error: "ยังตรวจสอบการชำระไม่ได้ กรุณาตรวจสอบอีกครั้งหรือติดต่อทีมงาน อย่าจ่ายซ้ำ / Could not verify payment. Retry verification or contact staff; do not pay again." })); }
  }
  useEffect(() => {
    if (!restored) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success" && params.get("session_id")) void verifyPayment();
    else if (params.get("status") === "cancel") setStep(4);
  }, [restored]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PackageSelection
            packages={packages}
            selectedPackage={bookingData.packageId}
            onSelect={(pkg) => {
              setBookingData((prev) => ({
                ...prev,
                packageId: pkg.id,
                times: pkg.times,
                timeSlot: prev.packageId === pkg.id ? prev.timeSlot : null,
              }));
              setStep(2);
            }}
            currentLang={currentLang}
          />
        );
      case 2:
        return (
          <BookingCalendar
            packageId={bookingData.packageId}
            selectedDate={bookingData.date}
            selectedTime={bookingData.timeSlot}
            onDateSelect={(date) => setBookingData({ ...bookingData, date })}
            onTimeSelect={(time) =>
              setBookingData({ ...bookingData, timeSlot: time })
            }
            currentLang={currentLang}
          />
        );
      case 3:
        return (
          <BookingForm
            bookingData={bookingData}
            onDataChange={setBookingData}
            currentLang={currentLang}
          />
        );
      case 4:
        return <>
          <BookingConfirmation bookingData={bookingData} packages={packages} currentLang={currentLang} />
          <div className="bg-white rounded-lg shadow-lg mt-6 p-6 space-y-4">
            <p>{currentLang === "th" ? "ส่งคำขอให้ทีมงานตรวจที่ว่าง ราคา และรถรับส่งก่อน เมื่อทีมงานยืนยันรายละเอียดแล้ว จะส่งอีเมลพร้อมลิงก์ชำระด้วยบัตรให้คุณ ขั้นตอนนี้ยังไม่เรียกเก็บเงิน" : "Send your request for staff to check availability, price and pickup. After review, the team emails the agreed details and a card-payment link. No payment is taken now."}</p>
            {!requestAvailable && <p role="status" className="text-amber-800">{currentLang === "th" ? "ยังไม่ได้ตั้งค่าระบบรับคำขอ กรุณาติดต่อทีมงานผ่านช่องทางที่ยืนยันแล้ว" : "Booking requests are not configured yet. Please use a verified contact channel."}</p>}
            <label className="flex gap-3 items-start"><input type="checkbox" disabled={isFinalizing} checked={bookingData.paymentConfirmed} onChange={event => setBookingData(prev => ({ ...prev, paymentConfirmed: event.target.checked }))} className="mt-1 h-5 w-5" /><span>{currentLang === "th" ? "ยินยอมให้ส่งข้อมูลไปยังทีมงานผ่าน LINE และอีเมลเพื่อติดต่อเรื่องการจอง และรับทราบว่าต้องรอตรวจสอบก่อนชำระเงิน" : "I agree to send my details to staff through LINE and receive booking emails. I understand the request needs review before payment."} <a className="underline" href="/cancellation-policy" target="_blank" rel="noopener noreferrer">Terms</a> · <a className="underline" href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy</a></span></label>
          </div>
        </>;
      case 6:
        return <div className="bg-white rounded-lg shadow-lg p-6 space-y-4" aria-live="polite">
          <h2 className="text-2xl font-bold text-green-700">{requestSent ? (currentLang === "th" ? "ส่งคำขอแล้ว — รอทีมงานตรวจสอบ" : "Request sent — awaiting staff review") : paymentView.checking ? (currentLang === "th" ? "กำลังตรวจสอบการชำระเงิน…" : "Verifying payment…") : bookingData.paymentStatus === "paid" ? (currentLang === "th" ? "ชำระเงินสำเร็จ" : "Payment verified") : (currentLang === "th" ? "รอตรวจสอบการชำระเงิน" : "Payment verification pending")}</h2>
          {requestSent && <><p>ทีมงานได้รับแจ้งคำขอผ่าน LINE แล้ว จะตรวจสอบที่ว่างและรายละเอียดก่อนส่งอีเมลพร้อมลิงก์ชำระให้คุณ ยังไม่มีการเรียกเก็บเงินและยังไม่ได้ส่งลิงก์ชำระในขั้นตอนนี้<br />The team has been notified through LINE. After staff review, you will receive an email with the agreed details and payment link. No payment is taken now.</p><p className="break-all">Ref: {bookingData.paymentReference}</p><BookingConfirmation bookingData={bookingData} packages={packages} currentLang={currentLang} /></>}
          {paymentView.error && <p role="alert" className="text-amber-800">{paymentView.error}</p>}
          {bookingData.paymentStatus === "paid" && <><p>{paymentView.notificationPending ? "ชำระเงินแล้ว แต่การแจ้ง LINE/อีเมลยังรอดำเนินการ ระบบจะลองใหม่ ไม่ต้องจ่ายซ้ำ / Payment verified. Notifications are pending; do not pay again." : "ตรวจสอบกับ Stripe แล้ว และผู้ให้บริการรับส่งการแจ้ง LINE/อีเมลยืนยันแล้ว / Payment verified; confirmation notifications were accepted for sending."}</p><p className="break-all">Ref: {bookingData.paymentReference}</p><BookingConfirmation bookingData={bookingData} packages={packages} currentLang={currentLang} /></>}
          {!requestSent && <Button variant="outline" disabled={paymentView.checking} onClick={() => void verifyPayment()}>{currentLang === "th" ? "ตรวจสอบอีกครั้ง" : "Check again"}</Button>}
          {(requestSent || bookingData.paymentStatus === "paid") && <Button variant="primary" onClick={() => { try { sessionStorage.removeItem('jasmine-original-booking-draft'); } catch {} window.location.href = "/booking"; }}>{currentLang === "th" ? "จองใหม่" : "New booking"}</Button>}
        </div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Hero Section - Same as Homepage */}
      <section
        className="relative bg-green-600 text-white py-16 h-[35vh] flex items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/elephants/hero/banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-black">{currentContent.title}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-green-100">
              <span className="text-black">{currentContent.subtitle}</span>
            </p>
            {/* Optionally add a CTA button here if needed */}
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="bg-white border-b text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex w-full overflow-x-auto flex-nowrap items-center justify-start md:justify-between">
            {currentContent.steps.filter((_, index) => index !== 4).map((stepName, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index + 1 <= (step === 6 ? 5 : step)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    index + 1 <= (step === 6 ? 5 : step) ? "text-green-600" : "text-black"
                  }`}
                >
                  {stepName}
                </span>
                {index < 4 && (
                  <div
                    className={`mx-4 h-0.5 w-8 ${
                      index + 1 < (step === 6 ? 5 : step) ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              disabled={isFinalizing}
              onClick={() => step > 1 && step < 6 && setStep(step - 1)}
              className={step === 1 || step === 6 ? "invisible" : "visible"}
            >
              {currentLang === "th" ? "ย้อนกลับ" : "Back"}
            </Button>

            {step === 1 || step === 6 ? <div /> : <Button
              variant="primary"
              disabled={isFinalizing || (step === 4 && (!requestAvailable || !isPaymentValid)) || (step === 2 && (!bookingData.date || !bookingData.timeSlot))}
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (step === 4) { void handleSubmitRequest(); return; }
                if (step === 3) { const checked = validateBooking(requestPayload(true)); if (checked.errors.length) { alert(checked.errors.join("\n")); return; } }
                setStep(step + 1);
              }}
            >{isFinalizing ? (currentLang === "th" ? "กำลังส่งคำขอ…" : "Sending request…") : step === 4 ? (currentLang === "th" ? "ส่งคำขอให้ทีมงานตรวจสอบ" : "Submit for staff review") : (currentLang === "th" ? "ถัดไป" : "Next")}</Button>}
          </div>
        </div>
      </section>
    </div>
  );
}

// Package Selection Component
function PackageSelection({
  packages,
  selectedPackage,
  onSelect,
  currentLang,
}: {
  packages: Package[];
  selectedPackage: number | null;
  onSelect: (pkg: Package) => void;
  currentLang: string;
}) {
  const selectPackageText = {
    th: "เลือกโปรแกรมทัวร์",
    en: "Select Tour Package",
    de: "Tourpaket auswählen",
    cn: "选择旅游套餐",
    fr: "Sélectionner le forfait touristique",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {selectPackageText[currentLang as keyof typeof selectPackageText] ||
          selectPackageText.en}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {packages.map((pkg: Package) => (
          <div
            key={pkg.id}
            onClick={() => onSelect(pkg)}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedPackage === pkg.id
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-green-300"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex flex-row items-center mb-2 gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {pkg.name}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {pkg.duration}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {currentLang === "th"
                        ? "ราคาผู้ใหญ่:"
                        : currentLang === "de"
                        ? "Erwachsenenpreis:"
                        : currentLang === "cn"
                        ? "成人价格:"
                        : currentLang === "fr"
                        ? "Prix adulte:"
                        : "Adult Price:"}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ฿{pkg.price.adult.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {currentLang === "th"
                        ? "ราคาเด็ก:"
                        : currentLang === "de"
                        ? "Kinderpreis:"
                        : currentLang === "cn"
                        ? "儿童价格:"
                        : currentLang === "fr"
                        ? "Prix enfant:"
                        : "Child Price:"}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ฿{pkg.price.child.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {currentLang === "th"
                      ? "กิจกรรมที่รวม:"
                      : currentLang === "de"
                      ? "Inbegriffene Aktivitäten:"
                      : currentLang === "cn"
                      ? "包含活动:"
                      : currentLang === "fr"
                      ? "Activités incluses:"
                      : "Included Activities:"}
                  </p>
                  {/* กำหนดชุดสีที่หลากหลาย */}
                  {(() => {
                    const colorSets = [
                      { bg: "bg-blue-50", text: "text-blue-700" },
                      { bg: "bg-green-50", text: "text-green-700" },
                      { bg: "bg-yellow-50", text: "text-yellow-700" },
                      { bg: "bg-pink-50", text: "text-pink-700" },
                      { bg: "bg-purple-50", text: "text-purple-700" },
                      { bg: "bg-orange-50", text: "text-orange-700" },
                    ];
                    return (
                      <div className="flex flex-wrap gap-2">
                        {pkg.activities.slice(0, 4).map((activity, index) => {
                          const color = colorSets[index % colorSets.length];
                          return (
                            <span
                              key={index}
                              className={`text-xs ${color.bg} ${color.text} px-2 py-1 rounded shadow-sm`}
                            >
                              {activity}
                            </span>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div className="ml-4">
                {selectedPackage === pkg.id && (
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Booking Confirmation Component
interface BookingConfirmationProps {
  bookingData: any;
  packages: Package[];
  currentLang: string;
  onConfirm?: () => void;
}

function BookingConfirmation({
  bookingData,
  packages,
  currentLang,
  onConfirm,
}: BookingConfirmationProps) {
  const selectedPackage = packages.find(
    (pkg: Package) => pkg.id === bookingData.packageId
  );

  const confirmText = {
    th: "ยืนยันการจอง",
    en: "Confirm Your Booking",
    de: "Buchung bestätigen",
    cn: "确认预订",
    fr: "Confirmer la réservation",
  };

  const labels = {
    date: {
      th: "วันที่:",
      en: "Date:",
      de: "Datum:",
      cn: "日期:",
      fr: "Date:",
    },
    time: {
      th: "เวลา:",
      en: "Time:",
      de: "Zeit:",
      cn: "时间:",
      fr: "Heure:",
    },
    participants: {
      th: "ผู้เข้าร่วม:",
      en: "Participants:",
      de: "Teilnehmer:",
      cn: "参与者:",
      fr: "Participants:",
    },
    adults: {
      th: "ผู้ใหญ่",
      en: "Adults",
      de: "Erwachsene",
      cn: "成人",
      fr: "Adultes",
    },
    children: {
      th: "เด็ก",
      en: "Children",
      de: "Kinder",
      cn: "儿童",
      fr: "Enfants",
    },
    total: {
      th: "ราคารวม:",
      en: "Total Price:",
      de: "Gesamtpreis:",
      cn: "总价:",
      fr: "Prix total:",
    },
    contactDetails: {
      th: "ข้อมูลติดต่อ",
      en: "Contact Details",
    },
    fullName: {
      th: "ชื่อ-นามสกุล:",
      en: "Full Name:",
    },
    email: {
      th: "อีเมล:",
      en: "Email:",
    },
    phone: {
      th: "เบอร์โทร:",
      en: "Phone:",
    },
    hotel: {
      th: "โรงแรม:",
      en: "Hotel:",
    },
    roomNumber: {
      th: "หมายเลขห้อง:",
      en: "Room Number:",
    },
    whatsapp: {
      th: "WhatsApp:",
      en: "WhatsApp:",
    },
    specialRequests: {
      th: "ความต้องการเพิ่มเติม:",
      en: "Special Requests:",
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {confirmText[currentLang as keyof typeof confirmText] || confirmText.en}
      </h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold">{selectedPackage?.name}</h3>
          <p className="text-gray-600">{selectedPackage?.duration}</p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>
              {labels.date[currentLang as keyof typeof labels.date] ||
                labels.date.en}
            </span>
            <span className="font-medium">{bookingData.date}</span>
          </div>
          <div className="flex justify-between">
            <span>
              {labels.time[currentLang as keyof typeof labels.time] ||
                labels.time.en}
            </span>
            <span className="font-medium">{bookingData.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <span>
              {labels.participants[
                currentLang as keyof typeof labels.participants
              ] || labels.participants.en}
            </span>
            <span className="font-medium">
              {bookingData.adults}{" "}
              {labels.adults[currentLang as keyof typeof labels.adults] ||
                labels.adults.en}
              , {bookingData.children}{" "}
              {labels.children[currentLang as keyof typeof labels.children] ||
                labels.children.en}
            </span>
          </div>
          {/* เพิ่ม Contact Details ที่กรอก */}
          {bookingData.contactInfo && (
            <div className="border-t pt-4 space-y-2">
              <div className="font-bold mb-2">
                {currentLang === "th"
                  ? labels.contactDetails.th
                  : labels.contactDetails.en}
              </div>
              <div className="flex justify-between">
                <span>
                  {currentLang === "th"
                    ? "รับส่ง:"
                    : currentLang === "de"
                    ? "Transfer:"
                    : currentLang === "cn"
                    ? "接送:"
                    : currentLang === "fr"
                    ? "Transfert:"
                    : "Transfer:"}
                </span>
                <span>
                  {bookingData.contactInfo.transferOption === "no_transfer"
                    ? currentLang === "th"
                      ? "ไม่รับส่ง"
                      : currentLang === "cn"
                      ? "不接送"
                      : currentLang === "fr"
                      ? "Sans transfert"
                      : currentLang === "de"
                      ? "Kein Transfer"
                      : "No transfer"
                    : currentLang === "th"
                    ? "รับส่งฟรี"
                    : currentLang === "cn"
                    ? "免费接送"
                    : currentLang === "fr"
                    ? "Transfert gratuit"
                    : currentLang === "de"
                    ? "Kostenloser Transfer"
                    : "Free transfer"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  {currentLang === "th"
                    ? labels.fullName.th
                    : labels.fullName.en}
                </span>
                <span>{bookingData.contactInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {currentLang === "th" ? labels.email.th : labels.email.en}
                </span>
                <span>{bookingData.contactInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {currentLang === "th" ? labels.phone.th : labels.phone.en}
                </span>
                <span>{bookingData.contactInfo.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {currentLang === "th" ? labels.hotel.th : labels.hotel.en}
                </span>
                <span>{bookingData.contactInfo.hotel}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {currentLang === "th"
                    ? labels.roomNumber.th
                    : labels.roomNumber.en}
                </span>
                <span>{bookingData.contactInfo.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {currentLang === "th"
                    ? labels.whatsapp.th
                    : labels.whatsapp.en}
                </span>
                <span>{bookingData.contactInfo.whatsapp}</span>
              </div>
              {bookingData.contactInfo.specialRequests && (
                <div className="flex justify-between">
                  <span>
                    {currentLang === "th"
                      ? labels.specialRequests.th
                      : labels.specialRequests.en}
                  </span>
                  <span>{bookingData.contactInfo.specialRequests}</span>
                </div>
              )}
            </div>
          )}
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>
                {labels.total[currentLang as keyof typeof labels.total] ||
                  labels.total.en}
              </span>
              <span className="text-green-600">
                ฿{bookingData.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        {/* ...existing code... */}
      </div>
    </div>
  );
}

