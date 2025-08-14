"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Calendar, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Toast from "@/components/ui/Toast";

interface ProgressImage {
  id: string;
  imageUrl: string;
  caption: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProgressImagesAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<ProgressImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<ProgressImage | null>(null);
  const [formData, setFormData] = useState({
    caption: "",
    description: "",
    date: "",
    imageFile: null as File | null,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/admin/progress-images");
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setToast({ message: "Error mengambil foto progress", type: "error" });
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "progress");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.url;
    } else {
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = editingImage?.imageUrl || "";

      if (formData.imageFile) {
        imageUrl = await handleImageUpload(formData.imageFile);
      }

      const payload = {
        imageUrl,
        caption: formData.caption,
        description: formData.description,
        date: formData.date,
      };

      const url = editingImage
        ? `/api/admin/progress-images/${editingImage.id}`
        : "/api/admin/progress-images";

      const method = editingImage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setToast({
          message: editingImage
            ? "Foto progress berhasil diperbarui!"
            : "Foto progress berhasil ditambahkan!",
          type: "success",
        });
        fetchImages();
        resetForm();
      } else {
        throw new Error("Failed to save progress image");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      setToast({ message: "Error menyimpan foto progress", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (image: ProgressImage) => {
    setEditingImage(image);
    setFormData({
      caption: image.caption,
      description: image.description || "",
      date: new Date(image.date).toISOString().split("T")[0],
      imageFile: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto progress ini?"))
      return;

    try {
      const response = await fetch(`/api/admin/progress-images/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setToast({
          message: "Foto progress berhasil dihapus!",
          type: "success",
        });
        fetchImages();
      } else {
        throw new Error("Failed to delete progress image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setToast({ message: "Error menghapus foto progress", type: "error" });
    }
  };

  const resetForm = () => {
    setFormData({
      caption: "",
      description: "",
      date: "",
      imageFile: null,
    });
    setEditingImage(null);
    setShowForm(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
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
          <div className="flex flex-col md:flex-row  gap-3 justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Foto Progress Pembangunan
              </h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Foto Progress
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {editingImage ? "Edit Foto Progress" : "Tambah Foto Progress"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Foto
                    </label>
                    {editingImage?.imageUrl && !formData.imageFile && (
                      <div className="mb-2">
                        <Image
                          src={editingImage.imageUrl}
                          alt="Foto saat ini"
                          width={200}
                          height={150}
                          className="rounded object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          imageFile: e.target.files?.[0] || null,
                        })
                      }
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      required={!editingImage}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Judul *
                    </label>
                    <input
                      type="text"
                      value={formData.caption}
                      onChange={(e) =>
                        setFormData({ ...formData, caption: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Masukkan judul foto progress"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Masukkan deskripsi detail (opsional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Tanggal *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isLoading
                        ? "Menyimpan..."
                        : editingImage
                        ? "Perbarui"
                        : "Tambah"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={image.imageUrl}
                  alt={image.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">
                  {image.caption}
                </h3>
                {image.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {image.description}
                  </p>
                )}
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(image.date).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(image)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Belum ada foto progress. Tambahkan foto progress pertama Anda!
            </p>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
