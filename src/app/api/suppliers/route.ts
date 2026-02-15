import { NextResponse } from "next/server";
import { db } from "@/db";
import { suppliers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Get specific supplier by ID
      const supplier = await db
        .select()
        .from(suppliers)
        .where(eq(suppliers.id, parseInt(id)));
      return NextResponse.json(supplier);
    }

    // Get all suppliers
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Supplier ID is required" },
        { status: 400 }
      );
    }

    const [updatedSupplier] = await db
      .update(suppliers)
      .set({
        name: updateData.name,
        email: updateData.email,
        phone: updateData.phone,
        address: updateData.address,
        category: updateData.category,
        paymentTerms: updateData.paymentTerms,
      })
      .where(eq(suppliers.id, id))
      .returning();

    return NextResponse.json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    return NextResponse.json(
      { error: "Failed to update supplier" },
      { status: 500 }
    );
  }
}
