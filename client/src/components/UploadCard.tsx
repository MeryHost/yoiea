import { Upload, FileArchive, FileCode, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef } from "react";

interface UploadCardProps {
  onUpload: (file: File, linkName: string) => void;
  isUploading?: boolean;
}

export function UploadCard({ onUpload, isUploading }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [linkName, setLinkName] = useState("");
  const [selectedTab, setSelectedTab] = useState("documents");
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
      onUpload(files[0], linkName || files[0].name.split('.')[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0], linkName || files[0].name.split('.')[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl bg-background rounded-xl border-2 shadow-lg p-8">
      <div className="space-y-6">
        {/* Link Name Input */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="link-name"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            className="flex-1 font-mono text-sm"
            data-testid="input-link-name"
          />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>.</span>
            <span className="font-medium">meryhost.site</span>
          </div>
        </div>

        {/* File Type Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents" className="text-xs">
              <FileArchive className="w-4 h-4 mr-1" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs">
              <FileImage className="w-4 h-4 mr-1" />
              Images
            </TabsTrigger>
            <TabsTrigger value="code" className="text-xs">
              <FileCode className="w-4 h-4 mr-1" />
              Code
            </TabsTrigger>
            <TabsTrigger value="more" className="text-xs">
              More
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-12
            transition-all duration-200
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          data-testid="upload-area"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.css,.js,.zip,.pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
            data-testid="input-file"
          />
          
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-3 rounded-full bg-muted">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-foreground">
                Drag & drop your {selectedTab === "documents" ? "HTML, PHP, ZIP files" : selectedTab === "images" ? "image files" : selectedTab === "code" ? "code files" : "files"} with code and{" "}
                <button 
                  className="text-primary font-medium underline"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                >
                  more
                </button>
              </p>
              <p className="text-sm text-muted-foreground">
                Single file here
              </p>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
          onClick={handleUploadClick}
          disabled={isUploading}
          data-testid="button-upload"
        >
          {isUploading ? 'Uploading...' : 'Upload file'}
        </Button>

        {/* Example Link */}
        <p className="text-center text-xs text-muted-foreground">
          or use an{" "}
          <button className="text-foreground underline font-medium">
            example
          </button>
        </p>
      </div>
    </div>
  );
}
