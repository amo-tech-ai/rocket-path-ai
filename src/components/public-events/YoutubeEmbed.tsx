/**
 * Responsive YouTube embed. Accepts watch URL, youtu.be, or embed URL.
 * No extra deps; 16:9 responsive via padding-bottom. See:
 * https://dev.to/bravemaster619/simplest-way-to-embed-a-youtube-video-in-your-react-app-3bk2
 */

function getYouTubeVideoId(url: string): string | null {
  if (!url?.trim()) return null;
  try {
    // https://www.youtube.com/watch?v=HBy_Df6XlJg
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];
    // https://youtu.be/HBy_Df6XlJg
    const shortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];
    // https://www.youtube.com/embed/HBy_Df6XlJg
    const embedMatch = url.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
    return null;
  } catch {
    return null;
  }
}

interface YoutubeEmbedProps {
  /** YouTube URL: watch, youtu.be, or embed */
  url: string;
  title?: string;
  className?: string;
}

export function YoutubeEmbed({ url, title = 'YouTube video', className = '' }: YoutubeEmbedProps) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  const embedSrc = `https://www.youtube.com/embed/${videoId}?rel=0`;

  return (
    <div className={`overflow-hidden rounded-lg border border-border bg-muted ${className}`}>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute left-0 top-0 h-full w-full"
        />
      </div>
    </div>
  );
}
