import bcrypt from "bcryptjs";
import Joi from "joi";
import dbConnect from "../../../../../lib/dbConnect";
import CredentialsOAuthUser from "../../../../../models/CredentialsOAuthUser";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";


const socialSchema = Joi.object({
  linkedIn: Joi.string().optional(),
  twitter: Joi.string().optional(),
  instagram: Joi.string().optional(),
  facebook: Joi.string().optional(),
  github: Joi.string().optional(),
});

const personalSchema = Joi.object({
  location: Joi.string().max(60).optional(),
  company: Joi.string().max(60).optional(),
  bio: Joi.string().max(600).optional(),
});

const usersSchema = Joi.object({
  name: Joi.string().max(60).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(100).optional(), // Optional for updates
  image: Joi.string().uri({ scheme: ["https"] }).optional(),
  socials: Joi.array().items(socialSchema).optional(),
  personalInfo: Joi.array().items(personalSchema).optional(),
  role: Joi.string().default("user").optional(),
});

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");
  let users;
  if (id) {
    users = await CredentialsOAuthUser.findById(id);
    if (!users) {
      return NextResponse.json(
        { message: "User not found 💩" },
        { status: 404 }
      );
    }
    return NextResponse.json({ users }, { status: 200 });
  }else if(email){
    users = await CredentialsOAuthUser.findOne({email: email})
    if(!users){
      return NextResponse.json(
        { message: "User not found 💩" },
        { status: 404 }
      );
    }
    return NextResponse.json({ users }, { status: 200 });
  } else {
    users = await CredentialsOAuthUser.find();
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

    const { name, email, password, image, socials, personalInfo, role } = value;

    // Check if the user exists in the User model
    const userExists = await User.findOne({ email });

    if (userExists) {

      await User.findOneAndUpdate(
        { email },
        {
          name,
          email,
          image,
          socials,
          personalInfo,
          role,
        },
        { new: true, runValidators: true }
      );
    }

    // Check if the user exists in the CredentialsOAuthUser model
    const credUserExists = await CredentialsOAuthUser.findOne({ email });

    if (credUserExists) {
      // Send a message indicating that the user already exists
      return NextResponse.json(
        { message: "The user already exists in CredentialsOAuthUser ☹️" },
        { status: 409 }
      );
    }

    // If the user doesn't exist in either model, create a new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    if (!userExists) {
      const newUser = new User({
        name,
        email,
        image,
        socials,
        personalInfo,
        role,
      });
      await newUser.save();
    }

    if (!credUserExists) {
      const newUser = new CredentialsOAuthUser({
        name,
        email,
        password: hashedPassword,
        image,
        socials,
        personalInfo,
        role,
      });
      await newUser.save();
    }

    // Return a success response
    return NextResponse.json("User created successfully 👽", { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
// export async function PUT(request) {
//   await dbConnect();
//   try {
//     const res = await request.json();
//     const { error, value } = usersSchema.validate(res);
//     if (error) {
//       return NextResponse.json(
//         { message: "Invalid User input 💩", details: error.details },
//         { status: 400 }
//       );
//     }
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     const { name, email, password, image, socials, personalInfo, role } = value;

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = await CredentialsOAuthUser.findByIdAndUpdate(
//       id,
//       { name, email, password: hashedPassword, image, socials, personalInfo, role },
//       { new: true, runValidator: true }
//     );
//     if (!user) {
//       return NextResponse.json({ message: "User not found 💩" });
//     }
//     return NextResponse.json({ message: "User updated successfully! 👻", user }, { status: 200 });
//   } catch (err) {
//     return NextResponse.json({ error: err }, { status: 500 });
//   }
// }

export async function DELETE(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user = await CredentialsOAuthUser.findByIdAndDelete(id);
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

