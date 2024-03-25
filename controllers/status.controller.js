// status.controller.js
export const checkOnline = async (req, res) => {
  try {
    res.status(200).json({ message: "Server is active" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server is offline", error: error.message });
  }
};
