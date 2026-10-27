'use client'
import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import PackageCard from '../../components/PackageCard'
import PackageFilter from '../../components/PackageFilter'

export default function PackagesPage() {
  const { currentLang } = useLanguage()
  const [filters, setFilters] = useState({
    priceRange: 'all',
    duration: 'all',
    sortBy: 'popular'
  })

  const content = {
    th: {
      title: 'โปรแกรมทัวร์ทั้งหมด',
      subtitle: 'เลือกประสบการณ์ช้างธรรมชาติที่เหมาะกับคุณ',
      results: 'ผลการค้นหา',
      noResults: 'ไม่พบโปรแกรมที่ตรงกับเงื่อนไขการค้นหา'
    },
    en: {
      title: 'All Tour Packages',
      subtitle: 'Choose your perfect ethical elephant experience',
      results: 'Search Results',
      noResults: 'No packages found matching your search criteria'
    },
    de: {
      title: 'Alle Tourpakete',
      subtitle: 'Wählen Sie Ihr perfektes ethisches Elefantenerlebnis',
      results: 'Suchergebnisse',
      noResults: 'Keine Pakete gefunden, die Ihren Suchkriterien entsprechen'
    },
    cn: {
      title: '所有旅游套餐',
      subtitle: '选择您完美的道德大象体验',
      results: '搜索结果',
      noResults: '未找到符合您搜索条件的套餐'
    },
    fr: {
      title: 'Tous les Forfaits Circuit',
      subtitle: 'Choisissez votre expérience parfaite d\'éléphants éthiques',
      results: 'Résultats de recherche',
      noResults: 'Aucun forfait trouvé correspondant à vos critères de recherche'
    }
  }

  const currentContent = content[currentLang as keyof typeof content] || content.en

  const allPackages = [
    {
      id: 1,
      name: {
        th: 'ช้างธรรมชาติ',
        en: 'Elephant Nature',
        de: 'Elefanten Natur',
        cn: '大象自然',
        fr: 'Nature des éléphants'
      }[currentLang] || 'Elephant Nature',
      duration: '3 hours',
      badge: {
        th: 'เหมาะกับครอบครัว',
        en: 'Suitable for Family',
        de: 'Für Familien geeignet',
        cn: '适合家庭',
        fr: 'Adapté aux familles'
      }[currentLang] || 'Suitable for Family',
      badgeColor: 'bg-yellow-500',
      price: { adult: 2700, child: 1500 },
      image: '/images/elephants/packages/packone.jpg',
      activities: {
        th: ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรมช้าง', 'สาธิตการทำอาหารไทย', 'สาธิตการทำกะทิ', 'รับประทานอาหารท่ามกลางธรรมชาติ'],
        en: ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Thai cooking demonstration', 'Coconut milk demonstration', 'Lunch/dinner in nature'],
        de: ['Elefanten füttern', 'Fotos mit Elefanten', 'Verhalten lernen', 'Thailändische Kochvorführung', 'Kokosmilchvorführung', 'Essen in der Natur'],
        cn: ['喂大象', '与大象合影', '学习行为', '泰国烹饪演示', '椰奶演示', '在自然中用餐'],
        fr: ['Nourrir les éléphants', 'Photos avec éléphants', 'Apprendre comportements', 'Démonstration cuisine thaï', 'Démonstration lait de coco', 'Repas en pleine nature']
      }[currentLang] || ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Thai cooking demonstration', 'Coconut milk demonstration', 'Lunch/dinner in nature'],
      times: ['9:00 AM', '2:00 PM'],
      category: 'premium',
      popular: true
    },
    {
      id: 2,
      name: {
        th: 'เดินเล่น ป้อนอาหาร',
        en: 'Walk & Feed',
        de: 'Spaziergang & Füttern',
        cn: '散步与喂食',
        fr: 'Promenade & Nourrissage'
      }[currentLang] || 'Walk & Feed',
      duration: '1.5 hours',
      badge: {
        th: 'ได้รับความนิยมสูงสุด',
        en: 'Most Enjoyable',
        de: 'Am beliebtesten',
        cn: '最受欢迎',
        fr: 'Le plus apprécié'
      }[currentLang] || 'Most Enjoyable',
      badgeColor: 'bg-green-500',
      price: { adult: 1600, child: 1000 },
      image: '/images/elephants/packages/packtwo.jpg',
      activities: {
        th: ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรมช้าง', 'เตรียมอาหารช้าง (ผลไม้ผสมข้าว)'],
        en: ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Prepare elephant meal (fruit with rice)'],
        de: ['Elefanten füttern', 'Fotos mit Elefanten', 'Verhalten lernen', 'Elefantenmahlzeit zubereiten (Obst mit Reis)'],
        cn: ['喂大象', '与大象合影', '学习行为', '准备大象餐（水果加米饭）'],
        fr: ['Nourrir les éléphants', 'Photos avec éléphants', 'Apprendre comportements', 'Préparer repas éléphant (fruit avec riz)']
      }[currentLang] || ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Prepare elephant meal (fruit with rice)'],
      times: ['9:00 AM', '2:00 PM'],
      category: 'standard',
      popular: true
    },
    {
      id: 3,
      name: {
        th: 'มินิช้างธรรมชาติ',
        en: 'Mini Elephant Nature',
        de: 'Mini Elefanten Natur',
        cn: '迷你大象自然',
        fr: 'Mini Nature des éléphants'
      }[currentLang] || 'Mini Elephant Nature',
      duration: '1.5 hours',
      badge: {
        th: 'ตัวเลือกที่เป็นมิตร',
        en: 'Friendly Choice',
        de: 'Freundliche Wahl',
        cn: '友好选择',
        fr: 'Choix convivial'
      }[currentLang] || 'Friendly Choice',
      badgeColor: 'bg-blue-500',
      price: { adult: 1400, child: 800 },
      image: '/images/elephants/packages/packtree.jpg',
      activities: {
        th: ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรมช้าง', 'สาธิตการเคาะยาง', 'สาธิตการทำแผ่นยาง'],
        en: ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Rubber tapping demonstration', 'Rubber sheet making demonstration'],
        de: ['Elefanten füttern', 'Fotos mit Elefanten', 'Verhalten lernen', 'Gummizapfen-Demonstration', 'Gummiplattenherstellung'],
        cn: ['喂大象', '与大象合影', '学习行为', '橡胶敲击演示', '橡胶片制作演示'],
        fr: ['Nourrir les éléphants', 'Photos avec éléphants', 'Apprendre comportements', 'Démonstration de saignée du caoutchouc', 'Démonstration de fabrication de feuilles de caoutchouc']
      }[currentLang] || ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Rubber tapping demonstration', 'Rubber sheet making demonstration'],
      times: ['9:00 AM', '11:00 AM', '2:00 PM'],
      category: 'budget',
      popular: false
    },
    // Cooking Class BK1
    {
      id: 4,
      name: {
        th: 'คลาสทำอาหารไทย & ป้อนกล้วย',
        en: 'Traditional Thai Cooking Class & Feed Me Bananas',
        de: 'Traditioneller Thai-Kochkurs & Bananen füttern',
        cn: '传统泰式烹饪课和喂香蕉',
        fr: 'Cours de cuisine thaïe traditionnelle & Donne-moi des bananes'
      }[currentLang] || 'Traditional Thai Cooking Class & Feed Me Bananas',
      duration: '3:30 - 4:30 hrs.',
      badge: {
        th: 'ทำอาหารไทย + ป้อนช้าง',
        en: 'Thai Cooking + Feed Elephants',
        de: 'Thai-Kochkurs + Elefanten füttern',
        cn: '泰式烹饪+喂大象',
        fr: 'Cuisine thaïe + Nourrir les éléphants'
      }[currentLang] || 'Thai Cooking + Feed Elephants',
      badgeColor: 'bg-orange-500',
      price: { adult: 2750, child: 1550 },
      image: '/images/elephants/packages/packfour.jpg',
      activities: {
        th: [
          'เครื่องดื่มต้อนรับชาไทย/กาแฟ',
          'ป้อนกล้วยหรือแตงโมให้ช้าง',
          'เรียนรู้การทำอาหารไทยกับครูผู้เชี่ยวชาญ',
          'เมนู: ต้มยำกุ้ง, แกงเขียวหวาน, ผัดไทย',
          'รับประทานอาหารกลางธรรมชาติ'
        ],
        en: [
          'Welcoming drink with Thai tea & coffee',
          'Feed bananas or watermelon to elephants',
          'Learn Thai cooking with expert teacher',
          'Menu: Tom Yum Kung, Green Curry, Pad Thai',
          'Enjoy lunch in beautiful scenery'
        ],
        de: [
          'Begrüßungsgetränk mit Thai-Tee/Kaffee',
          'Füttern Sie Elefanten mit Bananen oder Wassermelone',
          'Lernen Sie thailändisches Kochen mit Experten',
          'Menü: Tom Yum Kung, Grünes Curry, Pad Thai',
          'Genießen Sie das Mittagessen in schöner Umgebung'
        ],
        cn: [
          '泰茶/咖啡迎宾饮品',
          '给大象喂香蕉或西瓜',
          '与专家学习泰式烹饪',
          '菜单：冬阴功、青咖喱、泰式炒河粉',
          '在美丽风景中享用午餐'
        ],
        fr: [
          'Boisson de bienvenue avec thé thaï/café',
          'Nourrir les éléphants avec bananes ou pastèque',
          'Apprendre la cuisine thaïe avec un expert',
          'Menu : Tom Yum Kung, Curry vert, Pad Thaï',
          'Déjeuner dans un cadre magnifique'
        ]
      }[currentLang] || [
        'Welcoming drink with Thai tea & coffee',
        'Feed bananas or watermelon to elephants',
        'Learn Thai cooking with expert teacher',
        'Menu: Tom Yum Kung, Green Curry, Pad Thai',
        'Enjoy lunch in beautiful scenery'
      ],
      times: ['9:00 AM', '2:00 PM'],
      category: 'cooking',
      popular: true
    },
    // Cooking Class BK2
    {
      id: 5,
      name: {
        th: 'คลาสทำอาหารไทยพิเศษ & สำรวจช้าง',
        en: 'Exclusive Thai Cooking Class & Exploring Elephants',
        de: 'Exklusiver Thai-Kochkurs & Elefanten erkunden',
        cn: '独家泰式烹饪课和探索大象',
        fr: 'Cours de cuisine thaïe exclusif & Exploration des éléphants'
      }[currentLang] || 'Exclusive Thai Cooking Class & Exploring Elephants',
      duration: '5.00 - 6.00 hours',
      badge: {
        th: 'ทำอาหารไทย + สำรวจช้าง',
        en: 'Thai Cooking + Explore Elephants',
        de: 'Thai-Kochkurs + Elefanten erkunden',
        cn: '泰式烹饪+探索大象',
        fr: 'Cuisine thaïe + Explorer les éléphants'
      }[currentLang] || 'Thai Cooking + Explore Elephants',
      badgeColor: 'bg-orange-600',
      price: { adult: 3350, child: 1850 },
      image: '/images/elephants/packages/packfive.jpg',
      activities: {
        th: [
          'เครื่องดื่มต้อนรับชาไทย/กาแฟ',
          'ป้อนกล้วยให้ช้าง',
          'เรียนรู้วัฒนธรรมและการทำอาหารไทยกับครูผู้เชี่ยวชาญ',
          'เมนู: ต้มยำกุ้ง, แกงเขียวหวาน, ผัดไทย',
          'สังเกตพฤติกรรมช้าง',
          'รับประทานอาหารกลางธรรมชาติ'
        ],
        en: [
          'Welcoming drink with Thai tea & coffee',
          'Feed bananas to elephants',
          'Explore Thai cooking and culture with expert teacher',
          'Menu: Tom Yum Kung, Green Curry, Pad Thai',
          'Observe elephant behaviors',
          'Enjoy lunch in beautiful scenery'
        ],
        de: [
          'Begrüßungsgetränk mit Thai-Tee/Kaffee',
          'Füttern Sie Elefanten mit Bananen',
          'Entdecken Sie thailändische Küche und Kultur mit Experten',
          'Menü: Tom Yum Kung, Grünes Curry, Pad Thai',
          'Beobachten Sie das Verhalten der Elefanten',
          'Genießen Sie das Mittagessen in schöner Umgebung'
        ],
        cn: [
          '泰茶/咖啡迎宾饮品',
          '给大象喂香蕉',
          '与专家探索泰式烹饪和文化',
          '菜单：冬阴功、青咖喱、泰式炒河粉',
          '观察大象行为',
          '在美丽风景中享用午餐'
        ],
        fr: [
          'Boisson de bienvenue avec thé thaï/café',
          'Nourrir les éléphants avec bananes',
          'Explorer la cuisine et la culture thaïe avec un expert',
          'Menu : Tom Yum Kung, Curry vert, Pad Thaï',
          'Observer le comportement des éléphants',
          'Déjeuner dans un cadre magnifique'
        ]
      }[currentLang] || [
        'Welcoming drink with Thai tea & coffee',
        'Feed bananas to elephants',
        'Explore Thai cooking and culture with expert teacher',
        'Menu: Tom Yum Kung, Green Curry, Pad Thai',
        'Observe elephant behaviors',
        'Enjoy lunch in beautiful scenery'
      ],
      times: ['9:00 AM'],
      category: 'cooking',
      popular: true
    }
  ]

  const filterPackages = () => {
    let filtered = [...allPackages]

    // Filter by price range
    if (filters.priceRange !== 'all') {
      if (filters.priceRange === 'budget') {
        filtered = filtered.filter(pkg => pkg.price.adult < 1500)
      } else if (filters.priceRange === 'mid') {
        filtered = filtered.filter(pkg => pkg.price.adult >= 1500 && pkg.price.adult < 2000)
      } else if (filters.priceRange === 'premium') {
        filtered = filtered.filter(pkg => pkg.price.adult >= 2000)
      }
    }

    // Filter by duration
    if (filters.duration !== 'all') {
      if (filters.duration === 'short') {
        filtered = filtered.filter(pkg => pkg.duration.includes('1.5'))
      } else if (filters.duration === 'long') {
        filtered = filtered.filter(pkg => pkg.duration.includes('3'))
      }
    }

    // Sort
    if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => Number(b.popular) - Number(a.popular))
    } else if (filters.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price.adult - b.price.adult)
    } else if (filters.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price.adult - a.price.adult)
    }

    return filtered
  }

  const filteredPackages = filterPackages()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full">
        <img
          src="/images/elephants/hero/banner.jpg"
          alt="Elephant Banner"
          className="w-full h-[200px] md:h-[320px] object-cover object-center"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            {currentContent.title}
          </h1>
          <p className="text-xl max-w-3xl mx-auto drop-shadow">
            {currentContent.subtitle}
          </p>
        </div>
      </section>

      {/* Filter and Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1 mb-8 lg:mb-0">
              <PackageFilter 
                filters={filters}
                onFiltersChange={setFilters}
                currentLang={currentLang}
              />
            </div>

            {/* Packages Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentContent.results}
                </h2>
                <p className="text-gray-600">
                  {filteredPackages.length} {currentLang === 'th' ? 'โปรแกรม' : 'packages'}
                </p>
              </div>

              {filteredPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      package={pkg}
                      currentLang={currentLang}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🐘</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentContent.noResults}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {currentLang === 'th' 
                      ? 'ลองปรับเงื่อนไขการค้นหาของคุณ'
                      : 'Try adjusting your search criteria'}
                  </p>
                  <button
                    onClick={() => setFilters({ priceRange: 'all', duration: 'all', sortBy: 'popular' })}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {currentLang === 'th' ? 'ล้างตัวกรอง' : 'Clear Filters'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
