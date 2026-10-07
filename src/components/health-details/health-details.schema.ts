import { z } from "zod";

export const WEIGHT_RANGE = { min: 30, max: 200, step: 0.1 };
export const HEIGHT_RANGE = { min: 100, max: 220, step: 1 };

export const healthDetailsModeSchema = z
  .enum(["start", "goal", "weight", "height"])
  .catch("start");

export type HealthDetailsMode = z.infer<typeof healthDetailsModeSchema>;

const weightSchema = z
  .number({ error: "Select a weight" })
  .min(WEIGHT_RANGE.min, `Weight must be at least ${WEIGHT_RANGE.min} kg`)
  .max(WEIGHT_RANGE.max, `Weight must be at most ${WEIGHT_RANGE.max} kg`);

export const healthDetailsSchema = z.object({
  currentWeight: weightSchema,
  targetWeight: weightSchema,
  height: z
    .number({ error: "Select a height" })
    .min(HEIGHT_RANGE.min, `Height must be at least ${HEIGHT_RANGE.min} cm`)
    .max(HEIGHT_RANGE.max, `Height must be at most ${HEIGHT_RANGE.max} cm`),
});

export type HealthDetailsValues = z.infer<typeof healthDetailsSchema>;
export type HealthDetailsField = keyof HealthDetailsValues;

// Which fields each entry point asks for.
export const MODE_FIELDS: Record<HealthDetailsMode, HealthDetailsField[]> = {
  start: ["currentWeight", "targetWeight", "height"],
  weight: ["currentWeight"],
  goal: ["targetWeight"],
  height: ["height"],
};

export const getHealthDetailsSchema = (mode: HealthDetailsMode) =>
  healthDetailsSchema.pick(
    Object.fromEntries(MODE_FIELDS[mode].map((field) => [field, true])) as {
      [K in HealthDetailsField]?: true;
    },
  );
