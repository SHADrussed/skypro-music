import { NextResponse } from "next/server";
import { data } from "@/data/data";

// Deterministic browser-test fixture, never used unless SKYPRO_API_BASE points here.
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join("/");
  if (path === "catalog/track/all") return NextResponse.json({ success: true, data: data.map(track => ({ ...track, staredUser: [] })) });
  if (path === "catalog/selection/all") return NextResponse.json({ success: true, data: [{ _id: 2, name: "Плейлист дня", items: data.slice(0, 5).map(track => track._id) }] });
  if (path === "catalog/selection/2") return NextResponse.json({ success: true, data: { _id: 2, name: "Плейлист дня", items: data.slice(0, 5).map(track => track._id) } });
  return NextResponse.json({ message: "Not found" }, { status: 404 });
}
