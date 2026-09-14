import {
  FiShield,
  FiClock,
  FiCheckCircle,
  FiHeadphones,
} from "react-icons/fi";

const benefits = [
  {
    icon: FiShield,
    title: "Secure Booking",
    description:
      "Your booking is protected with OTP verification and secure authentication.",
  },
  {
    icon: FiClock,
    title: "Simple Process",
    description:
      "Find an event, choose your seats, and submit your booking in just a few steps.",
  },
  {
    icon: FiCheckCircle,
    title: "Verified Bookings",
    description:
      "Every booking request is verified before it is confirmed by the admin.",
  },
  {
    icon: FiHeadphones,
    title: "Easy Management",
    description:
      "Keep track of your booking status, event details, seats, and payment status in one place.",
  },
];

const WhyEventBooking = () => {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Why Choose Us
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Why EventBooking?
          </h2>

          <p className="mt-4 text-text-muted">
            We make event booking simple, secure, and easy to manage from
            start to finish.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-border bg-surface p-7 text-center transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="text-2xl text-primary" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-text">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-text-muted">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyEventBooking;
