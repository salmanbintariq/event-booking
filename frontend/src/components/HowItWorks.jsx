import { FiSearch, FiShield, FiCheckCircle } from "react-icons/fi";

const steps = [
  {
    icon: FiSearch,
    number: "01",
    title: "Find an Event",
    description:
      "Browse upcoming events and find one that matches your interests.",
  },
  {
    icon: FiShield,
    number: "02",
    title: "Book Your Seats",
    description:
      "Choose the number of seats you need and submit your booking request.",
  },
  {
    icon: FiCheckCircle,
    number: "03",
    title: "Verify & Confirm",
    description:
      "Verify your booking with OTP and wait for admin confirmation.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Simple Process
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            How It Works
          </h2>

          <p className="mt-4 text-text-muted">
            Booking your next event is simple. Find an event, reserve your
            seats, and get your booking confirmed.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-border bg-background p-8 text-center transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Step number */}
                <span className="absolute right-5 top-5 text-sm font-bold text-primary/30">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="text-2xl text-primary" />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-semibold text-text">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-text-muted">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
