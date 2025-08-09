"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LogOut,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface DonationConfirmation {
  id: string;
  donationId: string;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  transferProof?: string;
  notes?: string;
  isVerified: boolean;
  isRejected?: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
}

export default function AdminConfirmations() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [confirmations, setConfirmations] = useState<DonationConfirmation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchConfirmations();
  }, []);

  const fetchConfirmations = async () => {
    try {
      const response = await fetch("/api/admin/confirmations");
      if (response.ok) {
        const data = await response.json();
        setConfirmations(data);
      }
    } catch (error) {
      console.error("Error fetching confirmations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (
    id: string,
    action: "verify" | "reject" | "cancel"
  ) => {
    try {
      const response = await fetch("/api/admin/confirmations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, action }),
      });

      if (response.ok) {
        const actionText =
          action === "verify"
            ? "diverifikasi"
            : action === "reject"
            ? "ditolak"
            : "dibatalkan";
        setMessage(`Konfirmasi ${actionText} berhasil!`);
        fetchConfirmations();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setMessage(
          `Error: ${errorData.error || "Gagal memperbarui konfirmasi"}`
        );
      }
    } catch (error) {
      setMessage("Error memperbarui konfirmasi");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Konfirmasi Donasi
              </h1>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded ${
              message.includes("Error")
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Daftar Konfirmasi Donasi ({confirmations.length})
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Kelola dan verifikasi konfirmasi donasi dari para donatur
            </p>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat konfirmasi...</p>
            </div>
          ) : confirmations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                Belum ada konfirmasi donasi yang masuk.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donatur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bukti Transfer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doa & Harapan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {confirmations.map((confirmation) => (
                    <tr key={confirmation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {confirmation.donorName}
                              </div>
                              {confirmation.donorEmail && (
                                <div className="text-sm text-gray-500">
                                  {confirmation.donorEmail}
                                </div>
                              )}
                              {confirmation.donorPhone && (
                                <div className="text-sm text-gray-500">
                                  {confirmation.donorPhone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {confirmation.transferProof ? (
                          <button
                            onClick={() =>
                              window.open(
                                String(confirmation.transferProof || ""),
                                "_blank"
                              )
                            }
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Lihat Bukti
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Tidak ada
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {confirmation.notes || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          {formatDate(confirmation.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {confirmation.isVerified ? (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Terverifikasi
                            </span>
                            {confirmation.verifiedAt && (
                              <span className="text-xs text-gray-500 mt-1">
                                {formatDate(confirmation.verifiedAt)}
                              </span>
                            )}
                          </div>
                        ) : confirmation.isRejected ? (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              <XCircle className="w-3 h-3 mr-1" />
                              Ditolak
                            </span>
                            {confirmation.verifiedAt && (
                              <span className="text-xs text-gray-500 mt-1">
                                {formatDate(confirmation.verifiedAt)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Menunggu Verifikasi
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-1">
                          {!confirmation.isVerified &&
                          !confirmation.isRejected ? (
                            <>
                              <button
                                onClick={() =>
                                  handleAction(confirmation.id, "verify")
                                }
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verifikasi
                              </button>
                              <button
                                onClick={() =>
                                  handleAction(confirmation.id, "reject")
                                }
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Tolak
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                handleAction(confirmation.id, "cancel")
                              }
                              className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <Image
              src={selectedImage}
              alt="Bukti Transfer"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
