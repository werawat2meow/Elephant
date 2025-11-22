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

  // ฟังก์ชันดึงชื่อโปรแกรมตามภาษา
  const packageNames: Record<string, { th: string; en: string }> = {
    '1': { th: 'ช้างธรรมชาติ', en: 'Elephant Nature' },
    '2': { th: 'เดินเล่น ป้อนอาหาร', en: 'Walk & Feed' },
    '3': { th: 'มินิช้างธรรมชาติ', en: 'Mini Elephant Nature' }
  }
  const langKey = currentLang === 'th' ? 'th' : 'en';
  const currentPackageName = packageId ? (packageNames[String(packageId)]?.[langKey] || packageNames[String(packageId)]?.en) : ''

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

  // Generate calendar days for the current month view
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  }

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Allow all future dates, not just current month
    return date >= today;
  };
  // Remove misplaced closing bracket

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  }

  const days = getDaysInMonth()
  // Filter time slots for today to only show future times (Asia/Bangkok)
  let timeSlots = getTimeSlots();
  // Show all time slots for every day, including today

  return (
    <div>
      {currentPackageName && (
        <div className="mb-2">
          <span className="text-lg font-bold text-black">{currentPackageName}</span>
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {currentContent.selectDate}
      </h2>
      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full bg-green-100 text-green-700 font-bold shadow hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Previous Month"
          >
            &#8592;
          </button>
          <h3 className="text-2xl font-bold text-green-700 drop-shadow-sm px-4">
            {currentContent.months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full bg-green-100 text-green-700 font-bold shadow hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Next Month"
          >
            &#8594;
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