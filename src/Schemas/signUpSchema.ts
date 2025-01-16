import { z } from "zod"

export const usernameValidation =  z
.string()
.min(3, "username must be have 3 characters")
.max(15, "username must be have 15 characters")
.regex(/^[a-zA-Z_]+$/, 'username must have not contain the special chararter');


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email format"}),
    password: z.string().min(6, {message: "password must have the 6 charactor"}),
})