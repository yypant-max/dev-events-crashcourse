import connectToDatabase from "@/lib/mongodb";
import Event from '@/database/event.model';
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler for fetching a single event by slug.
 * @param request - The incoming Next.js request object.
 * @param context - The context object containing route parameters.
 * @returns A JSON response with the event data or an error message.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    // Establish database connection
    await connectToDatabase();

    // Extract and validate the slug parameter
    const { slug } = await context.params;
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 }
      );
    }

    // Normalize the slug to lowercase for consistent querying
    const normalizedSlug = slug.trim().toLowerCase();

    // Query the database for the event with the matching slug
    const event = await Event.findOne({ slug: normalizedSlug });

    // If no event is found, return a 404 response
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    // Return the event data with a success message
    return NextResponse.json(
      { message: "Event fetched successfully", event: event.toObject() },
      { status: 200 }
    );
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching event by slug:", error);

    // Return a generic internal server error response
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}