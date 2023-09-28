import dbConnect from "../../../../../lib/dbConnect";
import GoogleOAuthUser from "../../../../../models/GoogleOAuthUser";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");
  const origin = request.headers.get("origin")

  let user;
  try {
    if (id) {
      user = await GoogleOAuthUser.findById(id);
      if (!user) {
        return NextResponse.json(
          { message: "user not found 💩" },
          { status: 404,
          headers:getResponseHeaders(origin)
          }
        );
      }
      return NextResponse.json({ user }, { status: 200,
        headers:getResponseHeaders(origin)
      });
    } else if (email) {
      user = await GoogleOAuthUser.findOne({ email: email });
      if (!user) {
        return NextResponse.json(
          { message: "user not found 💩" },
          { status: 404, 
          headers:getResponseHeaders(origin) }
        );
      }
      return NextResponse.json({ user }, { status: 200, 
        headers:getResponseHeaders(origin)
      });
    } else {
      user = await GoogleOAuthUser.find();
      return NextResponse.json({ user }, { status: 200, headers: getResponseHeaders(origin) });
    }
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500, 
    headers:getResponseHeaders(origin)
    });
  }
}
export async function POST(request) {
  await dbConnect();
  const origin = request.headers.get("origin")
  try {
    const res = await request.json();
    const { email } = res
    const userExists = await GoogleOAuthUser.findOne({ email });
    if (!userExists) {
      const newUser = new GoogleOAuthUser(res);
      await newUser.save();
    }
    // Return a success response
    return NextResponse.json("User created successfully 👽", { status: 201, headers:getResponseHeaders(origin) });
  } catch (err) {
    return NextResponse.json({error:err.message}, {status:500, headers:getResponseHeaders(origin)})
  }
}
export async function DELETE(request) {
  await dbConnect();
  const origin = request.headers.get("origin")
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user = await GoogleOAuthUser.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json(
        { message: "user not found 💩" },
        { status: 404, 
        headers: getResponseHeaders(origin) }
      );
    } else {
      return NextResponse.json(
        { message: "User deleted successfully 👽" },
        { status: 200,
        headers: getResponseHeaders(origin)
        }
      );
    }
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500, headers: getResponseHeaders(origin) });
  }
}
function getResponseHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}