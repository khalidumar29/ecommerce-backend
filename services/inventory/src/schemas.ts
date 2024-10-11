import { ActionType } from "@prisma/client";
import { z } from "zod";

export const InventoryCreateDTOSchema = z.object({
  productId: z.string(),
  sku: z.string(),
  quantity: z.number().int().optional().default(0),
});

// export type InventoryCreateDTO = z.infer<typeof InventoryCreateDTOSchema>;

export const inventoryUpdateDTOSchema = z.object({
  quantity: z.number().int(),
  ActionType: z.nativeEnum(ActionType),
});
