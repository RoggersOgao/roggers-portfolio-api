import Joi from "joi";
import dbConnect from "../../../../lib/dbConnect";
import Design from "../../../../models/Design";
import { NextResponse } from "next/server";

const corHeaders = {
  'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const designSchema = Joi.object({
  design: Joi.object(),
  description: Joi.string().required().max(60),
});

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  let designs;

  if (id) {
    designs = await Design.findById(id);
    if (!designs) {
      return NextResponse.json(
        { message: "Design not found 💩" },
        { status: 404 }
      );
    }
    return NextResponse.json({ designs }, { status: 200 });
  } else {
    designs = await Design.find();
    return NextResponse.json({ designs }, { status: 200 });
  }
}

// post function

export async function POST(request) {
  await dbConnect();
  try {
    const res = await request.json();
    const { error, value } = designSchema.validate(res);

    if (error) {

      return new Response({ message: "Invalid User input 💩", details: error.details }, {
        status: 400,
        headers: corHeaders
      });
    }else{
        try{
            const design = await Design.create(value);
            return new Response({message:"Design Uploaded successfully 👽", data:design}, {
              status: 200,
              headers: corHeaders
            });
        }catch(err){
            console.log(err)
        }
    
    }

  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

// update function

export async function PUT(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const res = await request.json();
  const { error, value } = designSchema.validate(res);
  if (error) {
    return new Response({ message: "Invalid User input 💩", details: error.details }, {
      status: 400,
      headers: corHeaders
    });
  }
  try {
    const design = await Design.findByIdAndUpdate(id, value, {
      new: true,
      runValidator: true,
    });
    if (!design) {
      return new Response({ message: "desing not found 💩", details: error.details }, {
        status: 400,
        headers: corHeaders
      });
    }
    return new Response({message:"Design Updated successfully 👽", data:design}, {
      status: 200,
      headers: corHeaders
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// delete function

export async function DELETE(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const design = await Design.findByIdAndDelete(id);
    if (!design) {
      return new Response({ message: "Design not found 💩" }, {
        status: 404,
        headers: corHeaders
      });
    }

    return new Response(
      { message: "Design deleted successfully 👽" },
      {
        status:200,
        headers: corHeaders
      }
    )
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
