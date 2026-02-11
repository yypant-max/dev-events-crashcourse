import mongoose, { Schema, Document } from 'mongoose';
import Event from './event.model';

// Interface for Booking document
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema
const bookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to verify event exists
bookingSchema.pre<IBooking>('save', async function () {
  const event = await Event.findById(this.eventId);
  if (!event) {
    throw new Error('Referenced event does not exist');
  }
});

// Index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

// Booking model
export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);