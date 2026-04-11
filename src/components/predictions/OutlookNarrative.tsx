"use client";

interface OutlookNarrativeProps {
  narrative: string | null;
  aiDisclaimerText: string;
  aiAnalysisTitle: string;
}

export function OutlookNarrative({ narrative, aiDisclaimerText, aiAnalysisTitle }: OutlookNarrativeProps) {
  if (!narrative) return null;

  return (
    <div className="p-6 rounded-DEFAULT border border-border bg-surface-1">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-bold text-content-0">{aiAnalysisTitle}</h2>
        <span className="text-[10px] text-content-3 bg-surface-2 px-2 py-0.5 rounded border border-border">
          {aiDisclaimerText}
        </span>
      </div>
      <p className="text-sm text-content-1 leading-relaxed">{narrative}</p>
    </div>
  );
}
