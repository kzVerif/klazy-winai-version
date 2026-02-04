import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireStocker() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false;
  }

  // แก้ || เป็น &&
  if (
    session.user.role !== "stocker" &&
    session.user.role !== "seller" &&
    session.user.role !== "admin"
  ) {
    return false;
  }

  return true;
}
