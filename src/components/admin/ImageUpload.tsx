'use client';

import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  return (
    <div className="space-y-3">
      {value && (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-red-600"
          >
            X
          </button>
        </div>
      )}

      <CldUploadWidget
        uploadPreset="bar-wise"
        options={{
          maxFiles: 1,
          resourceType: 'image',
          folder: 'bar-wise',
        }}
        onSuccess={(result: CloudinaryUploadWidgetResults) => {
          const info = result.info;
          if (typeof info === 'object' && info !== null && 'secure_url' in info) {
            onChange(info.secure_url as string);
          }
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm hover:bg-gray-200 transition"
          >
            {value ? 'Cambiar imagen' : 'Subir imagen'}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
