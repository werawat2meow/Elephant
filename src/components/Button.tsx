interface ButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({ 
  children, 
  className = '', 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-md hover:shadow-lg', 
    outline: 'border-2 border-green-600 hover:bg-green-600 hover:text-white text-green-600 focus:ring-green-500 transition-all duration-200'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  )
}