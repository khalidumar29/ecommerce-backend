import prisma from "@/prisma";
import { Request, Response, NextFunction } from "express";

const getInventoryDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const inventory = await prisma.inventory.findUnique({
      where: { id: id },
      include: {
        Histories: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    return res.status(200).json(inventory);
  } catch (e) {
    next(e);
  }
};

export default getInventoryDetails;
