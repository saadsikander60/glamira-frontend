import {
  shopContainerClass,
  shopGlowLeft,
  shopGlowRight,
  shopPageClass,
} from "@/components/shop/shopStyles";

interface ShopPageShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function ShopPageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: ShopPageShellProps) {
  return (
    <section className={shopPageClass}>
      <div className={shopGlowRight} />
      <div className={shopGlowLeft} />

      <div className={shopContainerClass}>
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="text-sm font-medium tracking-[0.3em] text-pink-200 uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 font-serif text-4xl font-bold text-white md:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 text-pink-100">{description}</p>
            ) : null}
          </div>
          {actions}
        </div>

        {children}
      </div>
    </section>
  );
}
