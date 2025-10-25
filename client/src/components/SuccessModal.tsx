import { CheckCircle, Copy, Check, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteUrl: string;
  siteId: string;
}

export function SuccessModal({ isOpen, onClose, siteUrl, siteId }: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0" data-testid="modal-success">
        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Upload Successful!</h2>
                <p className="text-muted-foreground mt-1">Your site is now live</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Your Site URL
            </label>
            <div className="flex items-center gap-2 p-4 rounded-lg bg-muted border">
              <code className="flex-1 text-base font-mono break-all" data-testid="text-site-url">
                {siteUrl}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                data-testid="button-copy-url"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Site ID
            </label>
            <div className="p-4 rounded-lg bg-muted/50 border">
              <code className="text-lg font-mono font-semibold" data-testid="text-site-id">
                {siteId}
              </code>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="default"
              className="flex-1 gap-2"
              onClick={() => window.open(siteUrl, '_blank')}
              data-testid="button-visit-site"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Site
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-testid="button-back-dashboard"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
