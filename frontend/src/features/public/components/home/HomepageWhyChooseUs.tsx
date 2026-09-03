import { Clock, HeartHandshake, ShieldCheck } from "lucide-react";

const reasons = [
  {
    title: "Compassionate Care",
    description:
      "We treat every patient with respect, dignity and understanding.",
    icon: HeartHandshake,
  },
  {
    title: "Trusted Professionals",
    description:
      "Our healthcare team is committed to professional and quality service.",
    icon: ShieldCheck,
  },
  {
    title: "Convenient Healthcare",
    description:
      "We strive to make essential healthcare services accessible to our community.",
    icon: Clock,
  },
];

export default function HomepageWhyChooseUs() {
  return (
    <section className="bg-blue-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Why Choose Us
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Your Health Matters to Us
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <div
                key={reason.title}
                className="rounded-2xl bg-white p-7 text-center shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Icon size={27} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {reason.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}






