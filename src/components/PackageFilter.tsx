interface PackageFilterProps {
  filters: {
    priceRange: string
    duration: string
    sortBy: string
  }
  onFiltersChange: (filters: any) => void
  currentLang: string
}

export default function PackageFilter({ filters, onFiltersChange, currentLang }: PackageFilterProps) {
  const content = {
    th: {
      filters: 'กรองตัวเลือก',
      priceRange: 'ช่วงราคา',
      duration: 'ระยะเวลา',
      sortBy: 'เรียงลำดับ',
      all: 'ทั้งหมด',
      budget: 'ประหยัด (ต่ำกว่า ฿1,500)',
      mid: 'ปานกลาง (฿1,500 - ฿2,000)',
      premium: 'พรีเมี่ยม (มากกว่า ฿2,000)',
      short: 'สั้น (1.5 ชั่วโมง)',
      long: 'ยาว (3 ชั่วโมง)',
      popular: 'ยอดนิยม',
      priceLow: 'ราคา: ต่ำไปสูง',
      priceHigh: 'ราคา: สูงไปต่ำ',
      clear: 'ล้างตัวกรอง'
    },
    en: {
      filters: 'Filters',
      priceRange: 'Price Range',
      duration: 'Duration',
      sortBy: 'Sort By',
      all: 'All',
      budget: 'Budget (Under ฿1,500)',
      mid: 'Mid-range (฿1,500 - ฿2,000)',
      premium: 'Premium (Over ฿2,000)',
      short: 'Short (1.5 hours)',
      long: 'Long (3 hours)',
      popular: 'Most Popular',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      clear: 'Clear Filters'
    },
    de: {
      filters: 'Filter',
      priceRange: 'Preisbereich',
      duration: 'Dauer',
      sortBy: 'Sortieren nach',
      all: 'Alle',
      budget: 'Budget (Unter ฿1,500)',
      mid: 'Mittelklasse (฿1,500 - ฿2,000)',
      premium: 'Premium (Über ฿2,000)',
      short: 'Kurz (1,5 Stunden)',
      long: 'Lang (3 Stunden)',
      popular: 'Am Beliebtesten',
      priceLow: 'Preis: Niedrig bis Hoch',
      priceHigh: 'Preis: Hoch bis Niedrig',
      clear: 'Filter löschen'
    },
    cn: {
      filters: '筛选',
      priceRange: '价格范围',
      duration: '持续时间',
      sortBy: '排序方式',
      all: '全部',
      budget: '经济型（低于฿1,500）',
      mid: '中等（฿1,500 - ฿2,000）',
      premium: '高端（超过฿2,000）',
      short: '短程（1.5小时）',
      long: '长程（3小时）',
      popular: '最受欢迎',
      priceLow: '价格：低到高',
      priceHigh: '价格：高到低',
      clear: '清除筛选'
    },
    fr: {
      filters: 'Filtres',
      priceRange: 'Gamme de prix',
      duration: 'Durée',
      sortBy: 'Trier par',
      all: 'Tous',
      budget: 'Budget (Moins de ฿1,500)',
      mid: 'Moyen (฿1,500 - ฿2,000)',
      premium: 'Premium (Plus de ฿2,000)',
      short: 'Court (1,5 heures)',
      long: 'Long (3 heures)',
      popular: 'Le Plus Populaire',
      priceLow: 'Prix: Bas vers Haut',
      priceHigh: 'Prix: Haut vers Bas',
      clear: 'Effacer les filtres'
    }
  }

  const currentContent = content[currentLang as keyof typeof content] || content.en

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      priceRange: 'all',
      duration: 'all',
      sortBy: 'popular'
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {currentContent.filters}
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-green-600 hover:text-green-700 underline"
        >
          {currentContent.clear}
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {currentContent.priceRange}
        </label>
        <div className="space-y-2">
          {[
            { value: 'all', label: currentContent.all },
            { value: 'budget', label: currentContent.budget },
            { value: 'mid', label: currentContent.mid },
            { value: 'premium', label: currentContent.premium }
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value={option.value}
                checked={filters.priceRange === option.value}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {currentContent.duration}
        </label>
        <div className="space-y-2">
          {[
            { value: 'all', label: currentContent.all },
            { value: 'short', label: currentContent.short },
            { value: 'long', label: currentContent.long }
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="duration"
                value={option.value}
                checked={filters.duration === option.value}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                className="text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {currentContent.sortBy}
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
        >
          <option value="popular">{currentContent.popular}</option>
          <option value="price-low">{currentContent.priceLow}</option>
          <option value="price-high">{currentContent.priceHigh}</option>
        </select>
      </div>

      {/* Active Filters Count */}
      {(filters.priceRange !== 'all' || filters.duration !== 'all') && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📊</span>
            <span>
              {[
                filters.priceRange !== 'all' && currentContent.priceRange,
                filters.duration !== 'all' && currentContent.duration
              ].filter(Boolean).length} {currentLang === 'th' ? 'ตัวกรองที่ใช้' : 'active filters'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}