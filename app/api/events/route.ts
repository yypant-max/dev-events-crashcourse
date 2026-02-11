import connectToDatabase from "@/lib/mongodb";
import Event from '@/database/event.model';
import { NextRequest, NextResponse } from "next/server";
import {v2 as cloudinary} from "cloudinary";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await request.formData();

    let event;
    try {
        event = Object.fromEntries(formData.entries());

    } catch (error) {
      console.error("Error converting form data to object:", error);
      return NextResponse.json({ message: "Invalid JSON form data" }, { status: 400 });
    }
    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json({ message: "Image file is required" }, { status: 400 });
    }

    let tags: string[];
    let agenda: string[];
    try {
      tags = JSON.parse(formData.get("tags") as string);
      agenda = JSON.parse(formData.get("agenda") as string);
    } catch {
      return NextResponse.json({ message: "Invalid tags or agenda format" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({resource_type: "image", folder: "DevEvent"}, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        }).end(buffer);
    });

    event.image = (uploadResult as {secure_url: string}).secure_url;

    const createdEvent = await Event.create({
        ...event, 
        tags: tags, 
        agenda:agenda,
    });
    return NextResponse.json({ message: "Event Created successfully", event: createdEvent }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Event Creation Failed", error: e instanceof Error ? e.message : "Unknown" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Failed to fetch events", error: e instanceof Error ? e.message : "Unknown" }, { status: 500 });
  }
}