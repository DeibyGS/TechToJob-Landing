"use client";

// Swap point: this is the only file that talks to Formspree. Replacing it
// with a different ESP (Mailchimp/Brevo) later touches nothing else.

import { useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;

type Status = "idle" | "pending" | "success" | "error";

type NewsletterFormProps = {
  placeholder: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  configNotice: string;
};

export function NewsletterForm({
  placeholder,
  submitLabel,
  successMessage,
  errorMessage,
  configNotice,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  if (!FORMSPREE_ID) {
    return <p className="text-sm text-brand-white/60">{configNotice}</p>;
  }

  if (status === "success") {
    return (
      <p className="flex items-center gap-2 text-brand-white">
        <CheckCircle2 className="h-5 w-5 text-brand-teal" aria-hidden="true" />
        {successMessage}
      </p>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("pending");

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(event.currentTarget),
      });

      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label htmlFor="newsletter-email" className="sr-only">
        {placeholder}
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-lg border border-brand-white/20 bg-brand-dark px-4 py-3 text-brand-white placeholder:text-brand-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
      />
      {/* Same shared CTA as every other button on the landing (see
          specs/unify-button-component/) — teal fill, glow shadow,
          arrow-on-hover growth. That growth is normally harmless (Hero/
          Closing/HowItWorks have no flex sibling competing for space), but
          here the button shares this row with the input's `flex-1` — the
          button growing on hover would shrink the input instead of reading
          as its own expansion. The invisible spacer reserves only the
          button's RESTING (collapsed, no arrow) footprint in the layout —
          that's the input's steady-state neighbor. The real button sits
          `absolute` on top of it, anchored left: at rest it matches the
          spacer exactly, and on hover it's free to grow rightward past the
          spacer's edge — an absolutely positioned element's overflow
          doesn't feed back into its parent's box size, so the input never
          resizes, at rest or on hover. */}
      <div className="relative shrink-0">
        <span
          aria-hidden="true"
          className="invisible inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide whitespace-nowrap uppercase"
        >
          <Mail className="h-4 w-4" />
          {submitLabel}
        </span>
        <Button
          type="submit"
          label={submitLabel}
          icon={<Mail />}
          loading={status === "pending"}
          className="absolute inset-y-0 left-0"
        />
      </div>
      {status === "error" && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-sm text-brand-white sm:basis-full"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
          {errorMessage}
        </p>
      )}
    </form>
  );
}
