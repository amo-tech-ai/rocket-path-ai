import { ExternalLink } from "lucide-react";

interface SourceBadgeProps {
  name: string;
  url?: string;
}

const SourceBadge = ({ name, url }: SourceBadgeProps) => {
  const content = (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
      {name}
      {url && <ExternalLink className="w-3 h-3" />}
    </span>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
};

export default SourceBadge;
