import { Header } from "@/components/Header";
import { UploadCard } from "@/components/UploadCard";
import { Testimonial } from "@/components/Testimonial";
import { CallToAction } from "@/components/CallToAction";
import { SiteCard } from "@/components/SiteCard";
import { SuccessModal } from "@/components/SuccessModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Site {
  id: string;
  filename: string;
  timestamp: string;
  fileType: string;
  url: string;
}

export default function Home() {
  //todo: remove mock functionality
  const [sites, setSites] = useState<Site[]>([
    {
      id: "a1b2c3",
      filename: "portfolio-website.zip",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      fileType: "zip",
      url: `${window.location.origin}/site/a1b2c3`,
    },
    {
      id: "d4e5f6",
      filename: "landing-page.html",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      fileType: "html",
      url: `${window.location.origin}/site/d4e5f6`,
    },
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedSite, setUploadedSite] = useState<Site | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  const [showAllSites, setShowAllSites] = useState(false);

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

    setSites([newSite, ...sites]);
    setUploadedSite(newSite);
    setIsUploading(false);
    setShowSuccessModal(true);
  };

  const handleDeleteClick = (id: string) => {
    const site = sites.find(s => s.id === id);
    if (site) {
      setSiteToDelete(site);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (siteToDelete) {
      console.log('Deleting site:', siteToDelete.id);
      setSites(sites.filter(s => s.id !== siteToDelete.id));
      setSiteToDelete(null);
    }
    setDeleteDialogOpen(false);
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

        {/* Sites Section - Collapsible */}
        {sites.length > 0 && (
          <section className="py-8 px-6 md:px-8 border-t bg-muted/20">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => setShowAllSites(!showAllSites)}
                className="flex items-center justify-between w-full mb-6 hover-elevate active-elevate-2 rounded-lg p-4"
                data-testid="button-toggle-sites"
              >
                <h2 className="text-xl md:text-2xl font-semibold">
                  Your Hosted Sites ({sites.length})
                </h2>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${showAllSites ? 'rotate-180' : ''}`}
                />
              </button>

              {showAllSites && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sites.map((site) => (
                    <SiteCard
                      key={site.id}
                      {...site}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Modals */}
      {uploadedSite && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          siteUrl={uploadedSite.url}
          siteId={uploadedSite.id}
        />
      )}

      {siteToDelete && (
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSiteToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          siteName={siteToDelete.filename}
        />
      )}
    </div>
  );
}
