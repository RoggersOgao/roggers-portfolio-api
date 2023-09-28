import dbConnect from "../../../../../lib/dbConnect";
import GithubOAuthUser from "../../../../../models/GithubOAuthUser";
import { NextResponse } from "next/server";

async function findUserByEmailOrId(email, id) {
  if (id) {
    return await GithubOAuthUser.findById(id);
  } else if (email) {
    return await GithubOAuthUser.findOne({ email });
  } else {
    return await GithubOAuthUser.find();
  }
}
export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");
  const origin = request.headers.get("origin");

  let user;
  try {
    user = findUserByEmailOrId(email, id);
  } catch (err) {
    return NextResponse.json(
      { message: err },
      { status: 500, headers: getResponseHeaders(origin) }
    );
  }
}
export async function POST(request) {
  await dbConnect();
  const origin = request.headers.get("origin");
  try {
    const res = await request.json();
    const { email } = res;
    const userExists = await GithubOAuthUser.findOne({ email });
    if (!userExists) {
      const newUser = new GithubOAuthUser(res);
      await newUser.save();
    }
    // Return a success response
    return NextResponse.json("User created successfully 👽",
     { status: 201, headers: getResponseHeaders(origin) });
  } catch (err) {}
}
export async function DELETE(request) {
  await dbConnect();
  const origin = request.headers.get("origin")

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user = await GithubOAuthUser.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json(
        { message: "product not found 💩" },
        { status: 404, headers:getResponseHeaders(origin) }
      );
    } else {
      return NextResponse.json(
        { message: "User deleted successfully 👽" },
        { status: 200, headers: getResponseHeaders(origin) }
      );
    }
  } catch (err) {
    return NextResponse.json({ message: err }, 
      { status: 500, headers:getResponseHeaders(origin) });
  }
}

function getResponseHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
