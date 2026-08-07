/**
 * ResponsiveImage Component
 * Provides WebP images with fallback to JPG for older browsers
 * Automatic lazy loading for better performance
 */

interface ResponsiveImageProps {
  webpSrc: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

export function ResponsiveImage({
  webpSrc,
  fallbackSrc,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  priority = false,
}: ResponsiveImageProps) {
  // If priority is true, load eagerly
  const loadingStrategy = priority ? "eager" : loading;

  return (
    <picture>
      {/* Modern browsers: WebP */}
      <source srcSet={webpSrc} type="image/webp" />
      
      {/* Fallback for older browsers: JPG */}
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loadingStrategy}
      />
    </picture>
  );
}
