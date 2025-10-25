import { CloudUpload, FileCode, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 md:p-16
          transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-border hover:border-primary/50 hover-elevate'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        data-testid="upload-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.css,.js,.zip"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
          data-testid="input-file"
        />
        
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="p-4 rounded-full bg-primary/10">
            <CloudUpload className="w-16 h-16 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">
              {isUploading ? 'Uploading...' : 'Drop your files here'}
            </h3>
            <p className="text-muted-foreground">
              or click to browse
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              <span>HTML, CSS, JS</span>
            </div>
            <div className="flex items-center gap-2">
              <FileArchive className="w-4 h-4" />
              <span>ZIP</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Maximum file size: 10 MB
          </p>
        </div>
      </div>
    </div>
  );
}
