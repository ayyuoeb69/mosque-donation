"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Prayer {
  id: string;
  donorName: string;
  notes: string;
  verifiedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPrayers: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PrayersResponse {
  prayers: Prayer[];
  pagination: PaginationInfo;
}

export default function PrayersSection() {
  const [prayersData, setPrayersData] = useState<PrayersResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [autoSlide, setAutoSlide] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const ITEMS_PER_PAGE = 3; // Show 3 prayers per page

  const fetchPrayers = useCallback(
    async (page: number, withTransition = false) => {
      try {
        if (withTransition) {
          setIsTransitioning(true);
          // Wait a bit to show the fade out effect
          await new Promise((resolve) => setTimeout(resolve, 200));
        } else {
          setIsLoading(true);
        }

        const response = await fetch(
          `/api/prayers?page=${page}&limit=${ITEMS_PER_PAGE}`
        );
        if (response.ok) {
          const data: PrayersResponse = await response.json();
          setPrayersData(data);
          if (isInitialLoad) {
            setIsInitialLoad(false);
          }
        }
      } catch (error) {
        console.error("Error fetching prayers:", error);
      } finally {
        if (withTransition) {
          // Wait a bit more to show the fade in effect
          setTimeout(() => setIsTransitioning(false), 100);
        } else {
          setIsLoading(false);
        }
      }
    },
    [ITEMS_PER_PAGE]
  );

  useEffect(() => {
    fetchPrayers(currentPage, !isInitialLoad);
  }, [currentPage, fetchPrayers, isInitialLoad]);

  // Auto-slide functionality with proper loop detection
  useEffect(() => {
    if (!autoSlide || !prayersData) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => {
        const isLastPage = prev >= prayersData.pagination.totalPages;

        if (isLastPage) {
          // Reset to first page when we've reached the last page
          return 1;
        } else {
          // Move to next page
          return prev + 1;
        }
      });
    }, 6000); // Change slide every 6 seconds (allowing time for smooth transitions)

    return () => clearInterval(interval);
  }, [autoSlide, prayersData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setAutoSlide(false); // Disable auto-slide when user manually navigates

    // Re-enable auto-slide after 10 seconds of inactivity
    setTimeout(() => {
      setAutoSlide(true);
    }, 10000);
  };

  const handlePrevious = () => {
    if (prayersData?.pagination.hasPreviousPage) {
      handlePageChange(currentPage - 1);
    } else {
      // Loop to last page if at first page
      handlePageChange(prayersData?.pagination.totalPages || 1);
    }
  };

  const handleNext = () => {
    if (prayersData?.pagination.hasNextPage) {
      handlePageChange(currentPage + 1);
    } else {
      // Loop back to first page if at last page
      handlePageChange(1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!prayersData?.prayers.length && !isLoading) {
    return null; // Don't render if no prayers
  }

  return (
    <section className="py-16 bg-emerald-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
            <Heart className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Doa dan Harapan Para Donatur
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Kumpulan doa tulus dan harapan baik dari para donatur untuk
            pembangunan masjid yang berkah
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat doa dan harapan...</p>
          </div>
        ) : prayersData && prayersData.prayers.length > 0 ? (
          <div className="relative">
            {/* Auto-slide indicator and controls */}

            {/* Prayer Cards Grid with Smooth Transitions */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                isTransitioning
                  ? "opacity-0 transform translate-y-4"
                  : "opacity-100 transform translate-y-0"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {prayersData.prayers.map((prayer, index) => (
                  <div
                    key={prayer.id}
                    className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-500 ease-out transform hover:-translate-y-1 ${
                      isTransitioning
                        ? "opacity-0 transform translate-y-8 scale-95"
                        : "opacity-100 transform translate-y-0 scale-100"
                    }`}
                    style={{
                      transitionDelay: isTransitioning
                        ? "0ms"
                        : `${index * 150}ms`,
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <Quote className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <blockquote className="text-gray-700 italic mb-4 leading-relaxed text-sm">
                          "{prayer.notes}"
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Heart className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {prayer.donorName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Donatur Terverifikasi
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">
                            {formatDate(prayer.verifiedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {prayersData && prayersData.prayers.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Terima kasih kepada semua donatur yang telah memberikan dukungan
              dan doa untuk masjid ini
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
