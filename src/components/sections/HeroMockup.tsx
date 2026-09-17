import { Hash, Circle } from "lucide-react";
import { Card } from "@/components/ui/Card";

type HeroMockupMessage = {
  sender: string;
  text: string;
};

type HeroMockupProps = {
  channelLabel: string;
  onlineLabel: string;
  messages: HeroMockupMessage[];
};

function initials(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

/**
 * Static, illustrative "community chat" composition for the Hero — no real
 * Discord data or UI chrome, built entirely from brand tokens. `data-mockup-*`
 * attributes are GSAP animation targets, scoped and applied by the client
 * wrapper in HeroSection (see animations/hero.ts).
 */
export function HeroMockup({ channelLabel, onlineLabel, messages }: HeroMockupProps) {
  return (
    <Card data-mockup-root className="w-full max-w-sm bg-brand-white shadow-sm">
      <div className="flex items-center justify-between border-b border-brand-dark/10 pb-3">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-dark">
          <Hash className="h-4 w-4 text-brand-teal" />
          {channelLabel}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-brand-dark/60">
          <Circle className="h-2 w-2 fill-brand-teal text-brand-teal" />
          {onlineLabel}
        </span>
      </div>
      <ul className="mt-4 space-y-4">
        {messages.map((message, index) => (
          <li key={index} data-mockup-message className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-teal/20 text-sm font-semibold text-brand-teal">
              {initials(message.sender)}
            </span>
            <div>
              <p className="text-sm font-medium text-brand-dark">{message.sender}</p>
              <p className="text-sm text-brand-dark/70">{message.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
