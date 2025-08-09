"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload, LogOut, DollarSign, Users, Target, FileText } from "lucide-react"
import Link from "next/link"
import FormattedNumberInput from "@/components/ui/FormattedNumberInput"

const contentSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  goal: z.number().min(1, "Target dana harus lebih dari 0"),
  currentAmount: z.number().min(0, "Jumlah terkumpul harus 0 atau lebih"),
  donorCount: z.number().int().min(0, "Jumlah donatur harus 0 atau lebih"),
  beforeRenovationDesc: z.string().optional(),
  afterRenovationDesc: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional()
})

type ContentForm = z.infer<typeof contentSchema>

interface MosqueContent {
  id: string
  title: string
  description: string
  goal: number
  currentAmount: number
  donorCount: number
  logoUrl?: string
  bannerImageUrl?: string
  qrCodeUrl?: string
  beforeRenovationImageUrl?: string
  afterRenovationImageUrl?: string
  beforeRenovationDesc?: string
  afterRenovationDesc?: string
  bankName?: string
  accountNumber?: string
  accountName?: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [content, setContent] = useState<MosqueContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<ContentForm>({
    resolver: zodResolver(contentSchema)
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    }
  }, [status, router])

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/admin/content")
      if (response.ok) {
        const data = await response.json()
        setContent(data)
        reset({
          title: data.title,
          description: data.description,
          goal: data.goal,
          currentAmount: data.currentAmount,
          donorCount: data.donorCount,
          beforeRenovationDesc: data.beforeRenovationDesc || "",
          afterRenovationDesc: data.afterRenovationDesc || "",
          bankName: data.bankName || "",
          accountNumber: data.accountNumber || "",
          accountName: data.accountName || ""
        })
      }
    } catch (error) {
      console.error("Error fetching content:", error)
    }
  }

  const onSubmit = async (data: ContentForm) => {
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setMessage("Konten berhasil diperbarui!")
        fetchContent()
      } else {
        setMessage("Error memperbarui konten")
      }
    } catch (error) {
      setMessage("Error updating content")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (file: File, type: "logo" | "banner" | "qr" | "before" | "after") => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(`${type === 'logo' ? 'Logo' : type === 'banner' ? 'Banner' : type === 'qr' ? 'QR Code' : type === 'before' ? 'Foto Sebelum' : 'Foto Sesudah'} berhasil diupload!`)
        fetchContent()
      } else {
        setMessage(`Error mengupload ${type === 'logo' ? 'logo' : type === 'banner' ? 'banner' : type === 'qr' ? 'QR code' : type === 'before' ? 'foto sebelum' : 'foto sesudah'}`)
      }
    } catch (error) {
      setMessage(`Error uploading ${type}`)
    }
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/confirmations"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                Konfirmasi Donasi
              </Link>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {content && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Dana Terkumpul
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Rp {content.currentAmount.toLocaleString('id-ID')}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Target className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Target Dana
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Rp {content.goal.toLocaleString('id-ID')}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Jumlah Donatur
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {content.donorCount || 0} orang
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Management */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Content Management</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {message && (
                <div className={`p-4 rounded ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                  {message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Kampanye
                  </label>
                  <input
                    {...register("title")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Dana (Rp)
                  </label>
                  <Controller
                    name="goal"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <FormattedNumberInput
                        value={value}
                        onChange={onChange}
                        min={1}
                        step={0.01}
                        placeholder="Masukkan target dana"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    )}
                  />
                  {errors.goal && (
                    <p className="mt-1 text-sm text-red-600">{errors.goal.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dana Terkumpul Saat Ini (Rp)
                  </label>
                  <Controller
                    name="currentAmount"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <FormattedNumberInput
                        value={value}
                        onChange={onChange}
                        min={0}
                        step={0.01}
                        placeholder="Masukkan dana terkumpul"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    )}
                  />
                  {errors.currentAmount && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentAmount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah Donatur
                  </label>
                  <input
                    {...register("donorCount", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.donorCount && (
                    <p className="mt-1 text-sm text-red-600">{errors.donorCount.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Sebelum Renovasi
                  </label>
                  <textarea
                    {...register("beforeRenovationDesc")}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ceritakan kondisi masjid sebelum renovasi..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Setelah Renovasi
                  </label>
                  <textarea
                    {...register("afterRenovationDesc")}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ceritakan rencana renovasi masjid..."
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-md font-medium text-gray-700 mb-3">Informasi Bank untuk Transfer</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Bank
                    </label>
                    <input
                      {...register("bankName")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="BCA, BRI, Mandiri, dll"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Rekening
                    </label>
                    <input
                      {...register("accountNumber")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Rekening
                    </label>
                    <input
                      {...register("accountName")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nama pemegang rekening"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                {isLoading ? "Memperbarui..." : "Perbarui Konten"}
              </button>
            </form>
          </div>

          {/* Image Management */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Manajemen Gambar</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Masjid
                  </label>
                  {content?.logoUrl && (
                    <img src={content.logoUrl} alt="Logo" className="w-20 h-20 object-cover mb-2 rounded" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, "logo")
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>

                {/* Banner Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Banner
                  </label>
                  {content?.bannerImageUrl && (
                    <img src={content.bannerImageUrl} alt="Banner" className="w-full h-32 object-cover mb-2 rounded" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, "banner")
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Before Renovation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Sebelum Renovasi
                  </label>
                  {content?.beforeRenovationImageUrl && (
                    <img src={content.beforeRenovationImageUrl} alt="Sebelum Renovasi" className="w-full h-32 object-cover mb-2 rounded" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, "before")
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>

                {/* After Renovation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Rencana Setelah Renovasi
                  </label>
                  {content?.afterRenovationImageUrl && (
                    <img src={content.afterRenovationImageUrl} alt="Setelah Renovasi" className="w-full h-32 object-cover mb-2 rounded" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, "after")
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
              </div>

              {/* QR Code Upload */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code untuk Pembayaran
                </label>
                {content?.qrCodeUrl && (
                  <img src={content.qrCodeUrl} alt="QR Code" className="w-32 h-32 object-cover mb-2 rounded mx-auto" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, "qr")
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}