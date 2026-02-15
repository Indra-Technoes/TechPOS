import { NextResponse } from "next/server";
import { db } from "@/db";
import { suppliers } from "@/db/schema";

export async function GET() {
  try {
    const allSuppliers = await db.select().from(suppliers);
    return NextResponse.json(allSuppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const [newSupplier] = await db
      .insert(suppliers)
      .values({
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        category: body.category,
        paymentTerms: body.paymentTerms,
      })
      .returning();

    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    );
  }
}
