import Image, { type ImageProps } from "next/image";

/** Обёртка над next/image: SVG-гравюры отдаются как есть, фото — оптимизируются. */
export function ArtImage({ alt, src, ...props }: ImageProps) {
  const isSvg = typeof src === "string" && src.endsWith(".svg");
  return <Image alt={alt} src={src} unoptimized={isSvg || props.unoptimized} draggable={false} {...props} />;
}
