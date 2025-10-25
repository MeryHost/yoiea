import { Calendar, ExternalLink, Trash2, Copy, Check, FileArchive, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface SiteCardProps {
  id: string;
  filename: string;
  timestamp: string;
  fileType: string;
  url: string;
  onDelete: (id: string) => void;
}

export function SiteCard({ id, filename, timestamp, fileType, url, onDelete }: SiteCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = () => {
    if (fileType === 'zip') {
      return <FileArchive className="w-4 h-4" />;
    }
    return <FileCode className="w-4 h-4" />;
  };

  const getFileTypeBadge = () => {
    const type = fileType.toUpperCase();
    return (
      <Badge variant="secondary" className="gap-1">
        {getFileIcon()}
        {type}
      </Badge>
    );
  };

  return (
    <Card className="p-6 hover-elevate active-elevate-2 transition-all" data-testid={`card-site-${id}`}>
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold truncate" data-testid={`text-filename-${id}`}>
            {filename}
          </h3>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(timestamp)}</span>
            </div>
            {getFileTypeBadge()}
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
          <code className="flex-1 text-sm font-mono truncate" data-testid={`text-url-${id}`}>
            {url}
          </code>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            data-testid={`button-copy-${id}`}
            className="shrink-0"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex-1 gap-2"
            onClick={() => window.open(url, '_blank')}
            data-testid={`button-visit-${id}`}
          >
            <ExternalLink className="w-4 h-4" />
            Visit Site
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            data-testid={`button-delete-${id}`}
            className="shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
