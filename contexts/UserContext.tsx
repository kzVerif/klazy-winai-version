"use client"
import { getUserById } from "@/lib/database/users";
import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: string | undefined; // เปลี่ยนตรงนี้
  username: string | undefined;
  role: string | undefined;
  points: number;
  totalPoints: number;
};

// 2. เปลี่ยน UserContextType ให้สอดคล้อง
type UserContextType = {
  user: User | null;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    if (!session?.user?.id) return;
    const res = await getUserById(session?.user?.id)
    setUser(res);
  };

  useEffect(() => {
    if (session?.user?.id) refreshUser();
  }, [session]);

  return (
    <UserContext.Provider value={{ user, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
