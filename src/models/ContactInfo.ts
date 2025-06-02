import mongoose, { Document, Schema } from "mongoose";

interface IContactInfo extends Document {
  phone: string;
  email: string;
  address: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
}

const contactInfoSchema = new Schema<IContactInfo>({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  socialLinks: {
    instagram: { type: String, required: true },
    facebook: { type: String, required: true },
    whatsapp: { type: String, required: true },
  },
});

export default mongoose.model<IContactInfo>("ContactInfo", contactInfoSchema);
