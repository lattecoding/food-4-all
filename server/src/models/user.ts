import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  password: string;
  favorites: mongoose.Types.ObjectId[]; // Array of references to Restaurant
  isCorrectPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Restaurant", // Assuming you have a Restaurant model
    },
  ],
}, {
  // Automatically manage createdAt and updatedAt fields
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Custom method to compare and validate password
userSchema.methods.isCorrectPassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;