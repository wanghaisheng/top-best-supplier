import mongoose from 'mongodb';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    uid: String,
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
