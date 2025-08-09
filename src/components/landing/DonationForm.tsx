"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Heart } from "lucide-react"
import FormattedNumberInput from "@/components/ui/FormattedNumberInput"

const donationSchema = z.object({
  amount: z.number().min(1, "Jumlah harus lebih dari 0"),
  donorName: z.string().optional(),
  donorEmail: z.string().email("Email tidak valid").optional().or(z.literal("")),
  message: z.string().optional(),
  isAnonymous: z.boolean()
})

type DonationForm = z.infer<typeof donationSchema>

interface DonationFormProps {
  onClose: () => void
  mosqueTitle: string
  onSuccess?: (donationId: string) => void
}

const PRESET_AMOUNTS = [50000, 100000, 250000, 500000, 1000000, 2500000]

export default function DonationForm({ onClose, mosqueTitle, onSuccess }: DonationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm<DonationForm>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      isAnonymous: false
    }
  })

  const isAnonymous = watch("isAnonymous")

  const onSubmit = async (data: DonationForm) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const result = await response.json()
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
          if (onSuccess) {
            onSuccess(result.donationId)
          } else {
            window.location.reload()
          }
        }, 2000)
      } else {
        throw new Error("Failed to submit donation")
      }
    } catch (error) {
      console.error("Error submitting donation:", error)
      alert("Gagal mengirim donasi. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setValue("amount", amount)
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Terima Kasih!
            </h2>
            <p className="text-gray-600">
              Donasi Anda telah berhasil dikirim. Semoga Allah membalas kebaikan Anda.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Donasi untuk {mosqueTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Jumlah Donasi
            </label>
            
            {/* Preset Amounts */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  className={`py-3 px-4 border rounded-lg text-sm font-medium transition-colors ${
                    selectedAmount === amount
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  Rp {amount.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Atau masukkan jumlah lainnya
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
                  Rp
                </span>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormattedNumberInput
                      value={value}
                      onChange={(newValue) => {
                        onChange(newValue)
                        setSelectedAmount(null)
                      }}
                      min={1}
                      step={1}
                      placeholder="0"
                      className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  )}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>
          </div>

          {/* Anonymous Donation */}
          <div className="flex items-center">
            <input
              {...register("isAnonymous")}
              type="checkbox"
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Jadikan donasi ini anonim
            </label>
          </div>

          {/* Donor Information */}
          {!isAnonymous && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Anda (opsional)
                </label>
                <input
                  {...register("donorName")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Nama lengkap Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Email (opsional)
                </label>
                <input
                  {...register("donorEmail")}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="nama@email.com"
                />
                {errors.donorEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.donorEmail.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pesan (opsional)
            </label>
            <textarea
              {...register("message")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Tinggalkan pesan dukungan..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Donasi Sekarang"}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Ini adalah demonstrasi. Tidak ada pembayaran aktual yang diproses.
          </p>
        </form>
      </div>
    </div>
  )
}