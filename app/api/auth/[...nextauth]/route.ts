
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";


// ⬇️ ต้องเป็นแบบนี้เท่านั้น!
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
