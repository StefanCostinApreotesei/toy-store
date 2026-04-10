import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = searchParams.getAll("ids");

  if (ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  // Limit to 50 IDs max
  const limitedIds = ids.slice(0, 50);

  const products = await prisma.product.findMany({
    where: { id: { in: limitedIds } },
    include: {
      images: { orderBy: { displayOrder: "asc" }, take: 1 },
    },
  });

  return NextResponse.json({ products });
}
