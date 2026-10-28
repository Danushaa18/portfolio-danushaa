import Image from "next/image";
import { site } from "@/content/site";

/**
 * The portrait, art-directed through `site.portrait.focus`.
 * Without a configured image it renders a clearly marked slot instead of a
 * stand-in face, so nobody else's likeness ever appears on the page.
 */
export function Portrait({ priority = false, sizes = "(min-width: 1024px) 30vw, 80vw" }: { priority?: boolean; sizes?: string }) {
  const { src, alt, focus } = site.portrait;

  if (!src) {
    return (
      <div className="portrait portrait--empty" role="img" aria-label="Portrait placeholder">
        <svg className="portrait__grid" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 125">
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="125" />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} />
          ))}
        </svg>
        <span className="portrait__slot">
          <span>Portrait slot</span>
          <small>Add your photo to /public and set portrait.src in src/content/site.ts</small>
        </span>
      </div>
    );
  }

  return (
    <div className="portrait">
      <Image
        className="portrait__img"
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectFit: "cover", objectPosition: focus }}
      />
    </div>
  );
}
