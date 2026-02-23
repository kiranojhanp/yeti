import { Download, FileCode2, Play } from "lucide-react";
import Image from "next/image";

type TokenKind =
  | "keyword"
  | "type"
  | "annotation"
  | "identifier"
  | "number"
  | "comment"
  | "plain";

type CodeToken = {
  text: string;
  kind: TokenKind;
};

type CodeLine = {
  tokens: CodeToken[];
};

const yetiLines: CodeLine[] = [
  {
    tokens: [
      { text: "namespace", kind: "keyword" },
      { text: " todo_app", kind: "identifier" },
      { text: ":", kind: "plain" },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { text: "entity", kind: "keyword" },
      { text: " users", kind: "identifier" },
      { text: ":", kind: "plain" },
    ],
  },
  {
    tokens: [
      { text: "  id", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " serial", kind: "type" },
      { text: " ", kind: "plain" },
      { text: "@pk", kind: "annotation" },
    ],
  },
  {
    tokens: [
      { text: "  username", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " varchar", kind: "type" },
    ],
  },
  {
    tokens: [
      { text: "  email", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " varchar", kind: "type" },
      { text: " ", kind: "plain" },
      { text: "@unique", kind: "annotation" },
    ],
  },
  {
    tokens: [
      { text: "  created_at", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " timestamp", kind: "type" },
      { text: " ", kind: "plain" },
      { text: "@default", kind: "annotation" },
      { text: "(now())", kind: "plain" },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { text: "entity", kind: "keyword" },
      { text: " projects", kind: "identifier" },
      { text: ":", kind: "plain" },
    ],
  },
  {
    tokens: [
      { text: "  id", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " serial", kind: "type" },
      { text: " ", kind: "plain" },
      { text: "@pk", kind: "annotation" },
    ],
  },
  {
    tokens: [
      { text: "  owner_id", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " integer", kind: "type" },
      { text: " ", kind: "plain" },
      { text: "@fk", kind: "annotation" },
      { text: "(> users.id)", kind: "plain" },
    ],
  },
  {
    tokens: [
      { text: "  name", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " varchar", kind: "type" },
    ],
  },
  {
    tokens: [
      { text: "  visibility", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " varchar", kind: "type" },
    ],
  },
  {
    tokens: [
      { text: "  created_at", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " timestamp", kind: "type" },
      { text: " ", kind: "plain" },
      { text: "@default", kind: "annotation" },
      { text: "(now())", kind: "plain" },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { text: "entity", kind: "keyword" },
      { text: " tasks", kind: "identifier" },
      { text: ":", kind: "plain" },
    ],
  },
  {
    tokens: [
      { text: "  id", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " serial", kind: "type" },
      { text: " ", kind: "plain" },
      { text: "@pk", kind: "annotation" },
    ],
  },
  {
    tokens: [
      { text: "  project_id", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " integer", kind: "type" },
      { text: " ", kind: "plain" },
      { text: "@fk", kind: "annotation" },
      { text: "(> projects.id)", kind: "plain" },
    ],
  },
  {
    tokens: [
      { text: "  assignee_id", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " integer", kind: "type" },
      { text: " ", kind: "plain" },
      { text: "@fk", kind: "annotation" },
      { text: "(> users.id)", kind: "plain" },
    ],
  },
  {
    tokens: [
      { text: "  title", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " varchar", kind: "type" },
    ],
  },
  {
    tokens: [
      { text: "  description", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " text", kind: "type" },
    ],
  },
  {
    tokens: [
      { text: "  status", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " varchar", kind: "type" },
    ],
  },
  {
    tokens: [
      { text: "  created_at", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " timestamp", kind: "type" },
      { text: " ", kind: "plain" },
      { text: "@default", kind: "annotation" },
      { text: "(now())", kind: "plain" },
    ],
  },
  {
    tokens: [
      { text: "  due_date", kind: "identifier" },
      { text: ":", kind: "plain" },
      { text: " timestamp", kind: "type" },
    ],
  },
];

export function DashboardMockup() {
  return (
    <div className="group relative">
      <div className="rounded-2xl border border-foreground/15 bg-background/50 p-2 shadow-2xl backdrop-blur-xl transition duration-700 group-hover:scale-[1.01] md:rounded-[2rem] md:p-3">
        <div className="relative overflow-hidden rounded-xl border border-foreground/10 bg-background shadow-inner">
          <div className="flex items-center gap-2 border-b border-foreground/10 bg-card/40 px-3 py-2.5 md:px-4 md:py-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            </div>
            <div className="ml-2 hidden items-center gap-2 rounded-md border border-foreground/10 bg-background px-2.5 py-1 text-[10px] font-mono text-muted-foreground sm:flex">
              <FileCode2 className="h-3 w-3" />
              schema/main.yeti
            </div>
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <button
                aria-label="Generate"
                className="inline-flex items-center gap-1 rounded-md border border-foreground/15 bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground transition hover:text-foreground sm:gap-1.5 sm:px-2.5"
              >
                <Play className="h-3 w-3" />
                <span className="hidden sm:inline">Generate</span>
              </button>
              <button
                aria-label="Export SQL"
                className="inline-flex items-center gap-1 rounded-md border border-foreground/15 bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground transition hover:text-foreground sm:gap-1.5 sm:px-2.5"
              >
                <Download className="h-3 w-3" />
                <span className="hidden sm:inline">Export SQL</span>
              </button>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 bg-background lg:min-h-[620px] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <section className="flex max-h-[280px] flex-col border-b border-foreground/10 bg-slate-950 text-slate-100 sm:max-h-[320px] lg:max-h-none lg:border-b-0 lg:border-r lg:border-foreground/10">
              <div className="relative flex-1 overflow-y-auto overscroll-contain bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] px-2 py-3 sm:px-4 sm:py-4 lg:overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-12 border-r border-white/10 bg-white/[0.02] sm:w-14" />
                <div className="relative z-10 space-y-1 font-mono text-[11px] leading-6 sm:text-xs">
                  {yetiLines.map((line, idx) => (
                    <div key={idx} className="group/line flex items-start">
                      <span className="w-10 pr-3 text-right text-slate-500 transition group-hover/line:text-slate-300 sm:w-12">
                        {idx + 1}
                      </span>
                      <span className="flex-1 whitespace-pre-wrap pl-1">
                        {line.tokens.map((token, tokenIdx) => (
                          <span
                            key={tokenIdx}
                            className={tokenClassName(token.kind)}
                          >
                            {token.text}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="relative min-h-[300px] overflow-hidden bg-slate-100 lg:min-h-[420px]">
              <div className="absolute inset-0">
                <Image
                  src="/diagram.png"
                  alt="Generated schema diagram"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1023px) 100vw, 55vw"
                  priority
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function tokenClassName(kind: TokenKind): string {
  switch (kind) {
    case "keyword":
      return "text-cyan-300";
    case "type":
      return "text-orange-300";
    case "annotation":
      return "text-emerald-300";
    case "identifier":
      return "text-slate-100";
    case "number":
      return "text-fuchsia-300";
    case "comment":
      return "text-slate-500";
    default:
      return "text-slate-300";
  }
}
