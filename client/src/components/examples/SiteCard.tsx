import { SiteCard } from '../SiteCard';

export default function SiteCardExample() {
  const handleDelete = (id: string) => {
    console.log('Delete site:', id);
  };

  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <SiteCard
          id="abc123"
          filename="my-portfolio.zip"
          timestamp={new Date().toISOString()}
          fileType="zip"
          url="https://meryhost.com/site/abc123"
          onDelete={handleDelete}
        />
        <SiteCard
          id="def456"
          filename="landing-page.html"
          timestamp={new Date(Date.now() - 86400000).toISOString()}
          fileType="html"
          url="https://meryhost.com/site/def456"
          onDelete={handleDelete}
        />
        <SiteCard
          id="ghi789"
          filename="web-project.zip"
          timestamp={new Date(Date.now() - 172800000).toISOString()}
          fileType="zip"
          url="https://meryhost.com/site/ghi789"
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
