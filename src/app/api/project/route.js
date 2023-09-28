import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Project from "../../../../models/Project"

export async function GET(request){
    await dbConnect()
    const origin = request.headers.get("origin")
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        let projects;
    
        if (id) {
            // Make sure the Project model and findById method are defined and working correctly.
            projects = await Project.findById(id);
    
            if (!projects) {
                return NextResponse.json({ message: "Project not found 💩" },
                 { status: 404, headers:getResponseHeaders(origin) });
            }
            return NextResponse.json({projects}, {status:200,
            headers:getResponseHeaders(origin)
            })
        } else {
            // Make sure the Project model and find method are defined and working correctly.
            projects = await Project.find();
            return NextResponse.json({ projects }, { status: 200, headers:getResponseHeaders(origin) });
        }
    } catch (err) {
       return NextResponse.json({ message: err.message },
       { status: 500, headers:getResponseHeaders(origin) });
    }
    
}
export async function POST(request){
    await dbConnect()
    const origin = request.headers.get("origin")
    try{
        const res = await request.json()
        const {projectName, projectLink} = res

        const existsName = await Project.findOne({projectName:projectName})
        const existsLink = await Project.findOne({projectLink:projectLink})

        if(existsName || existsLink){
            return NextResponse.json({message:"Project already exists!"},
             {status:409, headers:getResponseHeaders(origin)})
        }
        try{
          const project = await Project.create(res)
          return NextResponse.json({message:"Project Uploaded successfully 👽", data:project},
           { status: 200, headers:getResponseHeaders(origin) });
        }catch(err){
          return NextResponse.json({error:err.message}, {status:500, headers:getResponseHeaders(origin)})
        }
    }catch(err){
        NextResponse.json({message:err.message}, 
          {status:500, headers:getResponseHeaders(origin)})
    }
    
}

export async function PUT(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const origin = request.headers.get("origin")
  
    const res = await request.json();
    try {
      const project = await Project.findByIdAndUpdate(id, res, {
        new: true,
        runValidator: true,
      });
      if (!project) {
        return NextResponse.json(
          { message: "project not found 💩" },
          { status: 400,
          headers:getResponseHeaders(origin) }
        );
      }
      return NextResponse.json(
        { message: "Project Updated Successfully!", project },
        { status: 200, 
          headers:getResponseHeaders(origin) },
        
      );
    } catch (err) {
      return NextResponse.json({ message: err.message }, 
        { status: 500,
           headers:getResponseHeaders(origin) });
    }
  }
  
  export async function DELETE(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const origin = request.headers.get("origin")
  
    try {
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        return NextResponse.json(
          { message: "project not found 💩" },
          { status: 404,
          headers:getResponseHeaders(origin)
          }
        );
      }
      return NextResponse.json(
        { message: "Project deleted successfully 👽" },
        { status: 200,
        headers:getResponseHeaders(origin) }
      );
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 500, headers:getResponseHeaders(origin) });
    }
  }
  
  function getResponseHeaders(origin) {
    return {
      "Access-Control-Allow-Origin": origin || "*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
  }