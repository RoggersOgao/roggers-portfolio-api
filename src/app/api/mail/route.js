import Joi from "joi"
import dbConnect from "../../../../lib/dbConnect"
import HomeMail from "../../../../models/HomeMail"
import sendEmail from "../../../../sendEmail"
import { NextResponse } from "next/server"
import { headers } from "next/headers";

// defining the validation schema using joi... for the mail model

const mailSchema = Joi.object({
    name: Joi.string().max(60),
    email: Joi.string().trim().lowercase().email().required(),
    message: Joi.string().min(10).max(1000).required(),
})


export async function GET(request){
    await dbConnect()
    const headersList = headers()
    const origin = headersList.get('origin')
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        let mail;
    
        if (id) {
            // Make sure the Project model and findById method are defined and working correctly.
            mail = await HomeMail.findById(id);
    
            if (!mail) {
                return NextResponse.json({ message: "Mail not found 💩" },
                 { status: 404, headers:getResponseHeaders(origin) });
            }
            return NextResponse.json({mail}, {status:200,
            headers:getResponseHeaders(origin)
            })
        } else {
            // Make sure the Project model and find method are defined and working correctly.
            mail = await HomeMail.find();
            return NextResponse.json({ mail }, { status: 200, headers:getResponseHeaders(origin) });
        }
    } catch (err) {
       return NextResponse.json({ message: err.message },
       { status: 500, headers:getResponseHeaders(origin) });
    }
    
}
export async function POST(request) {

    await dbConnect()
    const headersList = headers()
    const origin = headersList.get('origin')

    try {
        const res = await request.json()
        const { error, value } = mailSchema.validate(res)


        if (error) {
            return NextResponse.json(
                { message: "Invalid User input 💩", details: error.details },
                { status: 400,
                headers:getResponseHeaders(origin)
             }
            )
        } else {
            const { name, email, message } = value
            try {
                await HomeMail.create(value)
            } catch (err) {
                return NextResponse.json({message:"Error while storing the data", error: err}, {status:500, headers:getResponseHeaders(origin)})
            }

            // set the recipient email address as an array

            const recipientEmails = ['roggersog@gmail.com']
            try{
                await sendEmail({
                    sender: email,
                    recipient: recipientEmails,
                    subject: "Roggers, There's a note addressed to you.",
                    content: message,
                    name:name
                })
    
                return NextResponse.json("Email Successfully sent!", { status: 200,
                headers:getResponseHeaders(origin)
                })

            }catch(err){
                NextResponse.json({message:"Error while sending the email", error: err}, {status:500, 
                headers:getResponseHeaders(origin)
                })
            }

        }
    } catch (err) {

    }
}


function getResponseHeaders(origin) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
  }