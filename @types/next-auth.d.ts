import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      role: string
      points: number
      totalPoints: number
      userClassName: string
      classId: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    username: string
    role: string
    points: number
    totalPoints: number
    userClassName: string
    classId: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string | null
    username: string
    role: string
    points: number
    totalPoints: number
    userClassName: string
    classId: string
  }
}