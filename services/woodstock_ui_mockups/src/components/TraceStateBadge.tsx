type TraceState = "ok" | "warn" | "error";

interface TraceStateBadgeProps {
  state: TraceState;
}

export function TraceStateBadge(props: TraceStateBadgeProps) {
  const colors = {
    ok: "bg-green-100 text-green-800 border-green-200",
    warn: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[props.state]}`}
    >
      {props.state}
    </span>
  );
}
