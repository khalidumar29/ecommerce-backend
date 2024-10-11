import { ProductCreateDTOSchema } from "@/schemas";
import { Request, Response, NextFunction } from "express";
import { INVENTORY_SERVICE_URL } from "@/config";
import prisma from "@/prisma";
import axios from "axios";
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseBody = ProductCreateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parseBody.error.errors,
      });
    }

    //    check if product with same sku exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku: parseBody.data?.sku,
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "Product with same sku already exists",
      });
    }

    //    create product
    const product = await prisma.product.create({
      data: parseBody.data,
    });
    console.log("Product created successfully", product.id);

    //    create inventory record for the product
    const { data: inventory } = await axios.post(
      `${INVENTORY_SERVICE_URL}/inventories`,
      {
        productId: product.id,
        sku: product.sku,
      }
    );
    console.log("Inventory created successfully", inventory.id);

    // update product adn store inventory id
    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        inventoryId: inventory.id,
      },
    });
    console.log("Product updated successfully with inventory id", product.id);
    return res.status(201).json({ ...product, inventoryId: inventory.id });
  } catch (error) {
    next(error);
  }
};

export default createProduct;
