import { CheckCircle2 } from "lucide-react";

const points = [
  "Patient-focused healthcare",
  "Qualified medical professionals",
  "Clean and welcoming environment",
  "Accessible and convenient services",
];

export default function HomepageAbout() {
  return (
    <section id="about" className="bg-slate-50 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl bg-blue-600 p-10 text-white">
          <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-white/20 bg-white/10">
            <div className="text-center">
              <span className="text-7xl font-bold">+</span>
              <p className="mt-4 text-xl font-semibold">
                Caring for Your Health
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            About Us
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Healthcare Built Around You
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            Winston Medical Centre is committed to providing quality
            healthcare in a safe, respectful and patient-friendly environment.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            Our goal is to make healthcare accessible while treating every
            patient with dignity and compassion.
          </p>

          <div className="mt-7 space-y-4">
            {points.map((point) => (
              <div key={point} className="flex items-center gap-3">
                <CheckCircle2 className="shrink-0 text-blue-600" size={21} />
                <span className="font-medium text-slate-700">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
