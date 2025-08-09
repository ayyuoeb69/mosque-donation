"use client"

import { useState, useEffect, forwardRef } from "react"

interface FormattedNumberInputProps {
  value?: number
  onChange: (value: number) => void
  placeholder?: string
  min?: number
  step?: number
  className?: string
  name?: string
}

const FormattedNumberInput = forwardRef<HTMLInputElement, FormattedNumberInputProps>(
  ({ value = 0, onChange, placeholder, min = 0, step = 0.01, className, name }, ref) => {
    const [displayValue, setDisplayValue] = useState("")

    // Format number to Indonesian thousand separator format (5000 -> 5.000)
    const formatNumber = (num: number): string => {
      if (isNaN(num) || num === 0) return ""
      return num.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })
    }

    // Parse Indonesian formatted number back to number (5.000 -> 5000)
    const parseNumber = (str: string): number => {
      if (!str) return 0
      // Remove all dots (thousand separators) and replace comma with dot for decimal
      const cleaned = str.replace(/\./g, '').replace(',', '.')
      const parsed = parseFloat(cleaned)
      return isNaN(parsed) ? 0 : parsed
    }

    // Update display value when prop value changes
    useEffect(() => {
      setDisplayValue(formatNumber(value))
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      
      // Allow only numbers, dots, and commas
      if (!/^[\d.,]*$/.test(inputValue)) return

      // Parse the input to get numeric value
      const numericValue = parseNumber(inputValue)
      
      // Update the display value
      setDisplayValue(inputValue)
      
      // Call onChange with the numeric value
      onChange(numericValue)
    }

    const handleBlur = () => {
      // On blur, format the display value properly
      const numericValue = parseNumber(displayValue)
      const formatted = formatNumber(numericValue)
      setDisplayValue(formatted)
      onChange(numericValue)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Select all text on focus for easy editing
      e.target.select()
    }

    return (
      <input
        ref={ref}
        type="text"
        name={name}
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={className}
        inputMode="numeric"
      />
    )
  }
)

FormattedNumberInput.displayName = "FormattedNumberInput"

export default FormattedNumberInput