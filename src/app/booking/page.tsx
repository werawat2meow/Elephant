'use client'
import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import BookingCalendar from '../../components/BookingCalendar'
import BookingForm from '../../components/BookingForm'
import Button from '../../components/Button'

interface Package {
  id: number
  name: string
  duration: string
  price: { adult: number; child: number }
  badge: string
  times: string[]
  activities: string[]
}

export default function BookingPage() {
  const { currentLang } = useLanguage()
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    packageId: null as number | null,
    date: null as string | null,
    timeSlot: null as string | null,
    adults: 1,
    children: 0,
    infants: 0,
    totalPrice: 0,
    contactInfo: null as any
  })

  const content = {
    th: {
      title: 'จองทัวร์ช้างธรรมชาติ',
      subtitle: 'จองประสบการณ์ช้างธรรมชาติที่น่าจดจำ',
      steps: [
        'เลือกโปรแกรม',
        'เลือกวันและเวลา', 
        'ข้อมูลผู้เข้าร่วม',
        'ยืนยันการจอง'
      ],
      selectPackage: 'เลือกโปรแกรมทัวร์',
      selectDateTime: 'เลือกวันที่และเวลา',
      guestInfo: 'ข้อมูลผู้เข้าร่วม',
      confirmation: 'ยืนยันการจอง'
    },
    en: {
      title: 'Book Your Elephant Tour',
      subtitle: 'Reserve your unforgettable ethical elephant experience',
      steps: [
        'Select Package',
        'Choose Date & Time',
        'Guest Information', 
        'Confirm Booking'
      ],
      selectPackage: 'Select Tour Package',
      selectDateTime: 'Choose Date & Time',
      guestInfo: 'Guest Information',
      confirmation: 'Confirm Booking'
    },
    de: {
      title: 'Buchen Sie Ihre Elefantentour',
      subtitle: 'Reservieren Sie Ihr unvergessliches ethisches Elefantenerlebnis',
      steps: [
        'Paket auswählen',
        'Datum & Zeit wählen',
        'Gästeinformationen', 
        'Buchung bestätigen'
      ],
      selectPackage: 'Tourpaket auswählen',
      selectDateTime: 'Datum und Zeit wählen',
      guestInfo: 'Gästeinformationen',
      confirmation: 'Buchung bestätigen'
    },
    cn: {
      title: '预订大象之旅',
      subtitle: '预订您难忘的道德大象体验',
      steps: [
        '选择套餐',
        '选择日期和时间',
        '客人信息', 
        '确认预订'
      ],
      selectPackage: '选择旅游套餐',
      selectDateTime: '选择日期和时间',
      guestInfo: '客人信息',
      confirmation: '确认预订'
    },
    fr: {
      title: 'Réservez votre Tour d\'Éléphants',
      subtitle: 'Réservez votre expérience éthique inoubliable avec les éléphants',
      steps: [
        'Sélectionner le forfait',
        'Choisir date et heure',
        'Informations invités', 
        'Confirmer la réservation'
      ],
      selectPackage: 'Sélectionner le forfait touristique',
      selectDateTime: 'Choisir la date et l\'heure',
      guestInfo: 'Informations des invités',
      confirmation: 'Confirmer la réservation'
    }
  }

  const currentContent = content[currentLang as keyof typeof content] || content.en

  const getPackageName = (id: number) => {
    const names = {
      1: { th: 'ช้างธรรมชาติ', en: 'Elephant Nature', de: 'Elefanten Natur', cn: '大象自然', fr: 'Nature des Éléphants' },
      2: { th: 'เดินเล่น ป้อนอาหาร', en: 'Walk & Feed', de: 'Spazieren & Füttern', cn: '散步喂食', fr: 'Marcher et Nourrir' },
      3: { th: 'มินิช้างธรรมชาติ', en: 'Mini Elephant Nature', de: 'Mini Elefanten Natur', cn: '迷你大象自然', fr: 'Mini Nature Éléphants' }
    }
    return names[id as keyof typeof names][currentLang as keyof typeof names[1]] || names[id as keyof typeof names]['en']
  }

  const getPackageBadge = (id: number) => {
    const badges = {
      1: { th: 'เหมาะกับครอบครัว', en: 'Family Friendly', de: 'Familienfreundlich', cn: '适合家庭', fr: 'Adapté aux familles' },
      2: { th: 'ได้รับความนิยมสูงสุด', en: 'Most Popular', de: 'Sehr beliebt', cn: '最受欢迎', fr: 'Très populaire' },
      3: { th: 'ตัวเลือกที่เป็นมิตร', en: 'Budget Friendly', de: 'Budgetfreundlich', cn: '经济实惠', fr: 'Économique' }
    }
    return badges[id as keyof typeof badges][currentLang as keyof typeof badges[1]] || badges[id as keyof typeof badges]['en']
  }

  const getPackageActivities = (id: number) => {
    const activities = {
      1: {
        th: ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรม', 'สาธิตทำอาหารไทย', 'สาธิตกะทิ', 'อาหารกลางวัน'],
        en: ['Feed elephants', 'Photo with elephants', 'Learn behaviors', 'Thai cooking demo', 'Coconut milk demo', 'Lunch included'],
        de: ['Elefanten füttern', 'Fotos mit Elefanten', 'Verhalten lernen', 'Thai-Koch-Demo', 'Kokosmilch-Demo', 'Mittagessen inklusive'],
        cn: ['喂大象', '与大象合影', '学习行为', '泰式烹饪演示', '椰浆演示', '包含午餐'],
        fr: ['Nourrir les éléphants', 'Photos avec éléphants', 'Apprendre comportements', 'Démo cuisine thaï', 'Démo lait de coco', 'Déjeuner inclus']
      },
      2: {
        th: ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรม', 'เตรียมอาหารช้าง'],
        en: ['Feed elephants', 'Photo with elephants', 'Learn behaviors', 'Prepare elephant meal'],
        de: ['Elefanten füttern', 'Fotos mit Elefanten', 'Verhalten lernen', 'Elefantenfutter zubereiten'],
        cn: ['喂大象', '与大象合影', '学习行为', '准备大象食物'],
        fr: ['Nourrir les éléphants', 'Photos avec éléphants', 'Apprendre comportements', 'Préparer repas éléphant']
      },
      3: {
        th: ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรม', 'สาธิตยางพารา'],
        en: ['Feed elephants', 'Photo with elephants', 'Learn behaviors', 'Rubber demonstration'],
        de: ['Elefanten füttern', 'Fotos mit Elefanten', 'Verhalten lernen', 'Kautschuk-Demonstration'],
        cn: ['喂大象', '与大象合影', '学习行为', '橡胶演示'],
        fr: ['Nourrir les éléphants', 'Photos avec éléphants', 'Apprendre comportements', 'Démonstration caoutchouc']
      }
    }
    return activities[id as keyof typeof activities][currentLang as keyof typeof activities[1]] || activities[id as keyof typeof activities]['en']
  }

  const packages = [
    {
      id: 1,
      name: getPackageName(1),
      duration: '3 hours',
      price: { adult: 2700, child: 1500 },
      badge: getPackageBadge(1),
      times: ['9:00 AM', '2:00 PM'],
      activities: getPackageActivities(1)
    },
    {
      id: 2, 
      name: getPackageName(2),
      duration: '1.5 hours',
      price: { adult: 1600, child: 1000 },
      badge: getPackageBadge(2),
      times: ['9:00 AM', '11:00 AM', '2:00 PM'],
      activities: getPackageActivities(2)
    },
    {
      id: 3,
      name: getPackageName(3), 
      duration: '1.5 hours',
      price: { adult: 1400, child: 800 },
      badge: getPackageBadge(3),
      times: ['9:00 AM', '11:00 AM', '2:00 PM'],
      activities: getPackageActivities(3)
    }
  ]

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PackageSelection 
            packages={packages}
            selectedPackage={bookingData.packageId}
            onSelect={(pkg) => setBookingData({...bookingData, packageId: pkg.id})}
            currentLang={currentLang}
          />
        )
      case 2:
        return (
          <BookingCalendar
            packageId={bookingData.packageId}
            selectedDate={bookingData.date}
            selectedTime={bookingData.timeSlot}
            onDateSelect={(date) => setBookingData({...bookingData, date})}
            onTimeSelect={(time) => setBookingData({...bookingData, timeSlot: time})}
            currentLang={currentLang}
          />
        )
      case 3:
        return (
          <BookingForm
            bookingData={bookingData}
            onDataChange={setBookingData}
            currentLang={currentLang}
          />
        )
      case 4:
        return (
          <BookingConfirmation
            bookingData={bookingData}
            packages={packages}
            currentLang={currentLang}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-green-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {currentContent.title}
          </h1>
          <p className="text-xl text-green-100">
            {currentContent.subtitle}
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {currentContent.steps.map((stepName, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index + 1 <= step 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index + 1 <= step ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {stepName}
                </span>
                {index < currentContent.steps.length - 1 && (
                  <div className={`mx-4 h-0.5 w-8 ${
                    index + 1 < step ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderStep()}
          
          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => step > 1 && setStep(step - 1)}
              className={step === 1 ? 'invisible' : 'visible'}
            >
              {currentLang === 'th' ? 'ย้อนกลับ' : 'Back'}
            </Button>
            
            <Button
              variant="primary"
              onClick={() => step < 4 && setStep(step + 1)}
              className="bg-green-600 hover:bg-green-700"
              disabled={
                (step === 1 && !bookingData.packageId) ||
                (step === 2 && (!bookingData.date || !bookingData.timeSlot))
              }
            >
              {step === 4 
                ? (currentLang === 'th' ? 'ยืนยันการจอง' : 'Confirm Booking')
                : (currentLang === 'th' ? 'ถัดไป' : 'Next')
              }
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Package Selection Component
function PackageSelection({ 
  packages, 
  selectedPackage, 
  onSelect, 
  currentLang 
}: {
  packages: Package[]
  selectedPackage: number | null
  onSelect: (pkg: Package) => void
  currentLang: string
}) {
  const selectPackageText = {
    th: 'เลือกโปรแกรมทัวร์',
    en: 'Select Tour Package',
    de: 'Tourpaket auswählen',
    cn: '选择旅游套餐',
    fr: 'Sélectionner le forfait touristique'
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {selectPackageText[currentLang as keyof typeof selectPackageText] || selectPackageText.en}
      </h2>
      <div className="grid gap-6">
        {packages.map((pkg: Package) => (
          <div
            key={pkg.id}
            onClick={() => onSelect(pkg)}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedPackage === pkg.id
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                  <span className="ml-3 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {pkg.duration}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {currentLang === 'th' ? 'ราคาผู้ใหญ่:' : currentLang === 'de' ? 'Erwachsenenpreis:' : currentLang === 'cn' ? '成人价格:' : currentLang === 'fr' ? 'Prix adulte:' : 'Adult Price:'}
                    </p>
                    <p className="text-lg font-bold text-green-600">฿{pkg.price.adult.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {currentLang === 'th' ? 'ราคาเด็ก:' : currentLang === 'de' ? 'Kinderpreis:' : currentLang === 'cn' ? '儿童价格:' : currentLang === 'fr' ? 'Prix enfant:' : 'Child Price:'}
                    </p>
                    <p className="text-lg font-bold text-green-600">฿{pkg.price.child.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {currentLang === 'th' ? 'กิจกรรมที่รวม:' : currentLang === 'de' ? 'Inbegriffene Aktivitäten:' : currentLang === 'cn' ? '包含活动:' : currentLang === 'fr' ? 'Activités incluses:' : 'Included Activities:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.activities.slice(0, 4).map((activity, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {activity}
                      </span>
                    ))}
                  </div>
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
  )
}

// Booking Confirmation Component  
function BookingConfirmation({ 
  bookingData, 
  packages, 
  currentLang 
}: {
  bookingData: any
  packages: Package[]
  currentLang: string
}) {
  const selectedPackage = packages.find((pkg: Package) => pkg.id === bookingData.packageId)
  
  const confirmText = {
    th: 'ยืนยันการจอง',
    en: 'Confirm Your Booking',
    de: 'Buchung bestätigen',
    cn: '确认预订',
    fr: 'Confirmer la réservation'
  }
  
  const labels = {
    date: {
      th: 'วันที่:',
      en: 'Date:',
      de: 'Datum:',
      cn: '日期:',
      fr: 'Date:'
    },
    time: {
      th: 'เวลา:',
      en: 'Time:',
      de: 'Zeit:',
      cn: '时间:',
      fr: 'Heure:'
    },
    participants: {
      th: 'ผู้เข้าร่วม:',
      en: 'Participants:',
      de: 'Teilnehmer:',
      cn: '参与者:',
      fr: 'Participants:'
    },
    adults: {
      th: 'ผู้ใหญ่',
      en: 'Adults',
      de: 'Erwachsene',
      cn: '成人',
      fr: 'Adultes'
    },
    children: {
      th: 'เด็ก',
      en: 'Children',
      de: 'Kinder',
      cn: '儿童',
      fr: 'Enfants'
    },
    total: {
      th: 'ราคารวม:',
      en: 'Total Price:',
      de: 'Gesamtpreis:',
      cn: '总价:',
      fr: 'Prix total:'
    }
  }
  
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
            <span>{labels.date[currentLang as keyof typeof labels.date] || labels.date.en}</span>
            <span className="font-medium">{bookingData.date}</span>
          </div>
          <div className="flex justify-between">
            <span>{labels.time[currentLang as keyof typeof labels.time] || labels.time.en}</span>
            <span className="font-medium">{bookingData.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <span>{labels.participants[currentLang as keyof typeof labels.participants] || labels.participants.en}</span>
            <span className="font-medium">
              {bookingData.adults} {labels.adults[currentLang as keyof typeof labels.adults] || labels.adults.en}, {bookingData.children} {labels.children[currentLang as keyof typeof labels.children] || labels.children.en}
            </span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>{labels.total[currentLang as keyof typeof labels.total] || labels.total.en}</span>
              <span className="text-green-600">฿{bookingData.totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}