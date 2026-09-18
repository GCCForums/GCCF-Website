import LogoLoader from "@/components/public/LogoLoader";

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-white py-24">
      <LogoLoader size="lg" text="Global Cybersecurity Community Forums" />
    </div>
  );
}
