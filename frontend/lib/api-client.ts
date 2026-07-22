import type { PredictionResult, SoilInput } from "@/types/soil";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// Render's free tier spins down after inactivity; the first request after
// idle can take 30-50s to wake the instance. Give it real room before
// treating the request as failed, rather than the browser's default timeout.
const REQUEST_TIMEOUT_MS = 60_000;

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

function extractValidationMessage(body: unknown): string | null {
  // FastAPI/Pydantic 422 errors look like: { detail: [{ loc, msg, ... }] }
  if (
    body &&
    typeof body === "object" &&
    "detail" in body &&
    Array.isArray((body as { detail: unknown }).detail)
  ) {
    const detail = (body as { detail: Array<{ loc?: string[]; msg?: string }> }).detail;
    const first = detail[0];
    if (first?.msg) {
      const field = first.loc?.[first.loc.length - 1];
      return field ? `${field}: ${first.msg}` : first.msg;
    }
  }
  return null;
}

export async function fetchPrediction(input: SoilInput): Promise<PredictionResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(
        "The prediction service is taking longer than expected to respond. If it's been idle, it may still be waking up. Please try again in a moment."
      );
    }
    throw new ApiError(
      "Couldn't reach the prediction service. Check that the backend is running and NEXT_PUBLIC_API_URL is set correctly."
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      // Response wasn't JSON; fall through to the generic message below.
    }
    const validationMessage = extractValidationMessage(body);
    throw new ApiError(
      validationMessage ?? `Prediction request failed (${response.status}). Please check your inputs and try again.`,
      response.status
    );
  }

  return response.json();
}
