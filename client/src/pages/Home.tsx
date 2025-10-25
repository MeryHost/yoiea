import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { SiteCard } from "@/components/SiteCard";
import { SuccessModal } from "@/components/SuccessModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useState } from "react";
import { FileArchive } from "lucide-react";

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
    {
      id: "g7h8i9",
      filename: "my-blog.zip",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      fileType: "zip",
      url: `${window.location.origin}/site/g7h8i9`,
    },
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedSite, setUploadedSite] = useState<Site | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);

  //todo: remove mock functionality
  const handleUpload = async (file: File) => {
    console.log('Upload started:', file.name);
    setIsUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock site
    const newSite: Site = {
      id: Math.random().toString(36).substring(2, 8),
      filename: file.name,
      timestamp: new Date().toISOString(),
      fileType: file.name.endsWith('.zip') ? 'zip' : file.name.split('.').pop() || 'html',
      url: `${window.location.origin}/site/${Math.random().toString(36).substring(2, 8)}`,
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
      
      <main className="pb-16">
        {/* Hero Section with Upload */}
        <section className="py-16 px-6 md:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Host Your Static Sites Instantly
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Drop your HTML, CSS, JS files or ZIP folders and get a shareable URL in seconds. 
                No configuration required.
              </p>
            </div>

            <UploadZone onUpload={handleUpload} isUploading={isUploading} />
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="py-16 px-6 md:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Your Hosted Sites
                {sites.length > 0 && (
                  <span className="ml-3 text-muted-foreground">({sites.length})</span>
                )}
              </h2>
            </div>

            {sites.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-muted">
                    <FileArchive className="w-12 h-12 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No sites yet</h3>
                  <p className="text-muted-foreground">
                    Upload your first site to get started
                  </p>
                </div>
              </div>
            ) : (
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
