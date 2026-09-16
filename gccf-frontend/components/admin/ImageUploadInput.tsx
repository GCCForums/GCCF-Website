'use client';

import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadApi } from '@/lib/api';

interface ImageUploadInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  folder = 'general',
  placeholder = 'https://...',
  helperText,
  required = false,
  aspectRatio = 'auto',
  className = '',
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>(value && !value.startsWith('data:') ? 'upload' : 'upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, SVG, GIF).');
      return;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await uploadApi.uploadImage(file, folder);
      if (res?.url) {
        onChange(res.url);
      } else {
        throw new Error('No URL returned from upload.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image. Check Cloudinary settings or try a direct URL.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="flex items-center space-x-1 text-xs">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 text-xs ${
              mode === 'upload'
                ? 'bg-[#f0f5fc] text-[#3d73bd] border border-[#3d73bd]/30 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Upload className="w-3 h-3" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 text-xs ${
              mode === 'url'
                ? 'bg-[#f0f5fc] text-[#3d73bd] border border-[#3d73bd]/30 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            Paste URL
          </button>
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Preview Card If Value Exists */}
      {value ? (
        <div className="relative group rounded-xl border border-slate-200 bg-white p-3 flex items-center gap-4 overflow-hidden shadow-xs">
          {/* Thumbnail */}
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback icon on broken link
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pr-8">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3d73bd] bg-[#f0f5fc] border border-[#3d73bd]/20 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                {value.includes('cloudinary') ? 'Cloudinary Hosted' : 'Image Ready'}
              </span>
            </div>
            <p className="text-xs text-slate-600 truncate mt-1.5 font-mono" title={value}>
              {value}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs text-[#3d73bd] hover:text-[#1d3c68] font-semibold transition-colors cursor-pointer"
              >
                Replace Image
              </button>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                View Full
              </a>
            </div>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Empty State: Upload Dropzone or URL input */
        <div>
          {mode === 'upload' ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-[#3d73bd] bg-[#f0f5fc] scale-[0.99]'
                  : 'border-slate-200 bg-white hover:border-[#3d73bd]/60 hover:bg-[#f0f5fc]/30 shadow-2xs'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <Loader2 className="w-8 h-8 text-[#3d73bd] animate-spin" />
                  <span className="text-xs text-slate-700 font-medium">Uploading to Cloudinary...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-1 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#f0f5fc] flex items-center justify-center text-[#3d73bd] border border-[#3d73bd]/20 shadow-2xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#3d73bd] hover:text-[#1d3c68] hover:underline">
                      Click to choose file
                    </span>{' '}
                    <span className="text-xs text-slate-500">or drag and drop</span>
                  </div>
                  <p className="text-[11px] text-slate-400">PNG, JPG, WEBP, SVG or GIF up to 10MB</p>
                </div>
              )}
            </div>
          ) : (
            /* Direct URL input */
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg mt-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Helper text */}
      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
};
