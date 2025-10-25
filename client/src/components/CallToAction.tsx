import { ArrowRight } from "lucide-react";

export function CallToAction() {
  return (
    <div className="relative">
      <svg
        className="absolute -top-12 left-0 w-32 h-32 text-primary opacity-40"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M 20 80 Q 50 20 80 50"
          markerEnd="url(#arrowhead)"
        />
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
          </marker>
        </defs>
      </svg>
      <p className="text-lg font-semibold text-primary">
        Try for free
      </p>
    </div>
  );
}
