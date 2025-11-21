'use client'
import { useState } from 'react'

interface BookingCalendarProps {
  packageId: number | null
  selectedDate: string | null
  selectedTime: string | null
  onDateSelect: (date: string) => void
  onTimeSelect: (time: string) => void
  currentLang: string
}

export default function BookingCalendar({ 
  packageId, 
  selectedDate, 
  selectedTime, 
  onDateSelect, 
  onTimeSelect, 
  currentLang 
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const content = {
    th: {
      selectDate: 'เลือกวันที่',
      selectTime: 'เลือกเวลา',
      available: 'ว่าง',
      unavailable: 'เต็มแล้ว',
      today: 'วันนี้',
      months: [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ],
      days: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    },
    en: {
      selectDate: 'Select Date',
      selectTime: 'Select Time',
      available: 'Available',
      unavailable: 'Full',
      today: 'Today',
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  }

  const currentContent = content[currentLang as keyof typeof content] || content.en

  // Available time slots based on package
  const getTimeSlots = () => {
    switch (packageId) {
      case 1: return ['9:00 AM', '2:00 PM']
      case 2:
      case 3: return ['9:00 AM', '11:00 AM', '2:00 PM']
      default: return []
    }
  }

  // Generate calendar days
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    return days
  }

  const isDateAvailable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today && date.getMonth() === currentMonth.getMonth()
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))
  }

  const days = getDaysInMonth()
  const timeSlots = getTimeSlots()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {currentContent.selectDate}
      </h2>
      
      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ←
          </button>
          <h3 className="text-lg font-semibold">
            {currentContent.months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            →
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {currentContent.days.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const isAvailable = isDateAvailable(date)
            const isSelected = selectedDate === formatDate(date)
            const isTodayDate = isToday(date)
            
            return (
              <button
                key={index}
                onClick={() => isAvailable && onDateSelect(formatDate(date))}
                disabled={!isAvailable}
                className={`
                  p-2 text-sm rounded-lg transition-colors
                  ${
                    isSelected
                      ? 'bg-green-600 text-white'
                      : isAvailable
                      ? 'hover:bg-green-100 text-gray-900'
                      : 'text-gray-300 cursor-not-allowed'
                  }
                  ${
                    isTodayDate && !isSelected
                      ? 'bg-green-50 border border-green-200'
                      : ''
                  }
                `}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {currentContent.selectTime}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time
              
              return (
                <button
                  key={time}
                  onClick={() => onTimeSelect(time)}
                  className={`
                    p-3 rounded-lg border-2 transition-colors
                    ${
                      isSelected
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-200 hover:border-green-300 text-gray-700'
                    }
                  `}
                >
                  <div className="text-sm font-medium">{time}</div>
                  <div className="text-xs mt-1 opacity-75">
                    {currentContent.available}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}