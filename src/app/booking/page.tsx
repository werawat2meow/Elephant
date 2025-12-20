"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import BookingCalendar from "../../components/BookingCalendar";
import BookingForm from "../../components/BookingForm";
import Button from "../../components/Button";
import { useLanguage } from "../../contexts/LanguageContext";

interface Package {
  id: number;
  name: string;
  duration: string;
  price: { adult: number; child: number };
  badge: string;
  times: string[];
  activities: string[];
}

export default function BookingPage() {
  const { currentLang } = useLanguage();
  // Hydration-safe: always start at step 1 and packageId null, then update client-side
  const [step, setStep] = useState(1);
  const [isFinalizing, setIsFinalizing] = useState(false);
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

  const isPaymentValid = (() => {
    if (bookingData.paymentMethod !== "card") return false;
    if (!bookingData.paymentConfirmed) return false;

    const name = String(bookingData.cardDetails?.name ?? "").trim();
    const numberDigits = String(bookingData.cardDetails?.number ?? "").replace(
      /\D/g,
      ""
    );
    const expiry = String(bookingData.cardDetails?.expiry ?? "");
    const cvcDigits = String(bookingData.cardDetails?.cvc ?? "").replace(
      /\D/g,
      ""
    );

    const isNameOk = name.length >= 2;
    const isNumberOk = numberDigits.length >= 16;
    const isExpiryOk = /^\d{2}\/\d{2}$/.test(expiry);
    const isCvcOk = cvcDigits.length === 3 || cvcDigits.length === 4;

    return isNameOk && isNumberOk && isExpiryOk && isCvcOk;
  })();

  // On mount, read packageId from query string and update state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("packageId");
      if (id) {
        setBookingData((prev) => {
          // Only update if not already set
          if (prev.packageId !== Number(id)) {
            setStep(2);
            return { ...prev, packageId: Number(id) };
          }
          return prev;
        });
      }
    }
  }, []);

  useEffect(() => {
    console.log("Updated Booking Data:", bookingData);
  }, [bookingData]);

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
        "ยืนยันการจอง",
        "ชำระเงิน",
        "ใบเสร็จ",
      ],
      selectPackage: "เลือกโปรแกรมทัวร์",
      selectDateTime: "เลือกวันที่และเวลา",
      guestInfo: "ข้อมูลผู้เข้าร่วม",
      confirmation: "ยืนยันการจอง",
      payment: "ชำระเงิน",
      invoice: "ใบเสร็จ",
    },
    en: {
      title: "Book Now",
      subtitle: "Reserve your unforgettable ethical elephant experience",
      steps: [
        "Select Package",
        "Choose Date & Time",
        "Guest Information",
        "Confirm Booking",
        "Payment",
        "Invoice",
      ],
      selectPackage: "Select Tour Package",
      selectDateTime: "Choose Date & Time",
      guestInfo: "Guest Information",
      confirmation: "Confirm Booking",
      payment: "Payment",
      invoice: "Invoice",
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
        "Bezahlung",
        "Rechnung",
      ],
      selectPackage: "Tourpaket auswählen",
      selectDateTime: "Datum und Zeit wählen",
      guestInfo: "Gästeinformationen",
      confirmation: "Buchung bestätigen",
      payment: "Bezahlung",
      invoice: "Rechnung",
    },
    cn: {
      title: "立即预订",
      subtitle: "预订您难忘的道德大象体验",
      steps: [
        "选择套餐",
        "选择日期和时间",
        "客人信息",
        "确认预订",
        "支付",
        "发票",
      ],
      selectPackage: "选择旅游套餐",
      selectDateTime: "选择日期和时间",
      guestInfo: "客人信息",
      confirmation: "确认预订",
      payment: "支付",
      invoice: "发票",
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
        "Paiement",
        "Facture",
      ],
      selectPackage: "Sélectionner le forfait touristique",
      selectDateTime: "Choisir la date et l'heure",
      guestInfo: "Informations des invités",
      confirmation: "Confirmer la réservation",
      payment: "Paiement",
      invoice: "Facture",
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

  const downloadInvoice = async (
    payload: any,
    opts?: { mode?: "download" | "view" }
  ) => {
    const invoiceRes = await fetch("/api/invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageName: payload.packageName,
        date: payload.date,
        time: payload.time,
        adults: payload.adults,
        children: payload.children,
        infants: payload.infants,
        totalPrice: payload.totalPrice,
        customer: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          hotel: payload.hotel,
          roomNumber: payload.roomNumber,
          whatsapp: payload.whatsapp,
          transferOption: payload.transferOption,
        },
      }),
    });

    if (!invoiceRes.ok) {
      throw new Error("invoice_failed");
    }

    const blob = await invoiceRes.blob();
    const url = URL.createObjectURL(blob);
    const mode = opts?.mode ?? "download";

    if (mode === "view") {
      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (!win) {
        URL.revokeObjectURL(url);
        throw new Error("popup_blocked");
      }
      // Keep URL alive briefly so the new tab can load it.
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      return;
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${payload.packageName}-${payload.date}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // After payment completed: notify LINE, then show invoice step (and auto-download)
  const handlePaymentComplete = async () => {
    if (isFinalizing) return;
    setIsFinalizing(true);
    // Ensure we have a payment reference (booking ref) to correlate webhook
    const bookingRef = bookingData.paymentReference || `bk_${Date.now()}`;
    setBookingData((prev) => ({ ...prev, paymentReference: bookingRef }));
    const payload = { ...buildBookingPayload(), paymentReference: bookingRef };

    try {
      // store payload temporarily so we can finish invoice download after redirect back
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "pendingBookingPayload",
          JSON.stringify(payload)
        );
      }

      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Error initiating payment");
        setIsFinalizing(false);
        return;
      }

      const data = await res.json();
      if (data?.url) {
        // redirect to Stripe Checkout
        window.location.href = data.url;
        return;
      } else {
        alert("Payment initiation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to payment API");
    } finally {
      setIsFinalizing(false);
    }
  };

  // After redirect from Stripe Checkout, if we have a pending payload and status=success
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") {
      const stored = sessionStorage.getItem("pendingBookingPayload");
      if (stored) {
        try {
          const payload = JSON.parse(stored);
          // Auto-download invoice once webhook should have processed the payment
          (async () => {
            try {
              await downloadInvoice(payload, { mode: "download" });
            } catch (e) {
              // ignore
            }
            setBookingData((prev) => ({ ...prev, paymentStatus: "paid" }));
            setStep(6);
            sessionStorage.removeItem("pendingBookingPayload");
          })();
        } catch {
          sessionStorage.removeItem("pendingBookingPayload");
        }
      }
    }
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PackageSelection
            packages={packages}
            selectedPackage={bookingData.packageId}
            onSelect={(pkg) =>
              setBookingData({
                ...bookingData,
                packageId: pkg.id,
                times: pkg.times, // Add times to bookingData
              })
            }
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
        return (
          <BookingConfirmation
            bookingData={bookingData}
            packages={packages}
            currentLang={currentLang}
          />
        );
      case 5:
        return (
          <PaymentStep
            bookingData={bookingData}
            onDataChange={setBookingData}
            currentLang={currentLang}
          />
        );
      case 6:
        return (
          <InvoiceStep
            bookingData={bookingData}
            currentLang={currentLang}
            onDownload={() =>
              downloadInvoice(buildBookingPayload(), { mode: "download" })
            }
            onView={() =>
              downloadInvoice(buildBookingPayload(), { mode: "view" })
            }
            onNewBooking={() => {
              setBookingData({
                packageId: null,
                date: null,
                timeSlot: null,
                times: [],
                adults: 1,
                children: 0,
                infants: 0,
                totalPrice: 0,
                contactInfo: {
                  name: "",
                  email: "",
                  phone: "",
                  nationality: "",
                  specialRequests: "",
                  hotel: "",
                  roomNumber: "",
                  whatsapp: "",
                  transferOption: "free",
                },
                paymentMethod: "card",
                paymentStatus: "unpaid",
                paymentReference: "",
                paymentConfirmed: false,
                cardDetails: { name: "", number: "", expiry: "", cvc: "" },
              });
              setStep(1);
            }}
          />
        );
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
            {currentContent.steps.map((stepName, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index + 1 <= step
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    index + 1 <= step ? "text-green-600" : "text-black"
                  }`}
                >
                  {stepName}
                </span>
                {index < currentContent.steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-8 ${
                      index + 1 < step ? "bg-green-600" : "bg-gray-200"
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
              onClick={() => step > 1 && step < 6 && setStep(step - 1)}
              className={step === 1 || step === 6 ? "invisible" : "visible"}
            >
              {currentLang === "th" ? "ย้อนกลับ" : "Back"}
            </Button>

            {step === 6 ? (
              <div />
            ) : step === 5 ? (
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePaymentComplete}
                disabled={isFinalizing || !isPaymentValid}
              >
                {isFinalizing
                  ? currentLang === "th"
                    ? "กำลังดำเนินการ..."
                    : "Processing..."
                  : currentLang === "th"
                  ? "ยืนยันการชำระเงิน"
                  : "Confirm Payment"}
              </button>
            ) : (
              <Button
                variant="primary"
                onClick={() => step < 6 && setStep(step + 1)}
                className="bg-green-600 hover:bg-green-700"
                disabled={
                  (step === 1 && !bookingData.packageId) ||
                  (step === 2 && (!bookingData.date || !bookingData.timeSlot))
                }
              >
                {step === 4
                  ? currentLang === "th"
                    ? "ไปหน้าชำระเงิน"
                    : "Go to Payment"
                  : currentLang === "th"
                  ? "ถัดไป"
                  : "Next"}
              </Button>
            )}
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

interface PaymentStepProps {
  bookingData: any;
  onDataChange: (value: any) => void;
  currentLang: string;
}

function PaymentStep({
  bookingData,
  onDataChange,
  currentLang,
}: PaymentStepProps) {
  const title =
    currentLang === "th"
      ? "ชำระเงิน"
      : currentLang === "de"
      ? "Bezahlung"
      : currentLang === "cn"
      ? "支付"
      : currentLang === "fr"
      ? "Paiement"
      : "Payment";

  const methodLabel =
    currentLang === "th"
      ? "วิธีการชำระเงิน"
      : currentLang === "de"
      ? "Zahlungsmethode"
      : currentLang === "cn"
      ? "支付方式"
      : currentLang === "fr"
      ? "Méthode de paiement"
      : "Payment method";

  const cardLabel =
    currentLang === "th"
      ? "บัตร (Card)"
      : currentLang === "cn"
      ? "信用卡"
      : currentLang === "fr"
      ? "Carte"
      : currentLang === "de"
      ? "Karte"
      : "Card";

  const confirmLabel =
    currentLang === "th"
      ? "ฉันยืนยันว่าชำระเงินเรียบร้อยแล้ว"
      : currentLang === "de"
      ? "Ich bestätige, dass die Zahlung abgeschlossen ist"
      : currentLang === "cn"
      ? "我确认已完成付款"
      : currentLang === "fr"
      ? "Je confirme que le paiement est effectué"
      : "I confirm payment is completed";

  const helper =
    currentLang === "th"
      ? "เมื่อชำระเงินเสร็จ ให้ทำเครื่องหมายยืนยัน แล้วกดยืนยันการชำระเงิน"
      : "After payment, tick confirmation then press Confirm Payment.";

  const cardTitle =
    currentLang === "th"
      ? "บัตรเดบิต/เครดิต"
      : currentLang === "de"
      ? "Debit-/Kreditkarte"
      : currentLang === "cn"
      ? "借记卡/信用卡"
      : currentLang === "fr"
      ? "Carte de débit/crédit"
      : "Debit/Credit Card";

  const cardNumberLabel = currentLang === "th" ? "หมายเลขบัตร" : "Card Number";
  const cardNameLabel = currentLang === "th" ? "ชื่อบนบัตร" : "Name on card";
  const expiryLabel = currentLang === "th" ? "วันหมดอายุ" : "Expiry date";
  const cvcLabel = currentLang === "th" ? "รหัส CVC" : "CVC CODE";

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-700 font-medium">{methodLabel}</div>
            <div className="text-gray-900">{cardLabel}</div>
          </div>
          <div className="text-lg font-bold text-green-600">
            ฿{bookingData.totalPrice?.toLocaleString()}
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">{cardTitle}</div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/elephants/logo/visa.png"
                alt="Visa"
                width={48}
                height={24}
                className="object-contain"
              />
              <Image
                src="/images/elephants/logo/Mastercard-logo.png"
                alt="Mastercard"
                width={48}
                height={24}
                className="object-contain"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {cardNameLabel}
            </label>
            <input
              type="text"
              autoComplete="cc-name"
              value={bookingData.cardDetails?.name || ""}
              onChange={(e) =>
                onDataChange((prev: any) => ({
                  ...prev,
                  cardDetails: {
                    ...(prev.cardDetails || {}),
                    name: e.target.value,
                  },
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={
                currentLang === "th" ? "เช่น SOMCHAI" : "e.g. SOMCHAI"
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {cardNumberLabel}
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={bookingData.cardDetails?.number || ""}
              onChange={(e) =>
                onDataChange((prev: any) => ({
                  ...prev,
                  cardDetails: {
                    ...(prev.cardDetails || {}),
                    number: formatCardNumber(e.target.value),
                  },
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="1234 1234 1234 1234"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {expiryLabel}
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={bookingData.cardDetails?.expiry || ""}
                onChange={(e) =>
                  onDataChange((prev: any) => ({
                    ...prev,
                    cardDetails: {
                      ...(prev.cardDetails || {}),
                      expiry: formatExpiry(e.target.value),
                    },
                  }))
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="MM/YY"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {cvcLabel}
              </label>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={bookingData.cardDetails?.cvc || ""}
                onChange={(e) =>
                  onDataChange((prev: any) => ({
                    ...prev,
                    cardDetails: {
                      ...(prev.cardDetails || {}),
                      cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                    },
                  }))
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="CVC"
              />
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!bookingData.paymentConfirmed}
            onChange={(e) =>
              onDataChange((prev: any) => ({
                ...prev,
                paymentConfirmed: e.target.checked,
              }))
            }
          />
          <div>
            <div className="text-gray-900">{confirmLabel}</div>
            <div className="text-sm text-gray-600">{helper}</div>
          </div>
        </label>
      </div>
    </div>
  );
}

interface InvoiceStepProps {
  bookingData: any;
  currentLang: string;
  onDownload: () => void;
  onView: () => void;
  onNewBooking: () => void;
}

function InvoiceStep({
  bookingData,
  currentLang,
  onDownload,
  onView,
  onNewBooking,
}: InvoiceStepProps) {
  const title =
    currentLang === "th"
      ? "ชำระเงินสำเร็จ"
      : currentLang === "de"
      ? "Zahlung erfolgreich"
      : currentLang === "cn"
      ? "支付成功"
      : currentLang === "fr"
      ? "Paiement réussi"
      : "Payment successful";

  const sub =
    currentLang === "th"
      ? "ระบบได้ส่งแจ้งเตือนไปที่ LINE และสามารถดาวน์โหลดใบเสร็จได้"
      : "LINE has been notified and you can download your invoice.";

  const downloadLabel =
    currentLang === "th" ? "ดาวน์โหลดใบเสร็จ" : "Download invoice";
  const viewLabel = currentLang === "th" ? "ดูใบเสร็จ" : "View invoice";
  const newLabel = currentLang === "th" ? "จองใหม่" : "New booking";

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="text-gray-700">{sub}</div>
        <div className="flex items-center justify-between">
          <div className="text-gray-700 font-medium">
            {currentLang === "th" ? "ยอดรวม" : "Total"}
          </div>
          <div className="text-lg font-bold text-green-600">
            ฿{bookingData.totalPrice?.toLocaleString()}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={onDownload}
            className="bg-green-600 hover:bg-green-700"
          >
            {downloadLabel}
          </Button>
          <Button variant="outline" onClick={onView}>
            {viewLabel}
          </Button>
          <Button variant="outline" onClick={onNewBooking}>
            {newLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
