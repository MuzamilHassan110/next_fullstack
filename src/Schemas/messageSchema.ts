import { z } from "zod"

 export const messageSchema = z.object({
     content: z.string()
     .min(10, {message: "Content must be have the at leat 10 character"})
     .max(300, {message: "Content must be no longer then 300 characer"})
 })