"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, CheckCircle } from "lucide-react";
import Captcha from "../ui/Captcha";

const recapSchema = z.object({
  donationId: z.string(),
  donorName: z.string().min(1, "Nama wajib diisi"),
  donorEmail: z
    .string()
    .email("Email tidak valid")
    .optional()
    .or(z.literal("")),
  donorPhone: z.string().optional(),
  notes: z.string().optional(),
  captchaVerified: z
    .boolean()
    .refine((val) => val === true, "Verifikasi captcha wajib diselesaikan"),
});

type RecapForm = z.infer<typeof recapSchema>;

interface DonationRecapFormProps {
  onClose: () => void;
  donationId: string;
}

export default function DonationRecapForm({
  onClose,
  donationId,
}: DonationRecapFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transferProof, setTransferProof] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RecapForm>({
    resolver: zodResolver(recapSchema),
    defaultValues: {
      donationId: donationId,
      captchaVerified: false,
    },
  });

  const onSubmit = async (data: RecapForm) => {
    if (!transferProof) {
      setFileError("Bukti transfer wajib diupload");
      return;
    }

    if (!captchaVerified) {
      alert("Harap selesaikan verifikasi captcha terlebih dahulu");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, String(value));
      });

      if (transferProof) {
        formData.append("transferProof", transferProof);
      }

      const response = await fetch("/api/donation-recap", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error("Failed to submit donation recap");
      }
    } catch (error) {
      console.error("Error submitting donation recap:", error);
      alert("Error mengirim konfirmasi donasi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (1MB limit)
      if (file.size > 1024 * 1024) {
        setFileError("Ukuran file maksimal 1MB");
        return;
      }
      setTransferProof(file);
      setFileError(null);
    }
  };

  const handleCaptchaVerify = (verified: boolean) => {
    setCaptchaVerified(verified);
    setValue("captchaVerified", verified);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Konfirmasi Terkirim!
            </h2>
            <p className="text-gray-600">
              Terima kasih atas konfirmasi donasi Anda. Kami akan memverifikasi
              pembayaran segera.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Konfirmasi Donasi
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
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-800 mb-2">
              Isi form ini setelah melakukan donasi
            </h3>
            <p className="text-sm text-emerald-700">
              Form ini membantu kami memverifikasi dan mencatat donasi Anda
              dengan lebih baik.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              {...register("donorName")}
              type="text"
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Masukkan nama lengkap Anda"
            />
            {errors.donorName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.donorName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (opsional)
            </label>
            <input
              {...register("donorEmail")}
              type="email"
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="nama@email.com"
            />
            {errors.donorEmail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.donorEmail.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor HP (opsional)
            </label>
            <input
              {...register("donorPhone")}
              type="tel"
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Bukti Transfer <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none"
                  >
                    <span>Upload file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">atau drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF maksimal 1MB
                </p>
              </div>
            </div>
            {transferProof && (
              <p className="mt-2 text-sm text-green-600">
                ✓ File terpilih: {transferProof.name}
              </p>
            )}
            {fileError && (
              <p className="mt-2 text-sm text-red-600">{fileError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doa dan Harapan untuk Masjid Ini (opsional)
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Sampaikan doa dan harapan Anda untuk masjid ini..."
            />
          </div>

          {/* Captcha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verifikasi Keamanan <span className="text-red-500">*</span>
            </label>
            <Captcha onVerify={handleCaptchaVerify} />
            {errors.captchaVerified && (
              <p className="mt-1 text-sm text-red-600">
                {errors.captchaVerified.message}
              </p>
            )}
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
              {isLoading ? "Mengirim..." : "Kirim Konfirmasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
