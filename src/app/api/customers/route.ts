import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";

export async function GET() {
  try {
    const allCustomers = await db.select().from(customers);
    return NextResponse.json(allCustomers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const [newCustomer] = await db
      .insert(customers)
      .values({
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        type: body.type || "retail",
        loyaltyPoints: 0,
      })
      .returning();

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
