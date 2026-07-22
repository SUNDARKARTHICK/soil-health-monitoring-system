import { z } from "zod";

/**
 * A required numeric field for an HTML <input type="number">. react-hook-form
 * hands zod the raw string value from the input, including "" when the user
 * clears the field. z.coerce.number() on "" silently becomes 0 (JS: Number("")
 * === 0), which would let an emptied field pass validation as a valid zero
 * instead of surfacing a "required" error. Preprocessing "" -> undefined
 * first makes z.number()'s own required_error fire correctly instead.
 */
function requiredNumber(label: string, { min, max }: { min: number; max: number }) {
  return z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z
      .number({
        required_error: `${label} is required`,
        invalid_type_error: `${label} must be a number`,
      })
      .min(min, `${label} must be at least ${min}`)
      .max(max, `${label} must be at most ${max}`)
  );
}

function optionalNumber({ min, max }: { min?: number; max?: number } = {}) {
  return z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z
      .number()
      .min(min ?? -Infinity)
      .max(max ?? Infinity)
      .optional()
  );
}

export const soilInputSchema = z.object({
  pH: requiredNumber("pH", { min: 0, max: 14 }),
  nitrogen: requiredNumber("Nitrogen", { min: 0, max: 1000 }),
  phosphorus: requiredNumber("Phosphorus", { min: 0, max: 1000 }),
  potassium: requiredNumber("Potassium", { min: 0, max: 1000 }),
  organicMatter: requiredNumber("Organic matter", { min: 0, max: 100 }),
  temperature: optionalNumber(),
  humidity: optionalNumber({ min: 0, max: 100 }),
  rainfall: optionalNumber({ min: 0 }),
});

export type SoilInputForm = z.infer<typeof soilInputSchema>;
