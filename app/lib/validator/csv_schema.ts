import { z } from 'zod';

export const TransactionCsvSchema = z.object({
    product_id: z.string().min(1),
    category_id: z.string().min(1),
    unit_of_measure: z.string(),
    unit_cost_rwf: z.coerce.number(),
    selling_price_rwf: z.coerce.number(),
    // We ignore product_status as per your project scope
    reorder_point_units: z.coerce.number(),
    lead_time_buffer_days: z.coerce.number(),
    movement_type: z.enum(['Sale', 'Adjustment', 'Purchase']),
    quantity_ordered_units: z.coerce.number().optional().default(0),
    quantity_fulfilled_units: z.coerce.number(),
    remaining_stock_units: z.coerce.number(),
    order_id: z.string(),
    customer_id: z.string().optional(),
    region: z.string(),
    lost_sale_qty_units: z.coerce.number().default(0),
    po_id: z.string().optional(),
    supplier_id: z.string().optional(),
    transaction_date: z.string(), // We will parse this string into a Date object next
    landed_cost_rwf: z.coerce.number(),
    });

// This helps TypeScript know exactly what a "TransactionRow" looks like
export type TransactionRow = z.infer<typeof TransactionCsvSchema>;