import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { apiResponse } from "@/types/apiResponse";

export default async function sendVerificationEmail(
    username: string,
    email: string,
    verifyCode: string,
): Promise<apiResponse> {

    email = email.replace(/[`'"]/g, '').trim();
    console.log("resend",resend)
    try {  
        console.log("send Verifications",email, username)      
        const { data, error } =  await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [ email ],
            subject: 'Mystr message | Verification code ',
            react: VerificationEmail({username, otp: verifyCode}),
          });
          if(error){
            console.error("error in here", error)
          }
          else{
            console.log("data", data)
          }
        return { success: true, message: "Verification code send Successfully" }

    } catch (error) {
        console.error("Error is sending in Email Verification ", error);
        return { success: false, message: "Verification faild" }
    }

}