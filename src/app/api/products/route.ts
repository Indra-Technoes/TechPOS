import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allProducts = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true));

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const [newProduct] = await db
      .insert(products)
      .values({
        sku: body.sku,
        name: body.name,
        description: body.description,
        categoryId: body.categoryId,
        supplierId: body.supplierId,
        purchasePrice: body.purchasePrice,
        sellingPrice: body.sellingPrice,
        stock: body.stock || 0,
        minStock: body.minStock || 10,
        unit: body.unit || "pcs",
        barcode: body.barcode,
        image: body.image,
      })
      .returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
