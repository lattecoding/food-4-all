import { Schema, model, Document, Types } from "mongoose";

// Define the Favorite document interface
export interface IFavorite extends Document {
  user: Types.ObjectId;
  restaurant: Types.ObjectId;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Favorite = model<IFavorite>("Favorite", favoriteSchema);

export default Favorite;
