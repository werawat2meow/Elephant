'use client'
import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import Button from '../../components/Button'

export default function ContactPage() {
  const { currentLang } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      alert(currentLang === 'th' ? 'ส่งข้อความเรียบร้อยแล้ว!' : 'Message sent successfully!')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    }, 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentContent.title}
          </h1>
          <p className="text-xl text-green-100">
            {currentContent.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {currentContent.contactInfo}
              </h2>
              
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">📍</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {currentContent.address}
                      </h3>
                      <p className="text-gray-600">
                        {currentContent.addressDetail}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">📞</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {currentContent.phone}
                      </h3>
                      <p className="text-gray-600">098 439 2999</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">✉️</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {currentContent.email}
                      </h3>
                      <p className="text-gray-600">bukitelephantpark.com</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">🕐</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {currentContent.hours}
                      </h3>
                      <p className="text-gray-600">
                        {currentContent.hoursDetail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentContent.social}
                </h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
                    📘 Facebook
                  </a>
                  <a href="#" className="bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors">
                    📷 Instagram
                  </a>
                  <a href="#" className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors">
                    💬 Line
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentContent.map}
                </h3>
                <div className="mb-4">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.319467947447!2d98.31864387568523!3d7.861597306167686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502ff7b0acb3b9%3A0x7fbf2b8eb29422ae!2sBukit%20Elephant%20Park!5e0!3m2!1sth!2sth!4v1732179225155!5m2!1sth!2sth" 
                    width="100%" 
                    height="250" 
                    style={{border:0}} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bukit Elephant Park Location"
                    className="w-full rounded-lg"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {currentContent.directions}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {currentContent.directionsText}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {currentContent.form.title}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.name} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder={currentContent.form.placeholders.name}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.email} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder={currentContent.form.placeholders.email}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder={currentContent.form.placeholders.phone}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.subject} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">{currentContent.form.placeholders.subject}</option>
                      {currentContent.form.subjects.map((subject, index) => (
                        <option key={index} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentContent.form.message} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder={currentContent.form.placeholders.message}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? currentContent.form.sending : currentContent.form.send}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}