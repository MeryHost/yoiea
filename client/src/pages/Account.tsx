import { Header } from "@/components/Header";
import { SiteCard } from "@/components/SiteCard";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Code, Filter, RotateCcw, Settings2, CloudUpload, Plus, Archive } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Site {
  id: string;
  filename: string;
  uploadedAt: string;
  fileType: string;
  customLink: string | null;
  url: string;
}

export default function Account() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  const { toast } = useToast();

  // Fetch all sites
  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ['/api/sites'],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/sites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sites'] });
      toast({
        title: "Site deleted",
        description: "Your site has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete site. Please try again.",
        variant: "destructive",
      });
    },
  });

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
      deleteMutation.mutate(siteToDelete.id);
      setSiteToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleUploadClick = () => {
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
                    className="ml-2"
                    onClick={handleUploadClick}
                    data-testid="button-upload-file-header"
                  >
                    <CloudUpload className="w-4 h-4 mr-2" />
                    Upload file
                  </Button>
                </div>
              </div>

              {/* Sites List or Empty State */}
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading sites...
                </div>
              ) : sites.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No live projects</p>
                  <Button 
                    variant="outline"
                    onClick={handleUploadClick}
                    data-testid="button-upload-file-empty"
                  >
                    Upload file
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {sites.map((site) => (
                    <SiteCard
                      key={site.id}
                      id={site.id}
                      filename={site.filename}
                      timestamp={site.uploadedAt}
                      fileType={site.fileType}
                      url={`${window.location.origin}${site.url}`}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Custom Domains Section */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Custom Domains</h2>
                <Button 
                  variant="outline"
                  onClick={handleAddDomain}
                  data-testid="button-add-domain"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add new
                </Button>
              </div>

              <div className="text-center py-12 text-muted-foreground">
                No custom domains configured
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        siteName={siteToDelete?.filename || ''}
      />
    </div>
  );
}
