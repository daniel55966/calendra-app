import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { timeToFloat } from "@/lib/utils";
import { z } from "zod";

export const scheduleFormSchema = z.object({
  timezone: z.string().min(1, "Required"),
  availabilities: z
    .array(
      z.object({
        dayOfWeek: z.enum(DAYS_OF_WEEK_IN_ORDER),
        startTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in the format HH:MM"
          ),
        endTime: z // 'endTime' follows the same validation as 'startTime'
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in the format HH:MM"
          ),
      })
    )
    .superRefine((availabilities, ctx) => {
      availabilities.forEach((availability, index) => {
        const overlaps = availabilities.some((a, i) => {
          return (
            i !== index && // Ensure it's not comparing the same item to itself
            a.dayOfWeek === availability.dayOfWeek && // Check if it's the same day of the week
            timeToFloat(a.startTime) < timeToFloat(availability.endTime) && // Check if the start time of one is before the end time of another
            timeToFloat(a.endTime) > timeToFloat(availability.startTime) // Check if the end time of one is after the start time of another
          );
        });

        if (overlaps) {
          ctx.addIssue({
            code: "custom", // Custom validation error code
            message: "Availability overlaps with another", // Custom error message
            path: [index, "startTime"], // Attaches error to startTime field
          });
        }

        if (
          timeToFloat(availability.startTime) >=
          timeToFloat(availability.endTime)
        ) {
          ctx.addIssue({
            code: "custom", // Custom validation error code
            message: "End time must be after start time", // Custom error message
            path: [index, "endTime"], // Attaches error to endTime field
          });
        }
      });
    }),
});
