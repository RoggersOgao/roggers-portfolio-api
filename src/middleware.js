import { NextResponse } from 'next/server'
import { headers } from "next/headers"
 
const allowedOrigins =  [ `${process.env.CLIENT_SITE}`, 'https://roggers-portfolio-api.vercel.app', 'http://localhost:3000'] 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    
    console.log("Middleware")
    console.log(process.env.NODE_ENV)
    const headersList = headers()
    const origin = headersList.get('origin')
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
//   console.log(request.method)
//   console.log(request.url)

  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}