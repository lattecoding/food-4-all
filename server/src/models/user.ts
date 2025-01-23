import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  password: string;
  favorites: Types.ObjectId[]; // Array of references to Restaurant
  isCorrectPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Optional: Trims whitespace from the username
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Optional: Minimum password length
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Restaurant", // Assuming you have a Restaurant model
      },
    ],
  },
  {
    // Automatically manage createdAt and updatedAt fields
    timestamps: true,
  }
);

// Hash password before saving (for create and update)
userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Hash password on findOneAndUpdate
userSchema.pre<IUser>("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as { password?: string };
  if (update.password) {
    const saltRounds = 10;
    update.password = await bcrypt.hash(update.password, saltRounds);
  }
  next();
});

// Custom method to validate password
userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>("User", userSchema);

export default User;