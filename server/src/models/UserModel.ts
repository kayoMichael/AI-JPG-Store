import mongoose from 'mongoose';
const { Schema } = mongoose;

interface IUser {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
