import { useRef, useState } from 'react';
import { Upload, Video, Music, X } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

export function FileUploader({ onFileSelect, acceptedTypes = 'video/*,audio/*', maxSizeMB = 50 }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="w-12 h-12" />;
    if (selectedFile.type.startsWith('video/')) return <Video className="w-12 h-12" />;
    if (selectedFile.type.startsWith('audio/')) return <Music className="w-12 h-12" />;
    return <Upload className="w-12 h-12" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-500/10'
          : selectedFile
          ? 'border-green-500 bg-green-500/10'
          : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />

      {selectedFile ? (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={clearFile}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            aria-label="Clear file"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-green-400">{getFileIcon()}</div>
          <div className="text-center">
            <p className="text-white font-medium">{selectedFile.name}</p>
            <p className="text-gray-400 text-sm mt-1">{formatFileSize(selectedFile.size)}</p>
          </div>
        </div>
      ) : (
        <label htmlFor="file-upload" className="flex flex-col items-center gap-4 cursor-pointer">
          <div className="text-gray-400">{getFileIcon()}</div>
          <div className="text-center">
            <p className="text-white font-medium mb-1">
              Drop your file here or click to browse
            </p>
            <p className="text-gray-400 text-sm">
              Supports video and audio files up to {maxSizeMB}MB
            </p>
          </div>
        </label>
      )}
    </div>
  );
}
