"use client";

// Swap point: this is the only file that talks to Formspree. Replacing it
// with a different ESP (Mailchimp/Brevo) later touches nothing else.

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
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
        className="w-full rounded-lg border border-brand-white/20 bg-brand-dark px-4 py-3 text-brand-white placeholder:text-brand-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
      />
      <Button type="submit" disabled={status === "pending"}>
        {status === "pending" ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          submitLabel
        )}
      </Button>
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
