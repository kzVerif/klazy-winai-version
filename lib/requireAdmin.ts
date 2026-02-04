import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false
  }

  if (session.user.role !== "admin") {
    return false
  }

  return true;
}
