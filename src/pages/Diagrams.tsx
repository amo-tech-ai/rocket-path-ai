import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DIAGRAM_DEFINITIONS } from "@/data/diagramDefinitions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  flowchart: { useMaxWidth: true },
  sequence: { useMaxWidth: true },
});

export default function Diagrams() {
  const [selectedId, setSelectedId] = useState<string>(DIAGRAM_DEFINITIONS[0]?.id ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selected = DIAGRAM_DEFINITIONS.find((d) => d.id === selectedId);

  useEffect(() => {
    if (!selected || !containerRef.current) return;

    setLoading(true);
    setError(null);

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const wrapper = document.createElement("div");
    wrapper.className = "mermaid";
    wrapper.textContent = selected.mermaid;
    containerRef.current.appendChild(wrapper);

    mermaid
      .run({
        nodes: [wrapper],
        suppressErrors: true,
      })
      .then(() => {
        const svg = wrapper.querySelector("svg");
        if (svg) {
          svg.setAttribute("style", "max-width: 100%; height: auto;");
        }
      })
      .catch((err) => {
        setError(err?.message ?? "Failed to render diagram");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedId, selected]);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Diagrams</h1>
          <p className="text-muted-foreground">
            View Mermaid diagrams from tasks/diagrams. Run the app and open /diagrams.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="Select a diagram" />
            </SelectTrigger>
            <SelectContent>
              {DIAGRAM_DEFINITIONS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.title} {d.phase ? `(${d.phase})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selected?.title}</CardTitle>
            {selected?.phase && (
              <span className="text-sm text-muted-foreground">{selected.phase}</span>
            )}
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] overflow-auto rounded-md border bg-white p-4 dark:bg-background">
              {loading && <Skeleton className="h-[300px] w-full" />}
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div ref={containerRef} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
