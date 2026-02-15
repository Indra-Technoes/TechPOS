import { NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET all agents
export async function GET() {
  try {
    const allAgents = await db.select().from(agents).orderBy(desc(agents.id));
    return NextResponse.json(allAgents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

// POST new agent
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { name, email, phone, address, city, type, level, commissionRate, status, joinDate } = body;
    
    // Generate agent code
    const prefix = type === "reseller" ? "RSL" : "AGT";
    const count = await db.select().from(agents);
    const code = `${prefix}-${String(count.length + 1).padStart(3, "0")}`;
    
    const newAgent = await db.insert(agents).values({
      code,
      name,
      email: email || null,
      phone,
      address: address || null,
      city: city || null,
      type: type || "agent",
      level: level || null,
      commissionRate: commissionRate || 5,
      status: status || "active",
      joinDate: joinDate ? new Date(joinDate) : new Date(),
      totalOrders: 0,
      totalRevenue: 0,
    }).returning();
    
    return NextResponse.json(newAgent[0], { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
