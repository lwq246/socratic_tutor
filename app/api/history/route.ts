import { connectToDatabase } from "@/libs/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const subjectId = searchParams.get("subjectId");

  if (!sessionId || !subjectId) {
    return NextResponse.json([]);
  }

  const { db } = await connectToDatabase();
  
  const history = await db.collection("chat_history")
    .find({ sessionId, subjectId })
    .sort({ createdAt: 1 }) // Oldest first
    .toArray();

  // Convert MongoDB _id to string for the frontend
  const formattedHistory = history.map(msg => ({
    id: msg._id.toString(),
    role: msg.role,
    content: msg.content,
  }));

  return NextResponse.json(formattedHistory);
}