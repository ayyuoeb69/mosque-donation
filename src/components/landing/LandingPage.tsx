"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Users,
  Target,
  Calendar,
  Star,
  MessageCircle,
  Mail,
} from "lucide-react";
import DonationForm from "./DonationForm";
import PaymentPopup from "./PaymentPopup";
import DonationRecapForm from "./DonationRecapForm";
import PrayersSection from "./PrayersSection";
import ProgressSection from "./ProgressSection";

interface MosqueContent {
  id: string;
  title: string;
  description: string;
  goal: number;
  currentAmount: number;
  donorCount: number;
  logoUrl?: string | null;
  bannerImageUrl?: string | null;
  qrCodeUrl?: string | null;
  beforeRenovationImageUrl?: string | null;
  afterRenovationImageUrl?: string | null;
  beforeRenovationDesc?: string | null;
  afterRenovationDesc?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  proposalPdfUrl?: string | null;
  whatsappUrl?: string | null;
  emailContact?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  tiktokUrl?: string | null;
}

interface Donation {
  id: string;
  donorName?: string | null;
  amount: number;
  message?: string | null;
  createdAt: Date;
}

interface LandingPageProps {
  content: MosqueContent;
  recentDonations: Donation[];
}

export default function LandingPage({
  content,
  recentDonations,
}: LandingPageProps) {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showRecapForm, setShowRecapForm] = useState(false);
  const [lastDonationId, setLastDonationId] = useState<string | null>(null);
  const progressPercentage = (content.currentAmount / content.goal) * 100;

  const handleDonateNow = () => {
    setShowPaymentPopup(true);
  };

  const handleDonationSuccess = (donationId: string) => {
    setLastDonationId(donationId);
    setShowRecapForm(true);
  };

  const handleOpenConfirmation = () => {
    // Generate a temporary ID for manual confirmation
    const tempId = "manual-" + Date.now();
    setLastDonationId(tempId);
    setShowRecapForm(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              {content.logoUrl && (
                <div className="mb-8 flex justify-center lg:justify-start">
                  <Image
                    src={content.logoUrl}
                    alt="Mosque Logo"
                    width={100}
                    height={100}
                    className="rounded-full shadow-lg"
                  />
                </div>
              )}

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {content.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {content.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-emerald-600">
                    Rp {content.currentAmount.toLocaleString("id-ID")}
                  </span>
                  <span className="text-gray-600">
                    terkumpul dari target Rp{" "}
                    {content.goal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {Math.round(progressPercentage)}% tercapai
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start justify-center lg:justify-start">
                <button
                  onClick={handleDonateNow}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Donasi Sekarang
                </button>

                {content.proposalPdfUrl && (
                  <a
                    href={content.proposalPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4.5 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-colors duration-200"
                  >
                    📄 Detail Proposal
                  </a>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              {content.bannerImageUrl ? (
                <Image
                  src={content.bannerImageUrl}
                  alt="Mosque"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl object-cover w-full h-[400px]"
                />
              ) : (
                <div className="bg-emerald-100 rounded-2xl shadow-2xl h-[400px] flex items-center justify-center">
                  <div className="text-center text-emerald-600">
                    <Target className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Building Our Future</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="mb-4">
                <Target className="w-12 h-12 mx-auto" />
              </div>
              <div className="text-3xl font-bold mb-2">
                Rp {content.goal.toLocaleString("id-ID")}
              </div>
              <div className="text-emerald-100">Target Dana</div>
            </div>

            <div className="text-center text-white">
              <div className="mb-4">
                <Heart className="w-12 h-12 mx-auto" />
              </div>
              <div className="text-3xl font-bold mb-2">
                Rp {content.currentAmount.toLocaleString("id-ID")}
              </div>
              <div className="text-emerald-100">Dana Terkumpul</div>
            </div>

            <div className="text-center text-white">
              <div className="mb-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <div className="text-3xl font-bold mb-2">
                {content.donorCount || 0}
              </div>
              <div className="text-emerald-100">Donatur</div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Renovation Section */}
      {(content.beforeRenovationImageUrl ||
        content.afterRenovationImageUrl ||
        content.beforeRenovationDesc ||
        content.afterRenovationDesc) && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Rencana Renovasi Pembangunan
              </h2>
              {/* <p className="text-lg text-gray-600">
                Rencana yang akan oleh kami
              </p> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Before Renovation */}
              {(content.beforeRenovationImageUrl ||
                content.beforeRenovationDesc) && (
                <div className="bg-gray-50 rounded-xl p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Sebelum Renovasi
                    </h3>
                    <div className="w-16 h-1 bg-gray-400 mx-auto"></div>
                  </div>

                  {content.beforeRenovationImageUrl && (
                    <div className="mb-6">
                      <Image
                        src={content.beforeRenovationImageUrl}
                        alt="Masjid Sebelum Renovasi"
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}

                  {content.beforeRenovationDesc && (
                    <p className="text-gray-700 leading-relaxed">
                      {content.beforeRenovationDesc}
                    </p>
                  )}
                </div>
              )}

              {/* After Renovation */}
              {(content.afterRenovationImageUrl ||
                content.afterRenovationDesc) && (
                <div className="bg-emerald-50 rounded-xl p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Rencana Setelah Renovasi
                    </h3>
                    <div className="w-16 h-1 bg-emerald-500 mx-auto"></div>
                  </div>

                  {content.afterRenovationImageUrl && (
                    <div className="mb-6">
                      <Image
                        src={content.afterRenovationImageUrl}
                        alt="Rencana Masjid Setelah Renovasi"
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}

                  {content.afterRenovationDesc && (
                    <p className="text-gray-700 leading-relaxed">
                      {content.afterRenovationDesc}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Progress Section */}
      <ProgressSection />

      {/* Recent Donations */}
      {recentDonations.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Donasi Terbaru
              </h2>
              <p className="text-lg text-gray-600">
                Terima kasih kepada para donatur yang mulia hati
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-emerald-100 rounded-full p-2 mr-3">
                        <Heart className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {donation.donorName || "Anonim"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Rp {donation.amount.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {donation.message && (
                    <p className="text-gray-600 text-sm mb-3 italic">
                      "{donation.message}"
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {/* Prayers Section */}
      <PrayersSection />

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{content.title}</h3>
            <p className="text-gray-300 mb-6 italic">
              "Siapa yang membangun masjid karena Allah, maka Allah akan
              membangunkan untuknya rumah di surga."
            </p>

            {/* Social Media Links */}
            {(content.whatsappUrl ||
              content.emailContact ||
              content.instagramUrl ||
              content.twitterUrl ||
              content.tiktokUrl) && (
              <div className="mb-5 pb-5 border-b border-b-white/10">
                <h4 className="text-lg font-medium mb-4 text-gray-300">
                  Hubungi Kami
                </h4>
                <div className="flex justify-center space-x-4 space-y-4 flex-wrap">
                  {content.whatsappUrl && (
                    <a
                      href={content.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-[44px] items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {content.emailContact && (
                    <a
                      href={`mailto:${content.emailContact}`}
                      className="flex h-[44px] items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Email</span>
                    </a>
                  )}

                  {content.instagramUrl && (
                    <a
                      href={content.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-[44px] items-center space-x-2 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <span className="text-lg">📷</span>
                      <span>Instagram</span>
                    </a>
                  )}

                  {content.twitterUrl && (
                    <a
                      href={content.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-[44px] items-center space-x-2 bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <span className="text-lg">🐦</span>
                      <span>Twitter</span>
                    </a>
                  )}

                  {content.tiktokUrl && (
                    <a
                      href={content.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-[44px] items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <span className="text-lg">🎵</span>
                      <span>TikTok</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-6">
              <button
                onClick={handleDonateNow}
                className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Donasi Sekarang
              </button>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2025. Dibuat dengan cinta untuk umat.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Payment Popup */}
      {showPaymentPopup && (
        <PaymentPopup
          onClose={() => setShowPaymentPopup(false)}
          qrCodeUrl={content.qrCodeUrl}
          bankName={content.bankName}
          accountNumber={content.accountNumber}
          accountName={content.accountName}
          onOpenConfirmation={handleOpenConfirmation}
        />
      )}

      {/* Donation Form Modal */}
      {showDonationForm && (
        <DonationForm
          onClose={() => setShowDonationForm(false)}
          mosqueTitle={content.title}
          onSuccess={handleDonationSuccess}
        />
      )}

      {/* Donation Recap Form */}
      {showRecapForm && lastDonationId && (
        <DonationRecapForm
          onClose={() => setShowRecapForm(false)}
          donationId={lastDonationId}
        />
      )}
    </div>
  );
}
