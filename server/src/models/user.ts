import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Mongoose will automatically manage createdAt and updatedAt fields:
    timestamps: true,
  },
);

// Hash password before saving (for create and update):
userSchema.pre<IUser>("save", async function (next) {
  // Only re-hash if the password key has been modified (or is new)
  if (this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Hash password on findOneAndUpdate:
userSchema.pre("findOneAndUpdate", async function (next) {
  // "this" is the Query object, so we get the update from "this.getUpdate()"
  const update = this.getUpdate() as { password?: string };
  if (update.password) {
    const saltRounds = 10;
    update.password = await bcrypt.hash(update.password, saltRounds);
  }
  next();
});

const User = model<IUser>("User", userSchema);

export default User;
