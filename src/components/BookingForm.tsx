"use client";
import { useState, useEffect } from "react";

interface BookingFormProps {
  bookingData: any;
  onDataChange: (data: any) => void;
  currentLang: string;
}

export default function BookingForm({
  bookingData,
  onDataChange,
  currentLang,
}: BookingFormProps) {
  // ดึงชื่อโปรแกรมตามภาษา
  const packageNames: Record<string, { th: string; en: string }> = {
    "1": { th: "ช้างธรรมชาติ", en: "Elephant Nature" },
    "2": { th: "เดินเล่น ป้อนอาหาร", en: "Walk & Feed" },
    "3": { th: "มินิช้างธรรมชาติ", en: "Mini Elephant Nature" },
  };
  const langKey = currentLang === "th" ? "th" : "en";
  const currentPackageName = bookingData.packageId
    ? packageNames[String(bookingData.packageId)]?.[langKey] ||
      packageNames[String(bookingData.packageId)]?.en
    : "";
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    specialRequests: "",
    hotel: "",
    roomNumber: "",
    whatsapp: "",
  });

  const content = {
    th: {
      guestInfo: "ข้อมูลผู้เข้าร่วม",
      participants: "จำนวนผู้เข้าร่วม",
      adults: "ผู้ใหญ่ (12+ ปี)",
      children: "เด็ก (4-11 ปี)",
      infants: "ทารก (0-3 ปี ฟรี)",
      contactDetails: "ข้อมูลติดต่อ",
      name: "ชื่อ-นามสกุล",
      email: "อีเมล",
      phone: "เบอร์โทร",
      nationality: "สัญชาติ",
      specialRequests: "คำขอพิเศษ (ถ้ามี)",
      hotel: "ชื่อโรงแรมที่ให้ไปรับ",
      roomNumber: "เลขห้องพัก",
      whatsapp: "ช่องทางติดต่อ WhatsApp",
      priceSummary: "สรุปราคา",
      total: "ราคารวม",
      priceNote: "เด็กอายุต่ำกว่า 4 ปีเข้าฟรี",
      required: "จำเป็น",
    },
    en: {
      guestInfo: "Guest Information",
      participants: "Number of Participants",
      adults: "Adults (12+ years)",
      children: "Children (4-11 years)",
      infants: "Infants (0-3 years FREE)",
      contactDetails: "Contact Details",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      nationality: "Nationality",
      specialRequests: "Special Requests (Optional)",
      hotel: "Hotel name for pickup",
      roomNumber: "Room number",
      whatsapp: "WhatsApp contact",
      priceSummary: "Price Summary",
      total: "Total Price",
      priceNote: "Children under 4 years are free",
      required: "Required",
    },
  };

  const currentContent =
    content[currentLang as keyof typeof content] || content.en;

  // Calculate total price
  const calculateTotal = () => {
    const packages = [
      { id: 1, price: { adult: 2700, child: 1500 } },
      { id: 2, price: { adult: 1600, child: 1000 } },
      { id: 3, price: { adult: 1400, child: 800 } },
    ];

    const selectedPackage = packages.find(
      (pkg) => pkg.id === bookingData.packageId
    );
    if (!selectedPackage) return 0;

    const adultsTotal = adults * selectedPackage.price.adult;
    const childrenTotal = children * selectedPackage.price.child;

    return adultsTotal + childrenTotal;
  };

  const totalPrice = calculateTotal();

  // Update booking data when form changes
  useEffect(() => {
    onDataChange({
      ...bookingData,
      adults,
      children,
      infants,
      totalPrice,
      contactInfo,
    });
  }, [adults, children, infants, contactInfo, totalPrice]);

  const Counter = ({ value, onChange, min = 0, max = 10 }: any) => (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-black font-bold"
      >
        -
      </button>
      <span className="w-8 text-center font-bold text-black">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-black font-bold"
      >
        +
      </button>
    </div>
  );

  return (
    <div>
      {currentPackageName && (
        <div className="mb-2">
          <span className="text-lg font-bold text-black">
            {currentPackageName}
          </span>
        </div>
      )}
      <h2 className="text-2xl font-bold text-black mb-6">
        {currentContent.guestInfo}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participants */}
        <div className="lg:col-span-2 space-y-6">
          {/* Number of Participants */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-black mb-4">
              {currentContent.participants}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">
                    {currentContent.adults}
                  </div>
                  <div className="text-sm text-gray-500">
                    ฿
                    {bookingData.packageId === 1
                      ? "2,700"
                      : bookingData.packageId === 2
                      ? "1,600"
                      : "1,400"}
                  </div>
                </div>
                <Counter value={adults} onChange={setAdults} min={1} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{currentContent.children}</div>
                  <div className="text-sm text-black font-bold">
                    ฿
                    {bookingData.packageId === 1
                      ? "1,500"
                      : bookingData.packageId === 2
                      ? "1,000"
                      : "800"}
                  </div>
                </div>
                <Counter value={children} onChange={setChildren} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">
                    {currentContent.infants}
                  </div>
                  <div className="text-sm text-green-600 font-medium">FREE</div>
                </div>
                <Counter value={infants} onChange={setInfants} />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {currentContent.contactDetails}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.hotel}
                </label>
                <input
                  type="text"
                  value={contactInfo.hotel}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, hotel: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={
                    currentLang === "th"
                      ? "ชื่อโรงแรมที่ให้ไปรับ"
                      : "Hotel name for pickup"
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.roomNumber}
                </label>
                <input
                  type="text"
                  value={contactInfo.roomNumber}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      roomNumber: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={
                    currentLang === "th" ? "เลขห้องพัก" : "Room number"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.name} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactInfo.name}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={
                    currentLang === "th"
                      ? "กรุณากรอกชื่อ-นามสกุล"
                      : "Enter your full name"
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.whatsapp}
                </label>
                <input
                  type="text"
                  value={contactInfo.whatsapp}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, whatsapp: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={
                    currentLang === "th"
                      ? "เบอร์หรือบัญชี WhatsApp"
                      : "WhatsApp number or account"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.email} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={contactInfo.email}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, email: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={contactInfo.phone}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, phone: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="+66 XX XXX XXXX"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.specialRequests}
                </label>
                <textarea
                  rows={3}
                  value={contactInfo.specialRequests}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      specialRequests: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={
                    currentLang === "th"
                      ? "อาหารพิเศษ, ความต้องการพิเศษ ฯลฯ"
                      : "Dietary restrictions, special needs, etc."
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">
              {currentContent.priceSummary}
            </h3>

            <div className="space-y-3">
              {adults > 0 && (
                <div className="flex justify-between">
                  <span>
                    {currentContent.adults} × {adults}
                  </span>
                  <span>
                    ฿
                    {(
                      adults *
                      (bookingData.packageId === 1
                        ? 2700
                        : bookingData.packageId === 2
                        ? 1600
                        : 1400)
                    ).toLocaleString()}
                  </span>
                </div>
              )}

              {children > 0 && (
                <div className="flex justify-between">
                  <span>
                    {currentContent.children} × {children}
                  </span>
                  <span>
                    ฿
                    {(
                      children *
                      (bookingData.packageId === 1
                        ? 1500
                        : bookingData.packageId === 2
                        ? 1000
                        : 800)
                    ).toLocaleString()}
                  </span>
                </div>
              )}

              {infants > 0 && (
                <div className="flex justify-between">
                  <span>
                    {currentContent.infants} × {infants}
                  </span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{currentContent.total}</span>
                  <span className="text-green-600">
                    ฿{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                💡 {currentContent.priceNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
