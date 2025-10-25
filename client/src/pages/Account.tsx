import { Header } from "@/components/Header";
import { SiteCard } from "@/components/SiteCard";
import { SuccessModal } from "@/components/SuccessModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Code, Filter, RotateCcw, Settings2, CloudUpload, Plus, Archive } from "lucide-react";

interface Site {
  id: string;
  filename: string;
  timestamp: string;
  fileType: string;
  url: string;
}

export default function Account() {
  //todo: remove mock functionality
  const [sites, setSites] = useState<Site[]>([
    {
      id: "a1b2c3",
      filename: "portfolio-website.zip",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      fileType: "zip",
      url: `${window.location.origin}/site/a1b2c3`,
    },
  ]);

  const [selectedTab, setSelectedTab] = useState("all");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedSite, setUploadedSite] = useState<Site | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);

  const liveSites = sites.length;
  const maxSites = 1;

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

  const handleUploadClick = () => {
    console.log('Upload file clicked');
    // Navigate to home page or open upload modal
    window.location.href = '/';
  };

  const handleAddDomain = () => {
    console.log('Add custom domain clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8 px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all">
                All
              </TabsTrigger>
              <TabsTrigger value="archive" data-testid="tab-archive">
                <Archive className="w-4 h-4 mr-1" />
                0/1
              </TabsTrigger>
              <TabsTrigger value="other" data-testid="tab-other">
                <Plus className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 flex items-center justify-end">
              <Button variant="ghost" size="sm" data-testid="button-archive-menu">
                Archive
              </Button>
            </div>
          </Tabs>

          {/* Live Projects Section */}
          <Card className="p-6">
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">Live Projects</h2>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {liveSites}/{maxSites} live
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" data-testid="button-code-view">
                    <Code className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" data-testid="button-filter">
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" data-testid="button-refresh">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" data-testid="button-settings">
                    <Settings2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    className="ml-2 gap-2"
                    onClick={handleUploadClick}
                    data-testid="button-upload-file"
                  >
                    <CloudUpload className="w-4 h-4" />
                    Upload file
                  </Button>
                </div>
              </div>

              {/* Projects List */}
              {sites.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <p className="text-muted-foreground">No live projects</p>
                  <Button 
                    variant="outline"
                    onClick={handleUploadClick}
                    data-testid="button-upload-file-empty"
                  >
                    Upload file
                  </Button>
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
          </Card>

          {/* Custom Domains Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Custom Domains</h2>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleAddDomain}
                data-testid="button-add-domain"
              >
                <Plus className="w-4 h-4" />
                Add new
              </Button>
            </div>

            {/* Empty state for custom domains */}
            <div className="mt-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No custom domains configured
              </p>
            </div>
          </Card>
        </div>
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
