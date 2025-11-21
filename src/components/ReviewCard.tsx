interface Review {
  id: number
  name: string
  country: string
  rating: number
  comment: string
  date: string
  image?: string
}

interface ReviewCardProps {
  review: Review
  currentLang: string
}

export default function ReviewCard({ review, currentLang }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (currentLang === 'th') {
      return date.toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'long'
      })
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
          {review.image ? (
            <img 
              src={review.image} 
              alt={review.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-green-600 font-semibold text-lg">
              {review.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{review.name}</h4>
          <p className="text-sm text-gray-500">{review.country}</p>
        </div>
        <div className="text-right">
          <div className="flex justify-end mb-1">
            {renderStars(review.rating)}
          </div>
          <p className="text-xs text-gray-400">{formatDate(review.date)}</p>
        </div>
      </div>

      {/* Review Content */}
      <div className="text-gray-700 leading-relaxed">
        <p className="italic">"{review.comment}"</p>
      </div>

      {/* Verification Badge */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
          <span className="mr-1">✓</span>
          {currentLang === 'th' ? 'รีวิวที่ยืนยันแล้ว' : 'Verified Review'}
        </span>
      </div>
    </div>
  )
}