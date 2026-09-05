export default function AboutSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#3d73bd] mb-3 block">
            About GCCF
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Building a Safer Digital Future
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-slate-600 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <p>
              The Global Cybersecurity Community Forum (GCCF) is a vibrant,
              international platform dedicated to fostering collaboration,
              knowledge sharing, and innovation in cybersecurity.
            </p>
            <p>
              Founded by industry leaders and passionate professionals, we
              bring together experts, learners, and organizations to address
              the ever-evolving challenges in digital security.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              Our mission is to create a trusted ecosystem where members can
              grow their skills, share insights, and contribute to a safer
              digital future.
            </p>
            <p>
              Through events, training programs, and collaborative
              initiatives, we&apos;re building the next generation of cybersecurity
              excellence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
