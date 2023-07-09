import mongoose from "mongoose";

const DeliveryPricesSchema = mongoose.Schema(
  {
    priceName: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    priceAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Price = mongoose.model("Deliveryprice", DeliveryPricesSchema);
export default Price;
