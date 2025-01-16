import { z } from "zod"

export const verifySchema = z    
      .number()
      .refine((code) => code.toString().length === 6, {
        message: "Verification code must have 6 digits",
      })
