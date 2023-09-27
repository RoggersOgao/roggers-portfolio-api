import dbConnect from "../../../../../lib/dbConnect";
import GoogleOAuthUser from "../../../../../models/GoogleOAuthUser";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  let user;
  try {
    if (id) {
      user = await GoogleOAuthUser.findById(id);
      if (!user) {
        return NextResponse.json(
          { message: "user not found 💩" },
          { status: 404 }
        );
      }
      return NextResponse.json({ user }, { status: 200 });
    } else if (email) {
      user = await GoogleOAuthUser.findOne({ email: email });
      if (!user) {
        return NextResponse.json(
          { message: "user not found 💩" },
          { status: 404 }
        );
      }
      return NextResponse.json({ user }, { status: 200 });
    } else {
      user = await GoogleOAuthUser.find();
      return NextResponse.json({ user }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
export async function POST(request) {
  await dbConnect();
  try {
    const res = await request.json();

    const { email } = res
    const userExists = await GoogleOAuthUser.findOne({ email });
    if (!userExists) {
      const newUser = new GoogleOAuthUser(res);
      await newUser.save();
    }
    // Return a success response
    return NextResponse.json("User created successfully 👽", { status: 201 });
  } catch (err) {
    console.log(err.message);
  }
}
export async function DELETE(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user = await GoogleOAuthUser.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json(
        { message: "user not found 💩" },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        { message: "User deleted successfully 👽" },
        { status: 200 }
      );
    }
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
