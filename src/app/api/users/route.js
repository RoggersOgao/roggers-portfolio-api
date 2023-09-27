import bcrypt from "bcryptjs";
import Joi from "joi";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import { NextResponse } from "next/server";

const socialSchema = Joi.object({
  linkedIn: Joi.string().optional().allow(""),
  twitter: Joi.string().optional().allow(""),
  instagram: Joi.string().optional().allow(""),
  facebook: Joi.string().optional().allow(""),
  github: Joi.string().optional().allow(""),
});

const personalSchema = Joi.object({
  location: Joi.string().max(60).optional().allow(""),
  company: Joi.string().max(60).optional().allow(""),
  bio: Joi.string().max(600).optional().allow(""),
});

const usersSchema = Joi.object({
  name: Joi.string().max(60).required(),
  email: Joi.string().trim().lowercase().email().required(),
  image: Joi.string().uri({ scheme: ["https"] }).optional(),
  socials: Joi.array().items(socialSchema).optional().default([]),
  personalInfo: Joi.array().items(personalSchema).optional().default([]),
  role: Joi.string().optional(),
});


export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");
  let users;
  if (id) {
    users = await User.findById(id);
    if (!users) {
      return NextResponse.json(
        { message: "User not found 💩" },
        { status: 404 }
      );
    }
    return NextResponse.json({ users }, { status: 200 });
  } else if(email){
    users = await User.findOne({email: email});
    if(!users){
      return NextResponse.json(
        { message: "User not found 💩" },
        { status: 404 }
      );
    }
    return NextResponse.json({ users }, { status: 200 });
  } else {
    users = await User.find();
    return NextResponse.json({ users }, { status: 200 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const res = await request.json();
    const { error, value } = usersSchema.validate(res);

    if (error) {
      return NextResponse.json(
        { message: "Invalid User input 💩", details: error.details },
        { status: 400 }
      );
    }

    const {email} = value

    // Check if the user exists in the User model
    const userExists = await User.findOne({ email });

    if (userExists) {
      // Update the user in the User model

      await User.findOneAndUpdate(
        { email },
        value,
        { new: true, runValidators: true }
      );
    }

    // If the user doesn't exist in either model, create a new user

    if (!userExists) {
      const newUser = new User(value);
      await newUser.save();
    }
    // Return a success response
    return NextResponse.json("User created successfully 👽", { status: 201 });

  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
export async function PUT(request) {
  await dbConnect();
  try {
    const res = await request.json();
    const { error, value } = usersSchema.validate(res);
    if (error) {
      return NextResponse.json(
        { message: "Invalid User input 💩", details: error.details },
        { status: 400 }
      );
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");


    try {
      let user;
      if (id) {
        user = await User.findByIdAndUpdate(id, value, {
          new: true,
          runValidators: true,
        });
        
      } else if (email) {
        user = await User.findOneAndUpdate({ email: email }, value, {
          new: true,
          runValidators: true,
        });
      }
      
      if (!user) {
        return NextResponse.json({ message: "User not found 💩" });
      }
      return NextResponse.json(
        { message: "User updated successfully! 👻", user },
        { status: 200 }
      );
    } catch (err) {
      return NextResponse.json({ message: err });
    }
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found 💩" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully 👽" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
