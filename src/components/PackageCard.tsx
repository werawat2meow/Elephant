import Button from './Button'

interface Package {
  id: number
  name: string
  duration: string
  badge: string
  badgeColor: string
  price: { adult: number; child: number }
  image: string
  activities: string[]
  times: string[]
}

interface PackageCardProps {
  package: Package
  currentLang: string
}

export default function PackageCard({ package: pkg, currentLang }: PackageCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image with Badge */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
          <span className="text-6xl">🐘</span>
        </div>
        <div className={`absolute top-4 right-4 ${pkg.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
          {pkg.badge}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {pkg.duration}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-green-600">
              ฿{pkg.price.adult.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              {currentLang === 'th' ? 'ผู้ใหญ่' : 'Adult'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {currentLang === 'th' ? 'เด็ก' : 'Child'}: ฿{pkg.price.child.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {currentLang === 'th' 
              ? 'เด็กอายุต่ำกว่า 4 ปี ฟรี' 
              : 'Children under 4 years free'}
          </div>
        </div>

        {/* Activities */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            {currentLang === 'th' ? 'กิจกรรมที่รวม:' : 'Activities Included:'}
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {pkg.activities.slice(0, 3).map((activity, index) => (
              <li key={index} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {activity}
              </li>
            ))}
            {pkg.activities.length > 3 && (
              <li className="text-gray-500 text-xs">
                +{pkg.activities.length - 3} {currentLang === 'th' ? 'กิจกรรมเพิ่มเติม' : 'more activities'}
              </li>
            )}
          </ul>
        </div>

        {/* Time Slots */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            {currentLang === 'th' ? 'เวลาที่เปิด:' : 'Available Times:'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {pkg.times.map((time, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {time}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white font-medium transition-all duration-200"
          >
            {currentLang === 'th' ? 'ดูรายละเอียด' : 'View Details'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => window.location.href = '/booking'}
          >
            {currentLang === 'th' ? 'จองเลย' : 'Book Now'}
          </Button>
        </div>
      </div>
    </div>
  )
}