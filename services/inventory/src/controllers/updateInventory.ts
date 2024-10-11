import prisma from "@/prisma";
import { inventoryUpdateDTOSchema } from "@/schemas";
import { NextFunction, Request, Response } from "express";

const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //  check the inventory exists
    const { id } = req.params;
    const inventory = await prisma.inventory.findUnique({
      where: { id },
    });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    //  update the inventory
    const parseBody = inventoryUpdateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    //  find the last history
    const lastHistory = await prisma.history.findFirst({
      where: { inventoryId: id },
      orderBy: { createdAt: "desc" },
    });
    //  calulate the new quantity
    let newQuantity = inventory.quantity;
    if (parseBody.data.ActionType === "IN") {
      newQuantity += parseBody.data.quantity;
    } else {
      newQuantity -= parseBody.data.quantity;
    }

    //  update the inventory
    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: newQuantity,
        Histories: {
          create: {
            actionType: parseBody.data.ActionType,
            quantityChanged: parseBody.data.quantity,
            lastQuantity: lastHistory?.newQuantity || 0,
            newQuantity,
          },
        },
      },
    });
    return res.status(200).json(updatedInventory);
  } catch (error) {
    next(error);
  }
};

export default updateInventory;
