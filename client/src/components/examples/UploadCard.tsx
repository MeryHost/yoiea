import { UploadCard } from '../UploadCard';

export default function UploadCardExample() {
  const handleUpload = (file: File, linkName: string) => {
    console.log('File uploaded:', file.name, 'Link:', linkName);
  };

  return (
    <div className="p-8 bg-background min-h-[700px] flex items-center justify-center">
      <UploadCard onUpload={handleUpload} />
    </div>
  );
}
