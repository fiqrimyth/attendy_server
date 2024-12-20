const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email wajib diisi"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Format email tidak valid"],
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
      minlength: [6, "Password minimal 6 karakter"],
    },
    deviceId: {
      type: String,
      required: [true, "Device ID wajib diisi"],
      unique: true,
      validate: {
        validator: function (v) {
          return v != null && v.length > 0;
        },
        message: "Device ID tidak valid",
      },
      set: function (value) {
        console.log("Incoming deviceId:", value, typeof value);
        if (value == null) {
          throw new Error("Device ID tidak boleh null atau undefined");
        }
        return String(value).trim();
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return {
          id: ret.id,
          email: ret.email,
          password: ret.password,
          deviceId: ret.deviceId,
        };
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (next) {
  try {
    console.log("Data yang akan disimpan:", {
      email: this.email,
      deviceId: this.deviceId,
      deviceIdType: typeof this.deviceId,
    });

    this.updatedAt = Date.now();
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    console.error("Error dalam pre-save:", error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      deviceId: this.deviceId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d", // Token berlaku 7 hari
    }
  );
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    return ret;
  },
});

module.exports = mongoose.model("Login", userSchema);
