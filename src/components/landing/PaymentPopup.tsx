"use client";

import { useState } from "react";
import { X, Copy, CheckCircle } from "lucide-react";
import Image from "next/image";

interface PaymentPopupProps {
  onClose: () => void;
  qrCodeUrl?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  onOpenConfirmation?: () => void;
}

export default function PaymentPopup({
  onClose,
  qrCodeUrl,
  bankName,
  accountNumber,
  accountName,
  onOpenConfirmation,
}: PaymentPopupProps) {
  const hasQR = !!qrCodeUrl;
  const hasTransfer = !!(bankName && accountNumber);
  const defaultTab = hasQR ? "qr" : "transfer";

  const [activeTab, setActiveTab] = useState<"qr" | "transfer">(defaultTab);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Pilih Metode Pembayaran
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        {(hasQR || hasTransfer) && (
          <div className="flex border-b">
            {hasQR && (
              <button
                onClick={() => setActiveTab("qr")}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeTab === "qr"
                    ? "border-b-2 border-emerald-500 text-emerald-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Scan QR Code
              </button>
            )}
            {hasTransfer && (
              <button
                onClick={() => setActiveTab("transfer")}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeTab === "transfer"
                    ? "border-b-2 border-emerald-500 text-emerald-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Transfer Bank
              </button>
            )}
          </div>
        )}

        <div className="p-6">
          {!hasQR && !hasTransfer && (
            <div className="text-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Metode Pembayaran Belum Tersedia
                </h3>
                <p className="text-yellow-700">
                  Admin belum mengatur metode pembayaran. Silakan hubungi admin
                  untuk informasi lebih lanjut.
                </p>
              </div>
            </div>
          )}

          {/* QR Code Tab */}
          {activeTab === "qr" && qrCodeUrl && (
            <div className="text-center">
              <div className="mb-4">
                <Image
                  src={qrCodeUrl}
                  alt="QR Code untuk Donasi"
                  width={200}
                  height={200}
                  className="mx-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Cara Donasi dengan QR Code:
                </h4>
                <ol className="text-sm text-yellow-700 text-left space-y-1">
                  <li>1. Buka aplikasi mobile banking atau e-wallet</li>
                  <li>2. Pilih menu "Scan QR Code"</li>
                  <li>3. Arahkan kamera ke QR code di atas</li>
                  <li>4. Masukkan jumlah donasi</li>
                  <li>5. Konfirmasi pembayaran</li>
                </ol>
              </div>
            </div>
          )}

          {/* Transfer Tab */}
          {activeTab === "transfer" && bankName && accountNumber && (
            <div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Bank
                    </label>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {bankName}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nomor Rekening
                    </label>
                    <button
                      onClick={() => copyToClipboard(accountNumber, "account")}
                      className="text-emerald-600 hover:text-emerald-800 flex items-center text-sm"
                    >
                      {copied === "account" ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1" />
                      )}
                      {copied === "account" ? "Tersalin!" : "Salin"}
                    </button>
                  </div>
                  <p className="text-lg font-mono font-semibold text-gray-900">
                    {accountNumber}
                  </p>
                </div>

                {accountName && (
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Nama Rekening
                      </label>
                      <button
                        onClick={() => copyToClipboard(accountName, "name")}
                        className="text-emerald-600 hover:text-emerald-800 flex items-center text-sm"
                      >
                        {copied === "name" ? (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        ) : (
                          <Copy className="w-4 h-4 mr-1" />
                        )}
                        {copied === "name" ? "Tersalin!" : "Salin"}
                      </button>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {accountName}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Cara Transfer Bank:
                </h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Buka aplikasi mobile banking</li>
                  <li>2. Pilih menu "Transfer"</li>
                  <li>3. Masukkan nomor rekening di atas</li>
                  <li>4. Masukkan jumlah donasi</li>
                  <li>5. Konfirmasi transfer</li>
                  <li>6. Simpan bukti transfer sebagai konfirmasi</li>
                </ol>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            {(hasQR || hasTransfer) && onOpenConfirmation ? (
              <>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Sudah melakukan pembayaran?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenConfirmation();
                    }}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                  >
                    Isi Form Konfirmasi
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
