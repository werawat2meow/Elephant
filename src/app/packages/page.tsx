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
      name: currentLang === 'th' ? 'ช้างธรรมชาติ' : 'Elephant Nature',
      duration: '3 hours',
      badge: currentLang === 'th' ? 'เหมาะกับครอบครัว' : 'Suitable for Family',
      badgeColor: 'bg-yellow-500',
      price: { adult: 2700, child: 1500 },
      image: '/api/placeholder/400/300',
      activities: currentLang === 'th' 
        ? ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรมช้าง', 'สาธิตการทำอาหารไทย', 'สาธิตการทำกะทิ', 'รับประทานอาหารท่ามกลางธรรมชาติ']
        : ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Thai cooking demonstration', 'Coconut milk demonstration', 'Lunch/dinner in nature'],
      times: ['9:00 AM', '2:00 PM'],
      category: 'premium',
      popular: true
    },
    {
      id: 2,
      name: currentLang === 'th' ? 'เดินเล่น ป้อนอาหาร' : 'Walk & Feed',
      duration: '1.5 hours',
      badge: currentLang === 'th' ? 'ได้รับความนิยมสูงสุด' : 'Most Enjoyable',
      badgeColor: 'bg-green-500',
      price: { adult: 1600, child: 1000 },
      image: '/api/placeholder/400/300',
      activities: currentLang === 'th'
        ? ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรมช้าง', 'เตรียมอาหารช้าง (ผลไม้ผสมข้าว)']
        : ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Prepare elephant meal (fruit with rice)'],
      times: ['9:00 AM', '11:00 AM', '2:00 PM'],
      category: 'standard',
      popular: true
    },
    {
      id: 3,
      name: currentLang === 'th' ? 'มินิช้างธรรมชาติ' : 'Mini Elephant Nature',
      duration: '1.5 hours', 
      badge: currentLang === 'th' ? 'ตัวเลือกที่เป็นมิตร' : 'Friendly Choice',
      badgeColor: 'bg-blue-500',
      price: { adult: 1400, child: 800 },
      image: '/api/placeholder/400/300',
      activities: currentLang === 'th'
        ? ['ป้อนอาหารช้าง', 'ถ่ายภาพกับช้าง', 'เรียนรู้พฤติกรรมช้าง', 'สาธิตการเคาะยาง', 'สาธิตการทำแผ่นยาง']
        : ['Feeding elephants', 'Taking photos with elephants', 'Learning elephant behaviors', 'Rubber tapping demonstration', 'Rubber sheet making demonstration'],
      times: ['9:00 AM', '11:00 AM', '2:00 PM'],
      category: 'budget',
      popular: false
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
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentContent.title}
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
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