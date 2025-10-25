import { UploadZone } from '../UploadZone';

export default function UploadZoneExample() {
  const handleUpload = (file: File) => {
    console.log('File uploaded:', file.name);
  };

  return (
    <div className="p-8 bg-background min-h-[600px] flex items-center">
      <UploadZone onUpload={handleUpload} />
    </div>
  );
}
