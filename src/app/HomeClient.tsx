'use client'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import PackageCard from '../components/PackageCard'
import ReviewCard from '../components/ReviewCard'
import Button from '../components/Button'

export default function Home() {
  const { currentLang } = useLanguage()

  const content = {
    th: {
      hero: {
        title: 'ประสบการณ์ช้างธรรมชาติ',
        subtitle: 'ที่เคารพและรักษาสวัสดิภาพช้าง',
        description: 'เข้าร่วมทัวร์ช้างเชิงอนุรักษ์ ป้อนอาหาร สังเกตพฤติกรรมธรรมชาติ และสนับสนุนงานอนุรักษ์ช้างไทย',
        cta: 'จองทัวร์ตอนนี้'
      },
      features: {
        title: 'ทำไมต้องเลือกเรา',
        items: [
          { icon: '🐘', title: 'การท่องเที่ยวเชิงอนุรักษ์', desc: 'ไม่มีการขี่ช้างหรือแสดงที่ทำร้ายสัตว์' },
          { icon: '🌿', title: 'เรียนรู้ธรรมชาติ', desc: 'เข้าใจพฤติกรรมและวิถีชีวิตช้างในธรรมชาติ' },
          { icon: '👨‍👩‍👧‍👦', title: 'เหมาะกับครอบครัว', desc: 'กิจกรรมปลอดภัยสำหรับทุกวัย' },
          { icon: '💚', title: 'สนับสนุนการอนุรักษ์', desc: 'ส่วนหนึ่งจากค่าทัวร์ไปสู่การดูแลช้าง' }
        ]
      },
      packages: {
        title: 'โปรแกรมทัวร์ยอดนิยม',
        subtitle: 'เลือกประสบการณ์ที่เหมาะกับคุณ'
      },
      reviews: {
        title: 'รีวิวจากลูกค้า',
        subtitle: 'ประสบการณ์ที่น่าประทับใจจากผู้ที่เคยมาเยือน'
      }
    },
    en: {
      hero: {
        title: 'Authentic Elephant Experience',
        subtitle: 'Respecting and Caring for Elephant Welfare',
        description: 'Join our ethical elephant tours, feed elephants, observe natural behaviors, and support Thai elephant conservation efforts',
        cta: 'Book Your Tour'
      },
      features: {
        title: 'Why Choose Us',
        items: [
          { icon: '🐘', title: 'Ethical Tourism', desc: 'No elephant riding or harmful shows' },
          { icon: '🌿', title: 'Learn Nature', desc: 'Understand elephant behavior and natural lifestyle' },
          { icon: '👨‍👩‍👧‍👦', title: 'Family Friendly', desc: 'Safe activities for all ages' },
          { icon: '💚', title: 'Support Conservation', desc: 'Part of tour fees go to elephant care' }
        ]
      },
      packages: {
        title: 'Popular Tour Packages',
        subtitle: 'Choose the experience that suits you'
      },
      reviews: {
        title: 'Customer Reviews',
        subtitle: 'Memorable experiences from our visitors'
      }
    },
    de: {
      hero: {
        title: 'Authentisches Elefanten-Erlebnis',
        subtitle: 'Respekt und Fürsorge für das Wohlbefinden der Elefanten',
        description: 'Nehmen Sie an unseren ethischen Elefantentouren teil, füttern Sie Elefanten, beobachten Sie natürliche Verhaltensweisen und unterstützen Sie die thailändischen Elefantenschutzbemühungen',
        cta: 'Tour buchen'
      },
      features: {
        title: 'Warum uns wählen',
        items: [
          { icon: '🐘', title: 'Ethischer Tourismus', desc: 'Kein Elefantenreiten oder schädliche Shows' },
          { icon: '🌿', title: 'Natur lernen', desc: 'Verstehen Sie Elefantenverhalten und natürlichen Lebensstil' },
          { icon: '👨‍👩‍👧‍👦', title: 'Familienfreundlich', desc: 'Sichere Aktivitäten für alle Altersgruppen' },
          { icon: '💚', title: 'Naturschutz unterstützen', desc: 'Teil der Tourgebühren fließt in die Elefantenpflege' }
        ]
      },
      packages: {
        title: 'Beliebte Tourpakete',
        subtitle: 'Wählen Sie das Erlebnis, das zu Ihnen passt'
      },
      reviews: {
        title: 'Kundenbewertungen',
        subtitle: 'Unvergessliche Erfahrungen unserer Besucher'
      }
    },
    cn: {
      hero: {
        title: '正宗大象体验',
        subtitle: '尊重和关爱大象的福利',
        description: '参加我们的道德大象之旅，喂养大象，观察自然行为，支持泰国大象保护工作',
        cta: '立即预订'
      },
      features: {
        title: '为什么选择我们',
        items: [
          { icon: '🐘', title: '道德旅游', desc: '不骑大象或有害表演' },
          { icon: '🌿', title: '学习自然', desc: '了解大象行为和自然生活方式' },
          { icon: '👨‍👩‍👧‍👦', title: '家庭友好', desc: '适合所有年龄的安全活动' },
          { icon: '💚', title: '支持保护', desc: '部分旅游费用用于大象护理' }
        ]
      },
      packages: {
        title: '热门旅游套餐',
        subtitle: '选择适合您的体验'
      },
      reviews: {
        title: '客户评价',
        subtitle: '来自游客的难忘体验'
      }
    },
    fr: {
      hero: {
        title: 'Expérience Authentique des Éléphants',
        subtitle: 'Respecter et Prendre Soin du Bien-être des Éléphants',
        description: 'Rejoignez nos circuits éthiques d\'éléphants, nourrissez les éléphants, observez les comportements naturels et soutenez les efforts de conservation des éléphants thaïlandais',
        cta: 'Réservez votre Circuit'
      },
      features: {
        title: 'Pourquoi Nous Choisir',
        items: [
          { icon: '🐘', title: 'Tourisme Éthique', desc: 'Pas de monte d\'éléphant ou de spectacles nuisibles' },
          { icon: '🌿', title: 'Apprendre la Nature', desc: 'Comprendre le comportement des éléphants et leur mode de vie naturel' },
          { icon: '👨‍👩‍👧‍👦', title: 'Convivial pour Familles', desc: 'Activités sûres pour tous les âges' },
          { icon: '💚', title: 'Soutenir la Conservation', desc: 'Une partie des frais de circuit va aux soins des éléphants' }
        ]
      },
      packages: {
        title: 'Forfaits Circuit Populaires',
        subtitle: 'Choisissez l\'expérience qui vous convient'
      },
      reviews: {
        title: 'Avis Clients',
        subtitle: 'Expériences mémorables de nos visiteurs'
      }
    }
  }

  const currentContent = content[currentLang as keyof typeof content] || content.en

  const getPackageName = (packageId: number): string => {
    const names = {
      1: {
        th: 'ช้างธรรมชาติ',
        en: 'Elephant Nature',
        de: 'Elefanten Natur',
        cn: '大象自然',
        fr: 'Nature des Éléphants'
      },
      2: {
        th: 'เดินเล่น ป้อนอาหาร',
        en: 'Walk & Feed',
        de: 'Spazieren & Füttern',
        cn: '散步喂食',
        fr: 'Marcher et Nourrir'
      },
      3: {
        th: 'มินิช้างธรรมชาติ',
        en: 'Mini Elephant Nature',
        de: 'Mini Elefanten Natur',
        cn: '迷你大象自然',
        fr: 'Mini Nature des Éléphants'
      }
    }
    return names[packageId as keyof typeof names]?.[currentLang as keyof typeof names[1]] || names[packageId as keyof typeof names]?.en || ''
  }

  const getPackageBadge = (packageId: number): string => {
    const badges = {
      1: {
        th: 'เหมาะกับครอบครัว',
        en: 'Suitable for Family',
        de: 'Für Familien geeignet',
        cn: '适合家庭',
        fr: 'Convient aux Familles'
      },
      2: {
        th: 'ได้รับความนิยมสูงสุด',
        en: 'Most Enjoyable',
        de: 'Am Beliebtesten',
        cn: '最受欢迎',
        fr: 'Le Plus Apprécié'
      },
      3: {
        th: 'ตัวเลือกที่เป็นมิตร',
        en: 'Friendly Choice',
        de: 'Freundliche Wahl',
        cn: '友好选择',
        fr: 'Choix Convivial'
      }
    }
    return badges[packageId as keyof typeof badges]?.[currentLang as keyof typeof badges[1]] || badges[packageId as keyof typeof badges]?.en || ''
  }

  const getPackageActivities = (packageId: number): string[] => {
    const activities = {
      1: {
        th: ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรมช้าง', 'สาธิตการทำอาหารไทย', 'สาธิตการทำกะทิ', 'รับประทานอาหารท่ามกลางธรรมชาติ'],
        en: ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Thai cooking demonstration', 'Coconut milk demonstration', 'Lunch/dinner in nature'],
        de: ['Elefanten füttern', 'Fotos mit Elefanten', 'Elefantenverhalten lernen', 'Thai-Kochvorführung', 'Kokosmilch-Demonstration', 'Mittagessen in der Natur'],
        cn: ['喂养大象', '与大象合影', '学习大象行为', '泰式烹饪表演', '椰奶制作演示', '自然中用餐'],
        fr: ['Nourrir les éléphants', 'Photos avec éléphants', 'Apprendre comportement éléphants', 'Démonstration cuisine thaï', 'Démonstration lait de coco', 'Déjeuner/dîner dans nature']
      },
      2: {
        th: ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรมช้าง', 'เตรียมอาหารช้าง (ผลไม้ผสมข้าว)'],
        en: ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Prepare elephant meal (fruit with rice)'],
        de: ['Elefanten füttern', 'Fotos mit Elefanten', 'Elefantenverhalten lernen', 'Elefantenessen vorbereiten (Obst mit Reis)'],
        cn: ['喂养大象', '与大象合影', '学习大象行为', '准备大象餐食（水果配米饭）'],
        fr: ['Nourrir les éléphants', 'Photos avec éléphants', 'Apprendre comportement éléphants', 'Préparer repas éléphants (fruits avec riz)']
      },
      3: {
        th: ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรมช้าง', 'สาธิตการเคาะยาง', 'สาธิตการทำแผ่นยาง'],
        en: ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Rubber tapping demonstration', 'Rubber sheet making demonstration'],
        de: ['Elefanten füttern', 'Fotos mit Elefanten', 'Elefantenverhalten lernen', 'Gummi-Zapfvorführung', 'Gummiplatten-Herstellung'],
        cn: ['喂养大象', '与大象合影', '学习大象行为', '割胶演示', '橡胶片制作演示'],
        fr: ['Nourrir les éléphants', 'Photos avec éléphants', 'Apprendre comportement éléphants', 'Démonstration saignée caoutchouc', 'Fabrication feuilles caoutchouc']
      }
    }
    return activities[packageId as keyof typeof activities]?.[currentLang as keyof typeof activities[1]] || activities[packageId as keyof typeof activities]?.en || []
  }

  const packages = [
    {
      id: 1,
      name: getPackageName(1),
      duration: '3 hours',
      badge: getPackageBadge(1),
      badgeColor: 'bg-yellow-500',
      price: { adult: 2700, child: 1500 },
      image: '/images/elephants/packages/packtwo.jpg',
      activities: getPackageActivities(1),
      times: ['9:00 AM', '2:00 PM']
    },
    {
      id: 2,
      name: getPackageName(2),
      duration: '1.5 hours',
      badge: getPackageBadge(2),
      badgeColor: 'bg-green-500',
      price: { adult: 1600, child: 1000 },
      image: '/images/elephants/packages/packtwo.jpg',
      activities: getPackageActivities(2),
      times: ['9:00 AM', '11:00 AM', '2:00 PM']
    },
    {
      id: 3,
      name: getPackageName(3),
      duration: '1.5 hours', 
      badge: getPackageBadge(3),
      badgeColor: 'bg-blue-500',
      price: { adult: 1400, child: 800 },
      image: '/images/elephants/packages/packtree.jpg',
      activities: getPackageActivities(3),
      times: ['9:00 AM', '11:00 AM', '2:00 PM']
    }
  ]

  const getCountryName = (country: string): string => {
    const countries = {
      'United States': {
        th: 'สหรัฐอเมริกา',
        en: 'United States',
        de: 'Vereinigte Staaten',
        cn: '美国',
        fr: 'États-Unis'
      },
      'Germany': {
        th: 'เยอรมัน',
        en: 'Germany', 
        de: 'Deutschland',
        cn: '德国',
        fr: 'Allemagne'
      },
      'Japan': {
        th: 'ญี่ปุ่น',
        en: 'Japan',
        de: 'Japan',
        cn: '日本',
        fr: 'Japon'
      },
      'France': {
        th: 'ฝรั่งเศส',
        en: 'France',
        de: 'Frankreich',
        cn: '法国',
        fr: 'France'
      }
    }
    return countries[country as keyof typeof countries]?.[currentLang as keyof typeof countries['United States']] || country
  }

  const getReviewComment = (reviewId: number): string => {
    const comments = {
      1: {
        th: 'ประสบการณ์ที่วิเศษมาก! ช้างดูมีความสุขและแข็งแรง การได้ป้อนอาหารและเรียนรู้เกี่ยวกับช้างทำให้รู้สึกประทับใจมาก',
        en: 'Amazing experience! The elephants looked so happy and healthy. Feeding them and learning about their behaviors was truly touching.',
        de: 'Erstaunliche Erfahrung! Die Elefanten sahen so glücklich und gesund aus. Sie zu füttern und über ihr Verhalten zu lernen war wirklich berührend.',
        cn: '太棒的体验！大象看起来如此快乐和健康。喂养它们并了解它们的行为真是令人感动。',
        fr: 'Expérience incroyable ! Les éléphants avaient l\'air si heureux et en bonne santé. Les nourrir et apprendre sur leurs comportements était vraiment touchant.'
      },
      2: {
        th: 'ทัวร์ที่ยอดเยี่ยม! ไกด์มีความรู้มาก และชอบแนวคิดการท่องเที่ยวเชิงอนุรักษ์ ไม่มีการขี่ช้าง เป็นการเคารพสัตว์อย่างแท้จริง',
        en: 'Excellent tour! Very knowledgeable guides and I love the ethical approach. No elephant riding, just pure respect for these magnificent animals.',
        de: 'Ausgezeichnete Tour! Sehr sachkundige Führer und ich liebe den ethischen Ansatz. Kein Elefantenreiten, nur purer Respekt für diese großartigen Tiere.',
        cn: '出色的旅行！导游很有知识，我喜欢这种道德方式。不骑大象，只是对这些宏伟动物的纯粹尊重。',
        fr: 'Excellente visite ! Guides très compétents et j\'adore l\'approche éthique. Pas de monte d\'éléphant, juste un pur respect pour ces animaux magnifiques.'
      },
      3: {
        th: 'ครอบครัวเราประทับใจมาก โดยเฉพาะลูกๆ ที่ตื่นเต้นมากกับการทำอาหารให้ช้าง กิจกรรมปลอดภัยและมีการศึกษา',
        en: 'Our family was so impressed! Especially our kids who were excited about making food for elephants. Safe and educational activities.',
        de: 'Unsere Familie war so beeindruckt! Besonders unsere Kinder, die begeistert davon waren, Futter für die Elefanten zu machen. Sichere und lehrreiche Aktivitäten.',
        cn: '我们全家都印象深刻！特别是我们的孩子们，他们对为大象制作食物感到兴奋。安全且有教育意义的活动。',
        fr: 'Notre famille était si impressionnée ! Surtout nos enfants qui étaient excités de préparer de la nourriture pour les éléphants. Activités sûres et éducatives.'
      },
      4: {
        th: 'ประสบการณ์ที่น่าจดจำ พนักงานเป็นมิตรและดูแลดี แนะนำให้มาแต่เช้าเพราะช้างจะกระฉับกระเฉงกว่า',
        en: 'Memorable experience! Staff was friendly and caring. I recommend coming in the morning when elephants are more active.',
        de: 'Unvergessliche Erfahrung! Das Personal war freundlich und fürsorglich. Ich empfehle, am Morgen zu kommen, wenn die Elefanten aktiver sind.',
        cn: '难忘的经历！工作人员友好且细心。我建议早上来，那时大象更活跃。',
        fr: 'Expérience mémorable ! Le personnel était amical et attentionné. Je recommande de venir le matin quand les éléphants sont plus actifs.'
      }
    }
    return comments[reviewId as keyof typeof comments]?.[currentLang as keyof typeof comments[1]] || comments[reviewId as keyof typeof comments]?.en || ''
  }

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      country: getCountryName('United States'),
      rating: 5,
      comment: getReviewComment(1),
      date: '2024-10-15'
    },
    {
      id: 2,
      name: 'Hans Mueller',
      country: getCountryName('Germany'),
      rating: 5,
      comment: getReviewComment(2),
      date: '2024-11-01'
    },
    {
      id: 3,
      name: 'Tanaka Yuki',
      country: getCountryName('Japan'),
      rating: 5,
      comment: getReviewComment(3),
      date: '2024-10-28'
    },
    {
      id: 4,
      name: 'Marie Dubois',
      country: getCountryName('France'),
      rating: 4,
      comment: getReviewComment(4),
      date: '2024-11-05'
    },
    {
      id: 5,
      name: 'นิรันดร์ วงศ์ใส',
      country: currentLang === 'th' ? 'ไทย' : 'Thailand',
      rating: 5,
      comment: currentLang === 'th'
        ? 'ภูมิใจที่เมืองไทยมีสถานที่ดีๆ แบบนี้ เป็นแหล่งท่องเที่ยวที่ดีสำหรับคนไทยและต่างชาติ การอนุรักษ์ช้างทำได้ดีมาก'
        : 'Proud that Thailand has such wonderful places. Great tourist destination for both Thais and foreigners. Elephant conservation is excellent.',
      date: '2024-10-20'
    }
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section 
        className="relative bg-green-600 text-white py-16 h-[70vh] flex items-center bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: "url('/images/elephants/hero/banner.jpg')"}}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {currentContent.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-green-100">
              {currentContent.hero.subtitle}
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto text-green-50">
              {currentContent.hero.description}
            </p>
            <Link href="/booking">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white font-semibold px-8 py-4 text-lg shadow-lg transition-all duration-300"
              >
                {currentContent.hero.cta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {currentContent.features.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.features.items.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {currentContent.packages.title}
            </h2>
            <p className="text-xl text-gray-600">
              {currentContent.packages.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                currentLang={currentLang}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              variant="primary"
              size="lg"
              className="shadow-lg"
              onClick={() => window.location.href = '/packages'}
            >
              {currentLang === 'th' ? 'ดูแพ็คเกจทั้งหมด' : 'View All Packages'}
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {currentContent.reviews.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentContent.reviews.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.slice(0, 0).map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentLang={currentLang}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white font-medium px-6 py-3 shadow-md transition-all duration-200"
            >
              {currentLang === 'th' ? 'ดูรีวิวทั้งหมด' : 'View All Reviews'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
