import { ArrowRight, Clock3, ShieldCheck, Stethoscope } from "lucide-react";

export default function HomepageHero() {
  return (
    <section
      id="home"
      className="bg-gradient-to-br from-blue-50 via-white to-cyan-50"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            <Stethoscope size={16} />
            Trusted Healthcare
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Quality Healthcare You Can Trust
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Winston Medical Centre provides compassionate, accessible and
            professional healthcare services for individuals and families.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#appointment"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Book an Appointment
              <ArrowRight size={18} />
            </a>

            <a
              href="#services"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-center font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
            >
              Explore Services
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={22} />
              <span className="text-sm font-medium text-slate-700">
                Trusted Care
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 className="text-blue-600" size={22} />
              <span className="text-sm font-medium text-slate-700">
                Convenient Hours
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Stethoscope className="text-blue-600" size={22} />
              <span className="text-sm font-medium text-slate-700">
                Professional Team
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl bg-blue-600 p-2 shadow-2xl">
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-8 text-center text-white">
              <div>
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/15">
                  <span className="text-6xl font-bold">+</span>
                </div>

                <h3 className="mt-8 text-3xl font-bold">
                  Winston Medical Centre
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-blue-50">
                  Caring for you and your family with professionalism,
                  compassion and respect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}