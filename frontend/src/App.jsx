function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-surface border border-border rounded-xl p-8 text-center shadow-sm">
        <h1 className="text-4xl font-bold text-primary">
          EventBooking
        </h1>

        <p className="mt-3 text-text-muted">
          Discover and book amazing events.
        </p>

        <button className="mt-6 rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-hover">
          Explore Events
        </button>
      </div>
    </div>
  );
}

export default App;