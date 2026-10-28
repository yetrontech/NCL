"use server";

import { createClient } from "@supabase/supabase-js";
import { parseListedDiagnoses } from "@/lib/listed-diagnoses";
import { notifyNewSubmission } from "@/lib/notify";
import { isQuickEvalFit, quickEvalSteps, type QuickEvalStep } from "@/lib/quick-eval";
import { submitTourRequest } from "@/app/actions/forms";

export type TourEvalContact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
};

export type TourEvalScheduleInfo = TourEvalContact & {
  tourBooked: boolean;
};

function serverSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured.");
  }
  return createClient(url, anonKey);
}

function clip(value: string, max: number) {
  return value.trim().slice(0, max);
}

function readableAnswer(step: QuickEvalStep, value: string) {
  if (!step.multi) return value;
  const labels = parseListedDiagnoses(value);
  return labels.length > 0 ? labels.join("; ") : value;
}

function rpcMissing(message: string) {
  return /public_submit_tour_eval|public_get_tour_eval|public_attach_tour_eval|schema cache|could not find the function/i.test(
    message
  );
}

export async function submitTourEval(
  contact: TourEvalContact,
  answers: Record<string, string>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const firstName = clip(contact.firstName || "", 80);
  const lastName = clip(contact.lastName || "", 80);
  const email = clip(contact.email || "", 120).toLowerCase();
  const phone = clip(contact.phone || "", 40);
  const gender = clip(contact.gender || "", 20);
  if (!firstName || !lastName || !email || !phone) {
    return { ok: false, error: "Please fill in your name, phone, and email." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email." };
  }
  if (gender !== "Male" && gender !== "Female") {
    return { ok: false, error: "Select a gender." };
  }

  const labeled = quickEvalSteps(answers)
    .filter((step) => answers[step.id])
    .map((step) => ({
      id: step.id,
      prompt: step.prompt,
      answer: readableAnswer(step, answers[step.id]),
    }));
  if (labeled.length === 0) {
    return { ok: false, error: "Answer the questions, then send it again." };
  }

  try {
    const { data, error } = await serverSupabase().rpc("public_submit_tour_eval", {
      p_first: firstName,
      p_last: lastName,
      p_email: email,
      p_phone: phone,
      p_gender: gender,
      p_answers: labeled,
      p_fit: isQuickEvalFit(answers),
    });
    if (error) {
      return {
        ok: false,
        error: rpcMissing(error.message)
          ? "This form is not ready yet. Call (404) 731-2371."
          : error.message,
      };
    }
    const row = data as { ok?: boolean; error?: string; id?: string } | null;
    if (!row?.ok || !row.id) {
      return { ok: false, error: row?.error || "Could not send your answers." };
    }

    await notifyNewSubmission({
      kind: "tour_evaluation",
      summary: `${firstName} ${lastName}`,
      userEmail: email,
      userName: firstName,
      rowId: row.id,
      details: {
        Phone: phone,
        Email: email,
        Gender: gender,
        "Automatic check": isQuickEvalFit(answers) ? "Looks like a fit" : "May not be a fit",
        ...Object.fromEntries(labeled.map((item) => [item.prompt, item.answer])),
      },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not send your answers." };
  }
}

export async function loadTourEvalSchedule(
  token: string
): Promise<{ ok: true; info: TourEvalScheduleInfo } | { ok: false; error: string }> {
  try {
    const { data, error } = await serverSupabase().rpc("public_get_tour_eval", { p_token: token });
    if (error) {
      return {
        ok: false,
        error: rpcMissing(error.message) ? "This link is not active." : error.message,
      };
    }
    const row = data as {
      ok?: boolean;
      error?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      gender?: string;
      tourBooked?: boolean;
    } | null;
    if (!row?.ok || !row.firstName || !row.email || (row.gender !== "Male" && row.gender !== "Female")) {
      return { ok: false, error: row?.error || "This link is not active." };
    }
    return {
      ok: true,
      info: {
        firstName: row.firstName,
        lastName: row.lastName || "",
        email: row.email,
        phone: row.phone || "",
        gender: row.gender,
        tourBooked: row.tourBooked === true,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "This link is not active." };
  }
}

export async function bookApprovedTour(
  token: string,
  date: string,
  time: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const loaded = await loadTourEvalSchedule(token);
  if (!loaded.ok) return loaded;
  if (loaded.info.tourBooked) {
    return { ok: false, error: "Your tour is already scheduled." };
  }

  const form = new FormData();
  form.set("tour-first", loaded.info.firstName);
  form.set("tour-last", loaded.info.lastName);
  form.set("tour-phone", loaded.info.phone);
  form.set("tour-email", loaded.info.email);
  form.set("tour-gender", loaded.info.gender);
  form.set("tour-date", date);
  form.set("tour-time", time);
  const booked = await submitTourRequest(form);
  if (!booked.ok) return booked;

  if (booked.id) {
    await serverSupabase().rpc("public_attach_tour_eval", {
      p_token: token,
      p_tour_id: booked.id,
    });
  }
  return { ok: true };
}
