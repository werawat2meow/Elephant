interface FooterProps {
  currentLang: string
}

export default function Footer({ currentLang }: FooterProps) {
  const content = {
    th: {
      title: 'Bukit Elephant Park',
      description: 'ศูนย์อนุรักษ์ช้างที่มุ่งเน้นการท่องเที่ยวเชิงอนุรักษ์ เคารพธรรมชาติและสวัสดิภาพของช้าง',
      quickLinks: 'ลิงก์ด่วน',
      contact: 'ติดต่อเรา',
      address: 'ที่อยู่: 78/10 หมู่ 6 ตำบล ฉลอง ภูเก็ต 83130',
      phone: 'โทร: 098 439 2999',
      email: 'เว็บไซต์: loveelephantpark.com',
      hours: 'เวลาทำการ: 09:00 - 17:00 น. ทุกวัน',
      followUs: 'ติดตามเรา',
      rights: 'สงวนลิขสิทธิ์',
      links: [
        { href: '/', label: 'หน้าแรก' },
        { href: '/packages', label: 'โปรแกรมทัวร์' },
        { href: '/about', label: 'เกี่ยวกับเรา' },
        { href: '/contact', label: 'ติดต่อเรา' }
      ]
    },
    en: {
      title: 'Bukit Elephant Park',
      description: 'An elephant sanctuary focused on ethical tourism, respecting nature and elephant welfare',
      quickLinks: 'Quick Links',
      contact: 'Contact Info',
      address: 'Address: 78/10 Moo 6, Chalong, Phuket 83130',
      phone: 'Phone: 098 439 2999',
      email: 'Website: bukitelephantpark.com',
      hours: 'Hours: 8:00 AM - 6:00 PM Daily',
      followUs: 'Follow Us',
      rights: 'All Rights Reserved',
      links: [
        { href: '/', label: 'Home' },
        { href: '/packages', label: 'Tour Packages' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' }
      ]
    },
    de: {
      title: 'Bukit Elephant Park',
      description: 'Ein Elefantenschutzgebiet mit Fokus auf ethischen Tourismus, das die Natur und das Wohlbefinden der Elefanten respektiert',
      quickLinks: 'Schnelle Links',
      contact: 'Kontaktinfo',
      address: 'Adresse: 78/10 Moo 6, Chalong, Phuket 83130',
      phone: 'Telefon: 098 439 2999',
      email: 'Website: bukitelephantpark.com',
      hours: 'Öffnungszeiten: 8:00 - 18:00 Uhr täglich',
      followUs: 'Folgen Sie uns',
      rights: 'Alle Rechte vorbehalten',
      links: [
        { href: '/', label: 'Startseite' },
        { href: '/packages', label: 'Tourpakete' },
        { href: '/about', label: 'Über uns' },
        { href: '/contact', label: 'Kontakt' }
      ]
    },
    cn: {
      title: 'Bukit Elephant Park',
      description: '专注于道德旅游的大象保护区，尊重自然和大象福利',
      quickLinks: '快速链接',
      contact: '联系信息',
      address: '地址：78/10 Moo 6, Chalong, 普吉岛 83130',
      phone: '电话：098 439 2999',
      email: '网站：bukitelephantpark.com',
      hours: '营业时间：每日8:00 - 18:00',
      followUs: '关注我们',
      rights: '版权所有',
      links: [
        { href: '/', label: '首页' },
        { href: '/packages', label: '旅游套餐' },
        { href: '/about', label: '关于我们' },
        { href: '/contact', label: '联系我们' }
      ]
    },
    fr: {
      title: 'Bukit Elephant Park',
      description: 'Un sanctuaire d\'éléphants axé sur le tourisme éthique, respectant la nature et le bien-être des éléphants',
      quickLinks: 'Liens rapides',
      contact: 'Infos contact',
      address: 'Adresse : 78/10 Moo 6, Chalong, Phuket 83130',
      phone: 'Téléphone : 098 439 2999',
      email: 'Site web : bukitelephantpark.com',
      hours: 'Heures : 8h00 - 18h00 quotidiennement',
      followUs: 'Suivez-nous',
      rights: 'Tous droits réservés',
      links: [
        { href: '/', label: 'Accueil' },
        { href: '/packages', label: 'Forfaits Circuit' },
        { href: '/about', label: 'À propos' },
        { href: '/contact', label: 'Contact' }
      ]
    }
  }

  const currentContent = content[currentLang as keyof typeof content] || content.en

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🐘</span>
              <h3 className="text-xl font-bold">{currentContent.title}</h3>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {currentContent.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Line</span>
                💬
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{currentContent.quickLinks}</h4>
            <ul className="space-y-2">
              {currentContent.links.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{currentContent.contact}</h4>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-start">
                <span className="mr-2">📍</span>
                {currentContent.address}
              </p>
              <p className="flex items-center">
                <span className="mr-2">📞</span>
                {currentContent.phone}
              </p>
              <p className="flex items-center">
                <span className="mr-2">✉️</span>
                {currentContent.email}
              </p>
              <p className="flex items-center">
                <span className="mr-2">🕐</span>
                {currentContent.hours}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 {currentContent.title}. {currentContent.rights}.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-300 text-sm">
                {currentLang === 'th' ? 'ท่องเที่ยวอย่างมีจริยธรรม' : 'Ethical Tourism'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}