'use client'
import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import Button from '../../components/Button'

export default function ContactPage() {
    const [showLineQR, setShowLineQR] = useState(false)
  const { currentLang } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const content = {
    th: {
      title: 'ติดต่อเรา',
      subtitle: 'พร้อมให้คำปรึกษาและตอบข้อสงสัยเกี่ยวกับทัวร์ช้าง',
      contactInfo: 'ข้อมูลติดต่อ',
      address: 'ที่อยู่',
      addressDetail: '78/10 หมู่ 6 ตำบล ฉลอง เมือง ภูเก็ต 83130',
      phone: 'โทรศัพท์',
      email: 'อีเมล',
      hours: 'เวลาทำการ',
      hoursDetail: 'เปิดอยู่ · ปิดเวลา 16:30',
      form: {
        title: 'ส่งข้อความถึงเรา',
        name: 'ชื่อ-นามสกุล',
        email: 'อีเมล',
        phone: 'เบอร์โทรศัพท์',
        subject: 'หัวข้อ',
        message: 'ข้อความ',
        send: 'ส่งข้อความ',
        sending: 'กำลังส่ง...',
        required: 'จำเป็น',
        placeholders: {
          name: 'กรุณากรอกชื่อ-นามสกุล',
          email: 'example@email.com',
          phone: '+66 XX XXX XXXX',
          subject: 'เลือกหัวข้อ',
          message: 'กรุณากรอกข้อความที่ต้องการสอบถาม...'
        },
        subjects: [
          'สอบถามโปรแกรมทัวร์',
          'จองทัวร์',
          'ข้อมูลราคา',
          'การเดินทาง',
          'อื่นๆ'
        ]
      },
      social: 'ติดตามเรา',
      map: 'แผนที่',
      directions: 'วิธีการเดินทาง',
      directionsText: 'จากสนามบินภูเก็ต ใช้เวลาประมาณ 1 ชั่วโมง มุ่งหน้าไปยังตำบลฉลอง อยู่ในพื้นที่ใกล้ Big Buddha และ Wat Chalong'
    },
    en: {
      title: 'Contact Us',
      subtitle: 'Ready to provide consultation and answer questions about elephant tours',
      contactInfo: 'Contact Information',
      address: 'Address',
      addressDetail: '78/10 Moo 6, Chalong, Mueang, Phuket 83130',
      phone: 'Phone',
      email: 'Email',
      hours: 'Business Hours',
      hoursDetail: 'Open · Closes 4:30 PM',
      form: {
        title: 'Send Us a Message',
        name: 'Full Name',
        email: 'Email',
        phone: 'Phone Number',
        subject: 'Subject',
        message: 'Message',
        send: 'Send Message',
        sending: 'Sending...',
        required: 'Required',
        placeholders: {
          name: 'Enter your full name',
          email: 'example@email.com',
          phone: '+66 XX XXX XXXX',
          subject: 'Select subject',
          message: 'Please enter your inquiry...'
        },
        subjects: [
          'Tour Package Inquiry',
          'Booking Tour',
          'Pricing Information',
          'Transportation',
          'Others'
        ]
      },
      social: 'Follow Us',
      map: 'Location Map',
      directions: 'How to Get Here',
      directionsText: 'From Phuket Airport, it takes about 1 hour to reach Chalong area. Located near Big Buddha and Wat Chalong temple.'
    },
    de: {
      title: 'Kontaktieren Sie uns',
      subtitle: 'Bereit für Beratung und Beantwortung von Fragen zu Elefantentouren',
      contactInfo: 'Kontaktinformationen',
      address: 'Adresse',
      addressDetail: '78/10 Moo 6, Chalong, Mueang, Phuket 83130',
      phone: 'Telefon',
      email: 'E-Mail',
      hours: 'Öffnungszeiten',
      hoursDetail: 'Geöffnet · Schließt um 16:30',
      form: {
        title: 'Senden Sie uns eine Nachricht',
        name: 'Vollständiger Name',
        email: 'E-Mail',
        phone: 'Telefonnummer',
        subject: 'Betreff',
        message: 'Nachricht',
        send: 'Nachricht senden',
        sending: 'Wird gesendet...',
        required: 'Erforderlich',
        placeholders: {
          name: 'Geben Sie Ihren vollständigen Namen ein',
          email: 'beispiel@email.com',
          phone: '+66 XX XXX XXXX',
          subject: 'Betreff auswählen',
          message: 'Bitte geben Sie Ihre Anfrage ein...'
        },
        subjects: [
          'Tourpaket-Anfrage',
          'Tour buchen',
          'Preisinformationen',
          'Transport',
          'Sonstiges'
        ]
      },
      social: 'Folgen Sie uns',
      map: 'Standortkarte',
      directions: 'Anfahrt',
      directionsText: 'Vom Flughafen Phuket aus dauert es etwa 1 Stunde, um das Chalong-Gebiet zu erreichen. In der Nähe von Big Buddha und Wat Chalong Tempel.'
    },
    cn: {
      title: '联系我们',
      subtitle: '随时为您提供咨询并回答有关大象旅游的问题',
      contactInfo: '联系信息',
      address: '地址',
      addressDetail: '普吉岛直辖县查龙分区 6 村 78/10 号 83130',
      phone: '电话',
      email: '电子邮件',
      hours: '营业时间',
      hoursDetail: '营业中 · 16:30 关门',
      form: {
        title: '发送消息给我们',
        name: '全名',
        email: '电子邮件',
        phone: '电话号码',
        subject: '主题',
        message: '消息',
        send: '发送消息',
        sending: '发送中...',
        required: '必需',
        placeholders: {
          name: '请输入您的全名',
          email: 'example@email.com',
          phone: '+66 XX XXX XXXX',
          subject: '选择主题',
          message: '请输入您的询问...'
        },
        subjects: [
          '旅游套餐询问',
          '预订旅游',
          '价格信息',
          '交通',
          '其他'
        ]
      },
      social: '关注我们',
      map: '位置地图',
      directions: '如何到达',
      directionsText: '从普吉机场出发，大约1小时即可抵达查龙地区。位于大佛和查龙寺附近。'
    },
    fr: {
      title: 'Contactez-nous',
      subtitle: 'Prêt à fournir des conseils et répondre aux questions sur les circuits d\'éléphants',
      contactInfo: 'Informations de contact',
      address: 'Adresse',
      addressDetail: '78/10 Moo 6, Chalong, Mueang, Phuket 83130',
      phone: 'Téléphone',
      email: 'E-mail',
      hours: 'Heures d\'ouverture',
      hoursDetail: 'Ouvert · Ferme à 16h30',
      form: {
        title: 'Envoyez-nous un message',
        name: 'Nom complet',
        email: 'E-mail',
        phone: 'Numéro de téléphone',
        subject: 'Sujet',
        message: 'Message',
        send: 'Envoyer le message',
        sending: 'Envoi en cours...',
        required: 'Requis',
        placeholders: {
          name: 'Entrez votre nom complet',
          email: 'exemple@email.com',
          phone: '+66 XX XXX XXXX',
          subject: 'Sélectionner le sujet',
          message: 'Veuillez entrer votre demande...'
        },
        subjects: [
          'Demande de forfait circuit',
          'Réserver un circuit',
          'Informations de prix',
          'Transport',
          'Autres'
        ]
      },
      social: 'Suivez-nous',
      map: 'Carte de localisation',
      directions: 'Comment s\'y rendre',
      directionsText: 'Depuis l\'aéroport de Phuket, il faut environ 1 heure pour atteindre la zone de Chalong. Situé près du Big Buddha et du temple Wat Chalong.'
    }
  }

  const currentContent = content[currentLang as keyof typeof content] || content.en

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/booking-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          subject: formData.subject,
          message: formData.message,
          from: 'contact'
        })
      })
      if (res.ok) {
        alert(currentLang === 'th' ? 'ส่งข้อความเรียบร้อยแล้ว!' : 'Message sent successfully!')
        setFormData({
          name: '',
          email: '',
          phone: '',
          whatsapp: '',
          subject: '',
          message: ''
        })
      } else {
        alert(currentLang === 'th' ? 'เกิดข้อผิดพลาดในการส่ง!' : 'Error sending message!')
      }
    } catch (err) {
      alert(currentLang === 'th' ? 'เชื่อมต่อ API ไม่สำเร็จ!' : 'API connection error!')
    }
    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen">

      {/* Contact Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentContent.title}</h2>
              <p className="mb-6 text-gray-700">{currentContent.subtitle}</p>
              <div className="mb-4">
                <div className="font-semibold text-gray-900 mb-1">{currentContent.address}</div>
                <div className="text-gray-700">{currentContent.addressDetail}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-900 mb-1">{currentContent.phone}</div>
                <div className="text-gray-700">+66 81 234 5678</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-900 mb-1">{currentContent.email}</div>
                <div className="text-gray-700">info@jasminetour.com</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-900 mb-1">{currentContent.hours}</div>
                <div className="text-gray-700">{currentContent.hoursDetail}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-900 mb-1">{currentContent.social}</div>
                <div className="flex space-x-4 mt-2">
                  <a href="#" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">📘 Facebook</a>
                  <a href="#" className="bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors">📷 Instagram</a>
                  <button
                    type="button"
                    className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
                    onClick={() => setShowLineQR(true)}
                  >
                    💬 Line
                  </button>
                </div>
                {/* Line QR Modal */}
                {showLineQR && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full relative">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                        onClick={() => setShowLineQR(false)}
                        aria-label="Close"
                      >
                        ×
                      </button>
                      <h3 className="text-lg font-semibold text-center mb-4">Add Line Official</h3>
                      <img
                        src="/images/elephants/gallery/line.jpg"
                        alt="Line QR Code"
                        className="w-full h-auto rounded"
                      />
                      <p className="mt-4 text-center text-gray-700">Scan QR Code to chat with us on LINE</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-900 mb-1">{currentContent.directions}</div>
                <div className="text-gray-700">{currentContent.directionsText}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}