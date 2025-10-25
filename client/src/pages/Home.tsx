import { Header } from "@/components/Header";
import { UploadCard } from "@/components/UploadCard";
import { Testimonial } from "@/components/Testimonial";
import { CallToAction } from "@/components/CallToAction";
import { SuccessModal } from "@/components/SuccessModal";
import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

interface UploadResponse {
  success: boolean;
  site: {
    id: string;
    filename: string;
    uploadedAt: string;
    fileType: string;
    customLink: string | null;
    url: string;
  };
  url: string;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedSite, setUploadedSite] = useState<UploadResponse['site'] | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, linkName }: { file: File; linkName: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('customLink', linkName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return response.json() as Promise<UploadResponse>;
    },
    onSuccess: (data) => {
      setUploadedSite(data.site);
      setShowSuccessModal(true);
      toast({
        title: "Upload successful!",
        description: "Your site is now live.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to upload files.",
          variant: "destructive",
        });
        setLocation("/login");
        return;
      }
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpload = async (file: File, linkName: string) => {
    if (!isAuthenticated && !authLoading) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to upload files.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }
    uploadMutation.mutate({ file, linkName });
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Redirect to account page after upload
    setLocation('/account');
  };

  const siteUrl = uploadedSite ? `${window.location.origin}${uploadedSite.url}` : '';

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
                <UploadCard onUpload={handleUpload} isUploading={uploadMutation.isPending} />
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
          siteUrl={siteUrl}
          siteId={uploadedSite.id}
        />
      )}
    </div>
  );
}
