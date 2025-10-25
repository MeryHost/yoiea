import { Header } from "@/components/Header";
import { UploadCard } from "@/components/UploadCard";
import { Testimonial } from "@/components/Testimonial";
import { CallToAction } from "@/components/CallToAction";
import { SuccessModal } from "@/components/SuccessModal";
import { useState } from "react";
import { useLocation } from "wouter";

interface Site {
  id: string;
  filename: string;
  timestamp: string;
  fileType: string;
  url: string;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedSite, setUploadedSite] = useState<Site | null>(null);

  //todo: remove mock functionality
  const handleUpload = async (file: File, linkName: string) => {
    console.log('Upload started:', file.name, 'Link name:', linkName);
    setIsUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock site
    const newSite: Site = {
      id: Math.random().toString(36).substring(2, 8),
      filename: file.name,
      timestamp: new Date().toISOString(),
      fileType: file.name.endsWith('.zip') ? 'zip' : file.name.split('.').pop() || 'html',
      url: `${window.location.origin}/site/${linkName || Math.random().toString(36).substring(2, 8)}`,
    };

    setUploadedSite(newSite);
    setIsUploading(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Redirect to account page after upload
    setLocation('/account');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
                The simplest way to host &<br />share your work online
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-16">
              {/* Left: Testimonial */}
              <div className="hidden lg:block lg:w-64 lg:pt-16">
                <Testimonial />
              </div>

              {/* Center: Upload Card */}
              <div className="flex-shrink-0">
                <UploadCard onUpload={handleUpload} isUploading={isUploading} />
              </div>

              {/* Right: CTA */}
              <div className="hidden lg:block lg:w-48 lg:pt-24">
                <CallToAction />
              </div>
            </div>

            {/* Mobile Testimonial */}
            <div className="lg:hidden mt-12 flex justify-center">
              <Testimonial />
            </div>
          </div>
        </section>
      </main>

      {/* Success Modal */}
      {uploadedSite && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
          siteUrl={uploadedSite.url}
          siteId={uploadedSite.id}
        />
      )}
    </div>
  );
}
