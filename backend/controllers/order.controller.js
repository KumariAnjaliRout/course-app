import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

export const orderData = async (req, res) => {
  const order = req.body;

  try {
    const orderInfo = await Order.create(order);
    if (!orderInfo) {
      return res.status(400).json({ errors: "Failed to create order" });
    }

    const userId = orderInfo.userId;
    const courseId = orderInfo.courseId;

    // Create purchase after order is created
    await Purchase.create({ userId, courseId });

    res.status(201).json({ message: "Order and purchase created successfully", orderInfo });
  } catch (error) {
    console.error("Error in order creation:", error);
    res.status(500).json({ errors: "Error in order creation" });
  }
};
