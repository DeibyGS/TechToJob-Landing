"use client";

// Swap point: this is the only file that talks to Formspree. Replacing it
// with a different ESP (Mailchimp/Brevo) later touches nothing else.

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Mail } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
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
        className="h-12 min-w-0 flex-1 rounded-lg border border-brand-white/20 bg-brand-dark px-4 py-3 text-brand-white placeholder:text-brand-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
      />
      {/* Same shared CTA as every other button on the landing (see
          specs/unify-button-component/) — teal fill, glow shadow,
          arrow-on-hover growth. Here it shares a row with the input's
          `flex-1`, so its footprint must never change on hover. The invisible
          spacer reserves the button's EXPANDED footprint (label + trailing
          arrow) at the input's exact height (`h-12` on both); the real
          button fills it via `!absolute inset-0` with its content centered.
          At rest the content sits centered with some slack, on hover it grows
          into that slack — the button never overflows its reserved box into
          the row gap. `!absolute` (not plain `absolute`) is required: Button's
          base classes include `relative`, and Tailwind v4 emits `.absolute`
          before `.relative`, so without `!` the later `.relative` wins. */}
      <div className="relative shrink-0">
        <span
          aria-hidden="true"
          className="invisible inline-flex h-12 items-center gap-2 rounded-full px-5 text-xs font-semibold tracking-wide whitespace-nowrap uppercase"
        >
          <Mail className="h-4 w-4" />
          <span className="inline-flex items-center gap-1.5">
            {submitLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </span>
        <Button
          type="submit"
          label={submitLabel}
          icon={<Mail />}
          loading={status === "pending"}
          className="!absolute inset-0 justify-center"
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
