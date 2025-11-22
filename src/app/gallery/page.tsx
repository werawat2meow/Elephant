'use client'
import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

export default function GalleryPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [modalTitle, setModalTitle] = useState<string | null>(null);
  const { currentLang } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const content = {
    th: {
      title: 'แกลลอรี่ภาพ',
      subtitle: 'บันทึกช่วงเวลาอันแสนวิเศษกับช้าง',
      categories: {
        all: 'ทั้งหมด',
        feeding: 'ป้อนอาหาร',
        bathing: 'อาบน้ำธรรมชาติ',
        playing: 'เล่นกับช้าง',
        cooking: 'ทำอาหาร',
        family: 'ครอบครัว'
      }
    },
    en: {
      title: 'Photo Gallery',
      subtitle: 'Capture precious moments with elephants',
      categories: {
        all: 'All',
        feeding: 'Feeding Time',
        bathing: 'Natural Bathing',
        playing: 'Playing with Elephants',
        cooking: 'Cooking Activities',
        family: 'Family Fun'
      }
    },
    de: {
      title: 'Fotogalerie',
      subtitle: 'Kostbare Momente mit Elefanten festhalten',
      categories: {
        all: 'Alle',
        feeding: 'Fütterungszeit',
        bathing: 'Natürliches Baden',
        playing: 'Spielen mit Elefanten',
        cooking: 'Kochaktivitäten',
        family: 'Familienspaß'
      }
    },
    cn: {
      title: '照片画廊',
      subtitle: '捕捉与大象的珍贵时刻',
      categories: {
        all: '全部',
        feeding: '喂食时间',
        bathing: '自然洗浴',
        playing: '与大象玩耍',
        cooking: '烹饪活动',
        family: '家庭乐趣'
      }
    },
    fr: {
      title: 'Galerie Photos',
      subtitle: 'Capturer des moments précieux avec les éléphants',
      categories: {
        all: 'Tous',
        feeding: 'Heure de Nourrissage',
        bathing: 'Bain Naturel',
        playing: 'Jouer avec les Éléphants',
        cooking: 'Activités Culinaires',
        family: 'Plaisir Familial'
      }
    }
  }

  // ตั้งค่าเริ่มต้นภาษาเป็นไทย
  // ถ้า currentLang ไม่มีค่า ให้ใช้ 'th'
  const lang = currentLang || 'th';
  const currentContent = content[lang as keyof typeof content] || content.th

  const getGalleryItemTitle = (itemId: number): string => {
    const titles = {
      1: {
        th: 'ป้อนกล้วยให้ช้าง',
        en: 'Feeding bananas to elephants',
        de: 'Bananen an Elefanten füttern',
        cn: '喂大象香蕉',
        fr: 'Nourrir des bananes aux éléphants'
      },
      2: {
        th: 'ช้างอาบน้ำในลำธาร',
        en: 'Elephants bathing in stream',
        de: 'Elefanten baden im Bach',
        cn: '大象在溪流中洗澡',
        fr: 'Éléphants se baignant dans le ruisseau'
      },
      3: {
        th: 'เด็กๆ เล่นกับช้างน้อย',
        en: 'Children playing with baby elephant',
        de: 'Kinder spielen mit Baby-Elefant',
        cn: '孩子们与小象玩耍',
        fr: 'Enfants jouant avec bébé éléphant'
      },
      4: {
        th: 'เรียนทำกะทิ',
        en: 'Learning to make coconut milk',
        de: 'Kokosmilch-Herstellung lernen',
        cn: '学习制作椰奶',
        fr: 'Apprendre à faire du lait de coco'
      },
      5: {
        th: 'ครอบครัวถ่ายภาพร่วม',
        en: 'Family photo session',
        de: 'Familien-Fotosession',
        cn: '家庭拍照',
        fr: 'Séance photo famille'
      },
      6: {
        th: 'เตรียมอาหารช้าง',
        en: 'Preparing elephant food',
        de: 'Elefantenfutter vorbereiten',
        cn: '准备大象食物',
        fr: 'Préparer la nourriture des éléphants'
      },
      7: {
        th: 'ช้างแม่ลูกเล่นกับลูก',
        en: 'Mother elephant playing with calf',
        de: 'Elefantenmutter spielt mit Kalb',
        cn: '象妈妈与小象玩耍',
        fr: 'Mère éléphant jouant avec son petit'
      },
      8: {
        th: 'ช้างสเปรยน้ำใส่ตัว',
        en: 'Elephant splashing water',
        de: 'Elefant spritzt Wasser',
        cn: '大象溅水',
        fr: 'Éléphant éclaboussant l\'eau'
      },
      9: {
        th: 'สาธิตการทำน้ำผึ้ง',
        en: 'Honey making demonstration',
        de: 'Honig-Herstellungsdemonstration',
        cn: '蜂蜜制作演示',
        fr: 'Démonstration de fabrication de miel'
      }
    }
    return titles[itemId as keyof typeof titles]?.[currentLang as keyof typeof titles[1]] || titles[itemId as keyof typeof titles]?.en || ''
  }

  // Sample gallery data - in real app this would come from a database
  const galleryItems = [
    {
      id: 1,
      category: 'feeding',
      title: getGalleryItemTitle(1),
      image: '/images/elephants/gallery/elephant1.jpg'
    },
    {
      id: 2,
      category: 'bathing',
      title: getGalleryItemTitle(2),
      image: '/images/elephants/gallery/elephant6.jpg'
    },
    {
      id: 3,
      category: 'playing',
      title: getGalleryItemTitle(3),
      image: '/images/elephants/gallery/elephant2.jpg'
    },
    {
      id: 4,
      category: 'cooking',
      title: getGalleryItemTitle(4),
      image: '/images/elephants/gallery/elephant9.jpg'
    },
    {
      id: 5,
      category: 'family',
      title: getGalleryItemTitle(5),
      image: '/images/elephants/gallery/elephant4.jpg'
    },
    {
      id: 6,
      category: 'feeding',
      title: getGalleryItemTitle(6),
      image: '/images/elephants/gallery/elephant5.jpg'
    },
    {
      id: 7,
      category: 'playing',
      title: getGalleryItemTitle(7),
      image: '/images/elephants/gallery/elephant7.jpg'
    },
    {
      id: 8,
      category: 'bathing',
      title: getGalleryItemTitle(8),
      image: '/images/elephants/gallery/elephant3.jpg'
    },
    {
      id: 9,
      category: 'cooking',
      title: getGalleryItemTitle(9),
      image: '/images/elephants/gallery/elephant8.jpg'
    }
  ]

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

  const categories = Object.keys(currentContent.categories)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 flex items-center justify-center">
        <img
          src="/images/elephants/hero/banner.jpg"
          alt="Gallery Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-center w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow mb-4">
            {currentContent.title}
          </h1>
          <p className="text-xl text-green-50 drop-shadow">
            {currentContent.subtitle}
          </p>
        </div>
        <div className="absolute inset-0 bg-green-700/40" />
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 space-x-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {currentContent.categories[category as keyof typeof currentContent.categories]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredItems.length} {currentLang === 'th' ? 'รายการ' : 'photos'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => {
                  setModalImage(item.image);
                  setModalTitle(item.title);
                  setModalOpen(true);
                }}
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {currentContent.categories[item.category as keyof typeof currentContent.categories]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentLang === 'th' ? 'ไม่มีภาพในหมวดหมู่นี้' : 'No photos in this category'}
              </h3>
              <p className="text-gray-600">
                {currentLang === 'th' ? 'ลองเลือกหมวดหมู่อื่น' : 'Try selecting another category'}
              </p>
            </div>
          )}

          {/* Image Modal */}
          {modalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity"
              onClick={() => setModalOpen(false)}
            >
              <div
                className="relative bg-white rounded-xl shadow-2xl p-4 max-w-2xl w-full mx-4"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-green-600 text-2xl font-bold"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <img
                  src={modalImage ?? ''}
                  alt={modalTitle ?? ''}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 text-center">
                  {modalTitle}
                </h3>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}