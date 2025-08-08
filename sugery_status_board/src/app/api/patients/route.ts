
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "src/db/db.json");

export async function GET() {
  const dbData = fs.readFileSync(dbPath, "utf-8");
  const data = JSON.parse(dbData);
  return NextResponse.json(data.patients);
}

export async function POST(request: Request) {
  const body = await request.json();
  const dbData = fs.readFileSync(dbPath, "utf-8");
  const data = JSON.parse(dbData);
  data.patients.push(body);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  return NextResponse.json({ message: "Patient added successfully" });
}
