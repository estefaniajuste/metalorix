import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/icon-192.png"
        alt=""
        width={192}
        height={192}
        className="h-full w-auto"
        priority
      />
      <span className="text-[15px] font-bold tracking-wide text-brand-gold">
        METALORIX
      </span>
    </span>
  );
}
