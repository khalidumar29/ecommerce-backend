import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { InventoryCreateDTOSchema } from "@/schemas";

const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Validate the request body
    const parseBody = InventoryCreateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }

    // Create a new inventory
    const inventory = await prisma.inventory.create({
      data: {
        ...parseBody.data,
        Histories: {
          create: {
            actionType: "IN",
            quantityChanged: parseBody.data.quantity,
            lastQuantity: 0,
            newQuantity: parseBody.data.quantity,
          },
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });
    return res.status(201).json(inventory);
  } catch (e) {
    next(e);
  }
};

export default createInventory;
