import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions, transactionItems, products, stockHistory } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const allTransactions = await db
      .select()
      .from(transactions)
      .orderBy(sql`${transactions.createdAt} DESC`);

    return NextResponse.json(allTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, paymentMethod, cashReceived, cashChange } = body;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.subtotal,
      0
    );
    const discount = items.reduce(
      (sum: number, item: any) => sum + (item.discount || 0),
      0
    );
    const total = subtotal - discount;

    // Create transaction
    const [transaction] = await db
      .insert(transactions)
      .values({
        invoiceNumber,
        userId: 1, // TODO: Get from auth session
        subtotal,
        discount,
        tax: 0,
        total,
        paymentMethod,
        paymentStatus: "paid",
        cashReceived,
        cashChange,
      })
      .returning();

    // Create transaction items and update stock
    for (const item of items) {
      // Insert transaction item
      await db.insert(transactionItems).values({
        transactionId: transaction.id,
        productId: item.id,
        quantity: item.quantity,
        price: item.sellingPrice,
        discount: item.discount || 0,
        subtotal: item.subtotal,
      });

      // Update product stock
      await db
        .update(products)
        .set({
          stock: sql`${products.stock} - ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.id));

      // Record stock history
      await db.insert(stockHistory).values({
        productId: item.id,
        type: "out",
        quantity: item.quantity,
        note: `Penjualan - ${invoiceNumber}`,
        userId: 1, // TODO: Get from auth session
      });
    }

    return NextResponse.json(
      {
        success: true,
        invoiceNumber: transaction.invoiceNumber,
        transaction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
