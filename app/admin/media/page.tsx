'use client';

import { useEffect, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { uploadFile, deleteFile, listFiles } from '@/lib/supabase-admin';

interface MediaFile {
  name: string;
  url: string;
  created_at: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<MediaFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    try {
      const data = await listFiles('product-images');
      setFiles(data);
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Failed to load media files. Make sure Supabase storage is configured.');
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setError('');

    try {
      for (const file of Array.from(fileList)) {
        // Validate file type
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          throw new Error(`${file.name} is not an image or video file`);
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Max size is 10MB`);
        }

        await uploadFile(file, 'product-images');
      }
      await loadFiles();
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDeleteClick = (file: MediaFile) => {
    setFileToDelete(file);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFile(fileToDelete.url, 'product-images');
      setFiles((prev) => prev.filter((f) => f.url !== fileToDelete.url));
      setDeleteModalOpen(false);
      setFileToDelete(null);
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout title="Media Library">
      {/* Upload Area */}
      <div
        className={`relative mb-6 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-[#0073aa] bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-[#0073aa] animate-spin" />
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="text-gray-600 font-medium">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Images and videos up to 10MB each
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700">{error}</p>
            <p className="text-sm text-red-600 mt-1">
              Make sure you have created a storage bucket named "product-images" in Supabase with public access enabled.
            </p>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            {loading ? 'Loading...' : `${files.length} files`}
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-[#0073aa] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading media files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No files uploaded yet</p>
            <p className="text-sm text-gray-400">
              Upload images or videos to use in your products
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {files.map((file) => (
              <div
                key={file.url}
                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-contain"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(file.url)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === file.url ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(file)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                {/* File Name */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete File
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{fileToDelete?.name}"?
            </p>
            {fileToDelete && (
              <div className="mb-6 p-2 bg-gray-100 rounded-lg">
                <img
                  src={fileToDelete.url}
                  alt={fileToDelete.name}
                  className="w-full h-32 object-contain"
                />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
