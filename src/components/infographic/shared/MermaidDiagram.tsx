import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "base",
  securityLevel: "loose",
  themeVariables: {
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    primaryColor: "#f1f5f9",
    primaryTextColor: "#1e293b",
    primaryBorderColor: "#cbd5e1",
    lineColor: "#64748b",
    secondaryColor: "#f8fafc",
    tertiaryColor: "#fff",
  },
});

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart).then((result) => {
        ref.current!.innerHTML = result.svg;
      });
    }
  }, [chart]);

  return <div ref={ref} className="mermaid-diagram w-full flex justify-center" />;
};

export default MermaidDiagram;
