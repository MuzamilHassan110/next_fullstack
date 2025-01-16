import { Message } from "@/models/User.models"

export interface apiResponse {
    success: boolean,
    message: string,
    isAcceptinMessage?: boolean,
    messages?: Array<Message>
}