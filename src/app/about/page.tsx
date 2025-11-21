'use client'
import { useLanguage } from '../../contexts/LanguageContext'
import Button from '../../components/Button'

export default function AboutPage() {
  const { currentLang } = useLanguage()

  const content = {
    th: {
      title: 'เกี่ยวกับช้างธรรมชาติ',
      subtitle: 'ศูนย์อนุรักษ์ช้างที่มุ่งเน้นการท่องเที่ยวเชิงอนุรักษ์',
      story: {
        title: 'เรื่องราวของเรา',
        content: 'ช้างธรรมชาติก่อตั้งขึ้นด้วยความปรารถนาที่จะสร้างสถานที่ปลอดภัยและเคารพธรรมชาติสำหรับช้างที่ถูกทรมานและใช้แรงงานผิดกฎหมาย เราเชื่อว่าการท่องเที่ยวไม่ควรเป็นการควบคุมหรือใช้ประโยชน์จากสัตว์ แต่ควรเป็นการเรียนรู้และเคารพธรรมชาติของพวกมัน'
      },
      mission: {
        title: 'ภารกิจของเรา',
        items: [
          'ให้ช้างอยู่อย่างธรรมชาติและมีความสุข',
          'สร้างความตระหนักในการอนุรักษ์ช้าง',
          'ส่งเสริมการท่องเที่ยวเชิงอนุรักษ์',
          'สนับสนุนชุมชนในท้องถิ่นให้มีส่วนร่วม'
        ]
      },
      values: {
        title: 'คุณค่าหลักของเรา',
        items: [
          { title: 'เคารพธรรมชาติ', desc: 'เคารพและรักษาช้างอย่างเต็มที่' },
          { title: 'ความปลอดภัย', desc: 'กิจกรรมที่ไม่ทำร้ายสัตว์' },
          { title: 'การศึกษา', desc: 'เรียนรู้เรื่องช้างและการอนุรักษ์' },
          { title: 'ความยั่งยืน', desc: 'บริการที่มีคุณภาพและเป็นมิตรกับสิ่งแวดล้อม' }
        ]
      },
      safety: {
        title: 'มาตรฐานความปลอดภัย',
        items: [
          'ไกด์ผู้เชี่ยวชาญที่ผ่านการอบรม',
          'มีอุปกรณ์ปฐมพยาบาลและการรักษาฉุกเฉิน',
          'สิ่งอำนวยความสะดวกและปลอดภัย',
          'ควบคุมกลุ่มเล็กและจำกัดจำนวนคน'
        ]
      },
      team: {
        title: 'ทีมงานของเรา',
        subtitle: 'ผู้เชี่ยวชาญและผู้ดูแลช้างที่มีประสบการณ์'
      }
    },
    en: {
      title: 'About Elephant Nature Sanctuary',
      subtitle: 'An elephant conservation center focused on ethical tourism',
      story: {
        title: 'Our Story',
        content: 'Elephant Nature Sanctuary was founded with the desire to create a safe place that respects the nature of elephants who have been abused and illegally used as labor. We believe that tourism should not be about controlling or exploiting animals, but should be about learning and respecting their nature.'
      },
      mission: {
        title: 'Our Mission',
        items: [
          'Allow elephants to live naturally and happily',
          'Create awareness in elephant conservation',
          'Promote ethical tourism',
          'Support local communities to participate'
        ]
      },
      values: {
        title: 'Our Core Values',
        items: [
          { title: 'Respect Nature', desc: 'Fully care for and protect elephants' },
          { title: 'Safety', desc: 'Activities that do not harm animals' },
          { title: 'Education', desc: 'Learn about elephants and conservation' },
          { title: 'Sustainability', desc: 'Quality service that is environmentally friendly' }
        ]
      },
      safety: {
        title: 'Safety Standards',
        items: [
          'Expert trained guides',
          'First aid equipment and emergency treatment',
          'Clean and safe facilities',
          'Small group control and limited numbers'
        ]
      },
      team: {
        title: 'Our Team',
        subtitle: 'Experienced elephant experts and caregivers'
      }
    },
    de: {
      title: 'Über das Elefanten-Naturschutzgebiet',
      subtitle: 'Ein Elefantenschutzzentrum mit Fokus auf ethischen Tourismus',
      story: {
        title: 'Unsere Geschichte',
        content: 'Das Elefanten-Naturschutzgebiet wurde mit dem Wunsch gegründet, einen sicheren Ort zu schaffen, der die Natur der Elefanten respektiert, die missbraucht und illegal als Arbeiter eingesetzt wurden. Wir glauben, dass Tourismus nicht darum gehen sollte, Tiere zu kontrollieren oder auszubeuten, sondern darum, ihre Natur zu lernen und zu respektieren.'
      },
      mission: {
        title: 'Unsere Mission',
        items: [
          'Elefanten ermöglichen, natürlich und glücklich zu leben',
          'Bewusstsein für Elefantenschutz schaffen',
          'Ethischen Tourismus fördern',
          'Lokale Gemeinschaften zur Teilnahme unterstützen'
        ]
      },
      values: {
        title: 'Unsere Grundwerte',
        items: [
          { title: 'Natur respektieren', desc: 'Elefanten vollständig pflegen und schützen' },
          { title: 'Sicherheit', desc: 'Aktivitäten, die Tieren nicht schaden' },
          { title: 'Bildung', desc: 'Über Elefanten und Naturschutz lernen' },
          { title: 'Nachhaltigkeit', desc: 'Qualitätsservice, der umweltfreundlich ist' }
        ]
      },
      safety: {
        title: 'Sicherheitsstandards',
        items: [
          'Ausgebildete Expertenführer',
          'Erste-Hilfe-Ausrüstung und Notfallbehandlung',
          'Saubere und sichere Einrichtungen',
          'Kleine Gruppenkontrolle und begrenzte Teilnehmerzahl'
        ]
      },
      team: {
        title: 'Unser Team',
        subtitle: 'Erfahrene Elefantenexperten und Pfleger'
      }
    },
    cn: {
      title: '关于大象自然保护区',
      subtitle: '专注于道德旅游的大象保护中心',
      story: {
        title: '我们的故事',
        content: '大象自然保护区的建立是为了创建一个安全的地方，尊重那些曾被虐待和非法用作劳动力的大象的天性。我们相信旅游不应该是控制或剥削动物，而应该是学习和尊重它们的天性。'
      },
      mission: {
        title: '我们的使命',
        items: [
          '让大象自然快乐地生活',
          '提高大象保护意识',
          '促进道德旅游',
          '支持当地社区参与'
        ]
      },
      values: {
        title: '我们的核心价值观',
        items: [
          { title: '尊重自然', desc: '全面关爱和保护大象' },
          { title: '安全', desc: '不伤害动物的活动' },
          { title: '教育', desc: '学习大象和保护知识' },
          { title: '可持续性', desc: '环保的优质服务' }
        ]
      },
      safety: {
        title: '安全标准',
        items: [
          '经过培训的专业导游',
          '急救设备和紧急治疗',
          '清洁安全的设施',
          '小组控制和限制人数'
        ]
      },
      team: {
        title: '我们的团队',
        subtitle: '经验丰富的大象专家和护理员'
      }
    },
    fr: {
      title: 'À propos du Sanctuaire Nature des Éléphants',
      subtitle: 'Un centre de conservation des éléphants axé sur le tourisme éthique',
      story: {
        title: 'Notre Histoire',
        content: 'Le Sanctuaire Nature des Éléphants a été fondé avec le désir de créer un lieu sûr qui respecte la nature des éléphants qui ont été maltraités et utilisés illégalement comme main-d\'œuvre. Nous croyons que le tourisme ne devrait pas consister à contrôler ou exploiter les animaux, mais à apprendre et respecter leur nature.'
      },
      mission: {
        title: 'Notre Mission',
        items: [
          'Permettre aux éléphants de vivre naturellement et heureusement',
          'Créer une prise de conscience dans la conservation des éléphants',
          'Promouvoir le tourisme éthique',
          'Soutenir les communautés locales pour participer'
        ]
      },
      values: {
        title: 'Nos Valeurs Fondamentales',
        items: [
          { title: 'Respecter la Nature', desc: 'Prendre soin et protéger entièrement les éléphants' },
          { title: 'Sécurité', desc: 'Activités qui ne nuisent pas aux animaux' },
          { title: 'Éducation', desc: 'Apprendre sur les éléphants et la conservation' },
          { title: 'Durabilité', desc: 'Service de qualité respectueux de l\'environnement' }
        ]
      },
      safety: {
        title: 'Normes de Sécurité',
        items: [
          'Guides experts formés',
          'Équipement de premiers secours et traitement d\'urgence',
          'Installations propres et sûres',
          'Contrôle de petits groupes et nombre limité'
        ]
      },
      team: {
        title: 'Notre Équipe',
        subtitle: 'Experts en éléphants et soignants expérimentés'
      }
    }
  }

  const currentContent = content[currentLang as keyof typeof content] || content.en

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-green-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {currentContent.title}
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {currentContent.story.title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentContent.story.content}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-green-100 rounded-lg p-8">
              <div className="text-6xl mb-4 text-center">🐘</div>
              <h3 className="text-xl font-semibold text-center mb-4">
                {currentLang === 'th' ? 'ช้างในความดูแล' : 'Elephants in Our Care'}
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">8</div>
                <div className="text-gray-600">
                  {currentLang === 'th' ? 'ช้างในความดูแล' : 'Rescued Elephants'}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-100 rounded-lg p-8">
              <div className="text-6xl mb-4 text-center">🌳</div>
              <h3 className="text-xl font-semibold text-center mb-4">
                {currentLang === 'th' ? 'พื้นที่อนุรักษ์' : 'Conservation Area'}
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50</div>
                <div className="text-gray-600">
                  {currentLang === 'th' ? 'ไร่' : 'Acres'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {currentContent.mission.title}
              </h2>
              <ul className="space-y-4">
                {currentContent.mission.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Values */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {currentContent.values.title}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {currentContent.values.items.map((value, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {value.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Standards */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {currentContent.safety.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {currentContent.safety.items.map((item, index) => (
              <div key={index} className="flex items-center p-4 bg-green-50 rounded-lg">
                <span className="text-green-600 text-xl mr-4">🛡️</span>
                <span className="text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {currentLang === 'th' 
              ? 'พร้อมเข้าร่วมกับเราแล้วหรือยัง?' 
              : 'Ready to Join Us?'}
          </h2>
          <p className="text-xl mb-8 text-green-100">
            {currentLang === 'th'
              ? 'จองทัวร์ช้างธรรมชาติและมาเป็นส่วนหนึ่งในการอนุรักษ์ช้าง'
              : 'Book your ethical elephant tour and become part of elephant conservation'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg"
            >
              {currentLang === 'th' ? 'ดูโปรแกรมทัวร์' : 'View Tour Packages'}
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="bg-yellow-500 text-green-800 hover:bg-yellow-400 px-8 py-4 text-lg font-semibold"
            >
              {currentLang === 'th' ? 'ติดต่อเรา' : 'Contact Us'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}