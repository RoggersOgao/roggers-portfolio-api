import bcrypt from "bcryptjs";
import Joi from "joi";
import dbConnect from "../../../../../lib/dbConnect";
import CredentialsOAuthUser from "../../../../../models/CredentialsOAuthUser";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

const socialSchema = Joi.string().optional();
const personalSchema = Joi.string().max(600).optional();

const usersSchema = Joi.object({
  name: Joi.string().max(60).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(100).optional(),
  image: Joi.string()
    .uri({ scheme: ["https"] })
    .optional(),
  socials: Joi.array().items(socialSchema).optional(),
  personalInfo: Joi.array().items(personalSchema).optional(),
  role: Joi.string().default("user").optional(),
});

async function findUserByEmailOrId(email, id) {
  if (id) {
    return await CredentialsOAuthUser.findById(id);
  } else if (email) {
    return await CredentialsOAuthUser.findOne({ email });
  } else {
    return await CredentialsOAuthUser.find();
  }
}

export async function GET(request) {
  const headersList = headers();
  const origin = headersList.get("origin");

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  const users = await findUserByEmailOrId(email, id);

  if (!users) {
    return new NextResponse.json(
      { message: "User not found 💩" },
      { status: 404, headers: getResponseHeaders(origin) }
    );
  }

  return NextResponse.json(
    { users },
    { status: 200, headers: getResponseHeaders(origin) }
  );
}

export async function POST(request) {
  await dbConnect();
  const headersList = headers();
  const origin = headersList.get("origin");

  try {
    const res = await request.json();
    const { error, value } = usersSchema.validate(res);

    if (error) {
      return NextResponse.json(
        { message: "Invalid User input", details: error.details },
        { status: 400, headers: getResponseHeaders(origin) }
      );
    }

    const { name, email, password, image, socials, personalInfo, role } = value;

    // Check if the user exists in the User model
    const userExists = await User.findOne({ email });

    if (!userExists) {
      // User doesn't exist, create a new user in both models
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        image,
        socials,
        personalInfo,
        role,
      });
      await newUser.save();

      const newCredentialsUser = new CredentialsOAuthUser({
        name,
        email,
        password: hashedPassword,
        image,
        socials,
        personalInfo,
        role,
      });
      await newCredentialsUser.save();

      return NextResponse.json(
        { message: "User created successfully" },
        { status: 201, headers: getResponseHeaders(origin) }
      );
    }

    // User exists, update the User model
    userExists.name = name;
    userExists.image = image;
    userExists.socials = socials;
    userExists.personalInfo = personalInfo;
    userExists.role = role;
    await userExists.save();

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200, headers: getResponseHeaders(origin) }
    );
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: getResponseHeaders(origin) }
    );
  }
}

export async function DELETE(request) {
  await dbConnect();
  const headersList = headers();
  const origin = headersList.get("origin");

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user = await CredentialsOAuthUser.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found 💩" },
        { status: 404, headers: getResponseHeaders(origin) }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully 👽" },
      { status: 200, headers: getResponseHeaders(origin) }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: getResponseHeaders(origin) }
    );
  }
}

function getResponseHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
