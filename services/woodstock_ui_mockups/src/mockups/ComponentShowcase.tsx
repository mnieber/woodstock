import { TraceStateBadge } from "../components/TraceStateBadge";
import { RefreshButton } from "../components/RefreshButton";
import { PayloadField } from "../components/PayloadField";

export default function ComponentShowcase() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Component Showcase</h1>

      {/* Trace State Badges */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Trace State Badges</h2>
        <div className="flex gap-4 flex-wrap">
          <TraceStateBadge state="ok" />
          <TraceStateBadge state="warn" />
          <TraceStateBadge state="error" />
        </div>
      </section>

      {/* Refresh Button */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Refresh Button</h2>
        <div className="flex gap-4 flex-wrap">
          <RefreshButton />
          <RefreshButton loading={true} />
        </div>
      </section>

      {/* Payload Fields */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Payload Fields</h2>
        <div className="bg-white border rounded-lg p-6 space-y-1">
          <PayloadField fieldKey="status" value="completed" type="value" />
          <PayloadField
            fieldKey="documentation"
            value="https://example.com/docs"
            type="link"
          />
          <PayloadField
            fieldKey="retry_of"
            value="job-121/calc-456"
            type="ref"
          />
          <PayloadField fieldKey="config" value="config.json" type="tree" />
        </div>
      </section>
    </div>
  );
}
