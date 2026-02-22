import {
  Inbox,
  CalendarDays,
  Star,
  PlusCircle,
  Bell,
  Search,
  Flame,
  MoreHorizontal,
  ChevronRight,
  FileText,
  LayoutGrid,
  Table,
  Sparkles,
  ArrowRight,
} from "lucide-react"

export function DashboardMockup() {
  return (
    <div className="relative group">
      <div className="rounded-t-2xl md:rounded-t-[2rem] border-t border-x border-foreground/15 bg-background/50 backdrop-blur-xl shadow-2xl p-2 md:p-3 transform transition duration-1000 hover:scale-[1.01]">
        <div className="bg-background rounded-xl overflow-hidden shadow-inner border border-foreground/10 relative">
          {/* Browser Bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10 bg-card/30">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            <div className="mx-auto hidden sm:block bg-background border border-foreground/10 rounded px-3 text-[10px] text-muted-foreground py-1 w-64 text-center font-mono">
              vantage.app/dashboard
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-12 h-[500px] md:h-[650px] w-full bg-background relative">
            {/* Sidebar */}
            <div className="hidden md:flex col-span-2 border-r border-foreground/10 bg-card/20 flex-col p-4">
              {/* User Profile */}
              <div className="flex items-center gap-3 mb-8 px-2 transition hover:bg-card p-2 rounded-lg cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-card border border-foreground/10 shadow-sm flex items-center justify-center text-xs font-bold text-foreground">
                  AL
                </div>
                <div className="text-xs font-bold text-foreground">{"Alex's Space"}</div>
              </div>

              {/* Nav Items */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 px-2 py-2 bg-background border border-foreground/15 shadow-sm rounded-md text-foreground text-xs font-medium cursor-pointer">
                  <Inbox className="w-3.5 h-3.5 text-accent-foreground" />
                  Inbox
                  <span className="ml-auto text-muted-foreground bg-card/50 px-1.5 rounded-full text-[10px]">
                    4
                  </span>
                </div>
                <div className="flex items-center gap-2 px-2 py-2 text-muted-foreground text-xs hover:bg-card rounded-md transition cursor-pointer">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Today
                </div>
                <div className="flex items-center gap-2 px-2 py-2 text-muted-foreground text-xs hover:bg-card rounded-md transition cursor-pointer">
                  <Star className="w-3.5 h-3.5" />
                  Favorites
                </div>
              </div>

              {/* Projects */}
              <div className="mt-8 mb-2 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Projects
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2 px-2 py-1.5 text-foreground/70 text-xs hover:bg-card rounded-md transition cursor-pointer">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Launch V2
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-foreground/70 text-xs hover:bg-card rounded-md transition cursor-pointer">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8A9C9]" />
                  Website Redesign
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-foreground/70 text-xs hover:bg-card rounded-md transition cursor-pointer">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Q3 Goals
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-auto px-2 border-t border-foreground/10 pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs cursor-pointer hover:text-foreground transition">
                  <PlusCircle className="w-4 h-4" />
                  New Page
                </div>
              </div>
            </div>

            {/* Main Area */}
            <div className="col-span-12 md:col-span-10 p-6 md:p-8 bg-background bg-[radial-gradient(#dbe3e980_1px,transparent_1px)] [background-size:20px_20px] flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">
                    Good morning, Alex
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {"Here's your overview for Monday, Oct 24."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-full bg-background border border-foreground/15 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition shadow-sm">
                    <Bell className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-background border border-foreground/15 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition shadow-sm">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Widgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-8">
                {/* Left Column: Files + Editor */}
                <div className="col-span-2 flex flex-col gap-6">
                  {/* Recently Viewed */}
                  <div className="bg-background border border-foreground/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                        <span className="text-accent-foreground">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4-2.42z"/></svg>
                        </span>
                        Recently Viewed
                      </h4>
                      <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground">
                        VIEW ALL
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <FileRow
                        icon={<FileText className="w-4 h-4 text-blue-500" />}
                        name="Product Requirements.md"
                        detail="Edited 20m ago"
                      />
                      <FileRow
                        icon={<LayoutGrid className="w-4 h-4 text-[#B8A9C9]" />}
                        name="October Sprint"
                        detail="Updated by Sarah"
                      />
                      <FileRow
                        icon={<Table className="w-4 h-4 text-green-500" />}
                        name="Q4 Budget"
                        detail="Edited yesterday"
                      />
                    </div>
                  </div>

                  {/* Editor Peek */}
                  <div className="hidden sm:block flex-1 bg-background border border-foreground/10 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-foreground/20 transition">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                        Draft
                      </div>
                      <div className="text-[10px] text-muted-foreground/60">
                        Last saved 2m ago
                      </div>
                    </div>
                    <h2 className="text-xl font-serif font-bold mb-4 text-foreground">
                      Manifesto v1: The Art of Focus
                    </h2>
                    <div className="flex flex-col gap-3 opacity-60">
                      <div className="h-2 bg-card rounded w-full" />
                      <div className="h-2 bg-card rounded w-11/12" />
                      <div className="h-2 bg-card rounded w-4/5" />
                      <div className="h-2 bg-card rounded w-full" />
                    </div>
                    {/* Selection highlight */}
                    <div className="absolute top-[55%] left-6 right-20 h-6 bg-accent/30 -translate-y-1/2 rounded border-l-2 border-accent" />
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  {/* Focus Timer */}
                  <div className="bg-foreground text-background p-6 rounded-2xl shadow-xl flex flex-col justify-between h-48 relative overflow-hidden group transition hover:-translate-y-1 duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-accent/30 transition duration-700" />
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-background/50 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-accent" />
                          Focus Mode
                        </div>
                        <button className="text-background/40 hover:text-background">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-4xl font-serif font-medium tracking-tight text-background">
                        24:59
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-xs text-background/60 mb-2">
                        <span>{"Writing \"Deep Work\""}</span>
                        <span className="text-accent font-bold">85%</span>
                      </div>
                      <div className="w-full bg-background/10 h-1.5 rounded-full overflow-hidden">
                        <div className="w-[85%] bg-accent h-full rounded-full relative overflow-hidden">
                          <div
                            className="absolute inset-0 bg-background/20 w-full"
                            style={{ animation: "shimmer 2s infinite" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Task List */}
                  <div className="rounded-2xl border border-foreground/10 bg-background p-5 shadow-sm flex-1 flex flex-col">
                    <h4 className="font-bold text-foreground text-sm mb-4 flex justify-between items-center">
                      Up Next
                      <span className="w-5 h-5 rounded-full bg-card text-foreground text-[10px] flex items-center justify-center">
                        3
                      </span>
                    </h4>
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex items-start gap-3 group">
                        <div className="w-4 h-4 border-2 border-foreground/20 rounded mt-0.5 group-hover:border-accent cursor-pointer transition" />
                        <span className="text-xs font-medium text-muted-foreground line-through decoration-foreground/15">
                          Morning Sync
                        </span>
                      </div>
                      <div className="flex items-start gap-3 group">
                        <div className="w-4 h-4 border-2 border-accent bg-accent/20 rounded mt-0.5 cursor-pointer flex items-center justify-center">
                          <div className="w-2 h-2 bg-accent-foreground rounded-sm" />
                        </div>
                        <div>
                          <span className="text-xs font-medium text-foreground">
                            Ship landing page
                          </span>
                          <span className="block text-[10px] font-bold mt-1 bg-accent/30 text-accent-foreground px-1.5 py-0.5 rounded w-fit">
                            High Priority
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 group">
                        <div className="w-4 h-4 border-2 border-foreground/20 rounded mt-0.5 group-hover:border-accent cursor-pointer transition" />
                        <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground transition">
                          Review designs for mobile
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating AI Summary */}
            <div className="absolute bottom-12 right-12 bg-background/95 backdrop-blur-xl shadow-2xl border border-foreground/10 p-4 rounded-xl animate-float hidden md:flex items-center gap-4 z-20 max-w-xs">
              <div className="w-10 h-10 rounded-full bg-card border border-foreground/10 flex items-center justify-center text-foreground shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground mb-0.5">
                  AI Summary Ready
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  Condensed 4 meetings and 12 documents into a daily briefing.
                </div>
              </div>
              <button className="w-6 h-6 rounded-full bg-card hover:bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FileRow({
  icon,
  name,
  detail,
}: {
  icon: React.ReactNode
  name: string
  detail: string
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-card/30 border border-transparent hover:border-foreground/10 hover:bg-background cursor-pointer transition group">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-background border border-foreground/10 flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{name}</div>
          <div className="text-[10px] text-muted-foreground group-hover:text-foreground/60">
            {detail}
          </div>
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  )
}
