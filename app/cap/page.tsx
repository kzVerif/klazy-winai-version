"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    // สร้าง global function ให้ Turnstile เรียก
    (window as any).turnstileCallback = (token: string) => {
      setToken(token);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return alert("กรุณาผ่าน captcha");

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: { "Content-Type": "application/json" },
    });

    console.log(await res.json());
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />

      <div
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-callback="turnstileCallback" // <-- ใช้ชื่อ global function เป็น string
      ></div>

      <button type="submit">Register</button>

      <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    </form>
  );
}


// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { token } = req.body;

//   const secret = process.env.TURNSTILE_SECRET_KEY;

//   const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: `secret=${secret}&response=${token}`,
//   });

//   const data = await response.json();

//   if (!data.success) return res.status(400).json({ message: "Captcha ไม่ถูกต้อง" });

//   res.status(200).json({ message: "Captcha ผ่านแล้ว" });
// }
