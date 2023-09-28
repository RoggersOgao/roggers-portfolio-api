import { NextResponse } from 'next/server'
 
const allowedOrigins = process.env.NODE_ENV === "production" 
? [ 'https://roggers-portfolio-admin.vercel.app'] :
['http://localhost:3000']
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    
    console.log("Middleware")
  const origin = request.headers.get("origin")
    console.log(origin)
    // if ( origin && !allowedOrigins.includes(origin) || !origin)
    
    if ( origin && !allowedOrigins.includes(origin)){
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad Request",
            headers:{
                'Content-Type':"application/json"
            }
        })
    }
  if(request.url.includes("/api")){

  }
//   console.log(request.method)
//   console.log(request.url)

  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}