import { useRef } from "react";
import { FaTimes, FaCamera } from "react-icons/fa";

/**
 *
 * @param {{
 *   preview: string | null,
 *   onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *   onClearAvatar: () => void,
 * }} props
 */
export default function AvatarUploader({
  preview,
  onAvatarChange,
  onClearAvatar,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="flex items-center gap-5">
      {/* Circle preview */}
      <div className="relative shrink-0">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center
                     overflow-hidden border-2 border-red-200 cursor-pointer"
        >
          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover"
              alt="Avatar"
            />
          ) : (
            <FaCamera className="text-red-300" size={24} />
          )}
        </div>

        {/* Clear button */}
        {preview && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClearAvatar();
            }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 hover:bg-gray-500
                       text-white rounded-full flex items-center justify-center cursor-pointer"
          >
            <FaTimes size={8} />
          </button>
        )}
      </div>

      {/* Upload button + hint */}
      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md
                     transition-colors cursor-pointer"
        >
          Upload new photo
        </button>
        <p className="text-xs text-gray-400 mt-1">
          Allowed JPG or PNG · max 10 MB
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={onAvatarChange}
        className="hidden"
      />
    </div>
  );
}
