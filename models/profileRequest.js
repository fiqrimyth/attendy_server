const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      rt: String,
      rw: String,
      subDistrict: String, // Kelurahan/Desa
      district: String, // Kecamatan
      city: String, // Kota/Kabupaten
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    identityNumber: {
      // Nomor KTP
      type: String,
      required: true,
      unique: true,
    },
    employeeNumber: {
      // Nomor Induk Pegawai
      type: String,
      required: true,
      unique: true,
    },
    supportingDocuments: [
      {
        fileName: String,
        fileType: String,
        fileUrl: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return {
          id: ret.id,
          fullName: ret.fullName,
          occupation: ret.occupation,
          gender: ret.gender,
          dateOfBirth: ret.dateOfBirth,
          address: ret.address,
          street: ret.address.street,
          rt: ret.address.rt,
          rw: ret.address.rw,
          subDistrict: ret.address.subDistrict,
          district: ret.address.district,
          city: ret.address.city,
          email: ret.email,
          phoneNumber: ret.phoneNumber,
          identityNumber: ret.identityNumber,
          employeeNumber: ret.employeeNumber,
          supportingDocuments: ret.supportingDocuments,
        };
      },
    },
  }
);

module.exports = mongoose.model("Profile", profileSchema);
