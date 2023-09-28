import Joi from "joi";
import dbConnect from "../../../../lib/dbConnect";
import Design from "../../../../models/Design";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

const designSchema = Joi.object({
  design: Joi.object(),
  description: Joi.string().required().max(60),
});

export async function GET(request) {
  await dbConnect();
const headersList = headers()
 const origin = headersList.get('origin')
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  let designs;

  if (id) {
    designs = await Design.findById(id);
    if (!designs) {
      return NextResponse.json(
        { message: "Design not found 💩" },
        { status: 404 , headers:getResponseHeaders(origin)}
      );
    }
    return NextResponse.json({ designs }, { status: 200, headers:getResponseHeaders(origin) });
  } else {
    designs = await Design.find();
    return NextResponse.json({ designs }, { status: 200, 
    headers: getResponseHeaders(origin) });
  }
}

// post function

export async function POST(request) {
  await dbConnect();
  const headersList = headers()
 const origin = headersList.get('origin')
  try {
    const res = await request.json();
    const { error, value } = designSchema.validate(res);

    if (error) {

      return NextResponse.json({ message: "Invalid User input 💩", details: error.details }, {
        status: 400,
        headers: getResponseHeaders(origin)
      });
    }else{
        try{
            const design = await Design.create(value);
            return NextResponse.json({message:"Design Uploaded successfully 👽", data:design}, {
              status: 200,
              headers: getResponseHeaders(origin)
            });
        }catch(err){
            return NextResponse.json({message:error.message},{status: 500, headers: getResponseHeaders(origin)})
        }
    
    }

  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500, headers: getResponseHeaders(origin) });
  }
}

// update function

export async function PUT(request) {
  await dbConnect();
  const headersList = headers()
 const origin = headersList.get('origin')
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const res = await request.json();
  const { error, value } = designSchema.validate(res);
  if (error) {
    return NextResponse.json({ message: "Invalid User input 💩", details: error.details }, {
      status: 400,
      headers: getResponseHeaders(origin)
    });
  }
  try {
    const design = await Design.findByIdAndUpdate(id, value, {
      new: true,
      runValidator: true,
    });
    if (!design) {
      return NextResponse.json({ message: "design not found 💩", details: error.details }, {
        status: 400,
        headers: getResponseHeaders(origin)
      });
    }
    return NextResponse.json({message:"Design Updated successfully 👽", data:design}, {
      status: 200,
      headers: getResponseHeaders(origin)
    });
  } catch (err) {
    return NextResponse.json({ message: err.message },
       { status: 500,
        headers:getResponseHeaders(origin)
       });
  }
}

// delete function

export async function DELETE(request) {
  await dbConnect();
  const headersList = headers()
 const origin = headersList.get('origin')

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const design = await Design.findByIdAndDelete(id);
    if (!design) {
      return NextResponse.json({ message: "Design not found 💩" }, {
        status: 404,
        headers: getResponseHeaders(origin)
      });
    }

    return NextResponse(
      { message: "Design deleted successfully 👽" },
      {
        status:200,
        headers: getResponseHeaders(origin)
      }
    )
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500,
    headers: getResponseHeaders(origin)
    });
  }
}


function getResponseHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}