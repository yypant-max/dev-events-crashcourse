'use server';

import { Booking } from "@/database/booking.model";
import connectToDatabase from "../mongodb";
import { FaceNormalsHelper } from "ogl";

export const createBooking = async ({eventId, slug, email}: {eventId: string, slug: string, email: string}) => {
    try {
        await connectToDatabase();
        await Booking.create({ eventId, email });
        return {success: true};

    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false};
    }
}