import Price from "../models/Deliveryprices/Deliveryprices.model.js";

export const handleGetAllPrices = async (req, res) => {
  try {
    const allPrices = await Price.find({});
    return res.status(200).json(allPrices);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const handleCreateNewPrice = async (req, res) => {
  const { priceName, priceAmount } = req.body;
  console.log(priceAmount, priceName, req.body);
  try {
    const existingPrice = await Price.findOne({
      priceName,
    })
      .then((data) => {
        if (data) {
          return data;
        }
      })
      .catch((err) => {
        return err;
      });
    if (existingPrice) {
      return res.status(400).json({ error: "Price already exists" });
    } else if (!existingPrice) {
      const newPrice = new Price({
        priceName: priceName,
        priceAmount: priceAmount,
      });
      const savedPrice = await newPrice.save();
      return res.status(200).json({ savedPrice });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const handleEditPrice = async (req, res) => {
  const id = req.params.priceID;
  const { priceName, priceAmount } = req.body;
  try {
    const updatedPrice = await Price.findByIdAndUpdate(
      id,
      { priceName, priceAmount },
      { new: true }
    );
    return res.status(200).json({ updatedPrice: updatedPrice });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Unabled to Edit price. An error occured.." });
  }
};

export const handleDeletePrice = async (req, res) => {
  const priceID = req.params.priceID;

  try {
    const result = await Price.deleteOne({ _id: priceID });
    console.log(`Deleted ${result.deletedCount} item(s)`);

    return res.status(200).json({ message: "Price deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
