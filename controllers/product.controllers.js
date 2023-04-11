import Product from "../models/Products/Product.model.js";

export const handleGetAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    return res.status(200).json(allProducts);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const handleCreateNewProduct = async (req, res) => {
  try {
    const {
      productName,
      productCategory,
      productCollection,
      productPrice,
      productImages,
      productType,
    } = req.body;
    const existingProduct = await Product.findOne({
      productCategory,
      productCollection,
      productName,
    })
      .then((data) => {
        if (data) {
          return data;
        }
      })
      .catch((err) => {
        return err;
      });
    if (existingProduct) {
      return res.status(400).json({ error: "Product Already Exists" });
    } else if (!existingProduct) {
      const newProduct = new Product({
        productCategory,
        productCollection,
        productImages: productImages?.split(","),
        productName,
        productPrice,
        productType,
      });
      const savedProduct = await newProduct.save();
      return res.status(200).json({ savedProduct });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};
export const handleDeleteProduct = async (req, res) => {
  const productID = req.params.productID;

  try {
    const result = await Product.deleteOne({ _id: productID });
    console.log(`Deleted ${result.deletedCount} item(s)`);

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const handleEditProductDetails = async (req, res) => {
  try {
    const id = req.params.productID;
    const {
      productName,
      productCategory,
      productCollection,
      productPrice,
      productImages,
      productType,
    } = req.body;
    console.log(req.body);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        productCategory,
        productCollection,
        productImages: productImages?.split(","),
        productPrice,
        productType,
      },
      { new: true }
    );
    return res.status(200).json({ updatedProduct: updatedProduct });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Unabled to Edit product. An error occured.." });
  }
};
