import prisma from "@/prisma";
import { Request, Response, NextFunction } from "express";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        inventoryId: true,
      },
    });
    // TODO: Implement pagination
    // TODO: Implement filtering
    return res.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
};

export default getProducts;
