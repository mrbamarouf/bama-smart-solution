import { siteConfig } from "../config/site";

export function MobileBrand({ horizontal = false }: { horizontal?: boolean }) {
  return (
    <span
      className={`m-brand${horizontal ? " m-brand-horizontal" : ""}`}
      dir="ltr"
    >
      {horizontal && (
        <img
          className="m-brand-symbol"
          src={siteConfig.markWhite}
          alt=""
          width="512"
          height="512"
        />
      )}
      <span className="m-brand-art">
        <img
          src="/images/mobile/bama-logo.webp"
          alt=""
          width="480"
          height="480"
        />
      </span>
    </span>
  );
}
