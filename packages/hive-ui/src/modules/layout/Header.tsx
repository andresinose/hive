import { ConnectionStatus } from "./ConnectionStatus";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="sticky top-0 w-full flex h-12 shrink-0 items-center justify-between border-b border-border bg-background z-50 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-8 w-8" />
        <div className="flex items-center gap-2.5">
          <img
            src="/logo-uti.png"
            alt="UTI Agentes"
            className="h-8 w-auto object-contain"
            onError={(e) => { (e.target as HTMLElement).setAttribute("src", "/logocolor-dark.png"); }}
          />
          <h1 className="text-sm font-bold tracking-tight text-foreground">Orquestador de Agentes <span className="text-xs font-normal text-muted-foreground">| Universidad Indoamérica</span></h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ConnectionStatus />
      </div>
    </header>
  );
}
