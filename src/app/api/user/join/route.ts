import { prisma } from "@/utils/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed.` });
  }

  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const newUser = await prisma.user.create({
      data: { email, password, nickname },
    });

    return res.status(201).json({ message: "User created.", user: newUser });
  } catch (error) {
    console.error("Join error: ", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}
