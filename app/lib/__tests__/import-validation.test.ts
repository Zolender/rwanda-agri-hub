import {describe, it, expect} from 'vitest'
import { z } from 'zod'

const RowSchema = z.object({
    product_id: z.string().min(1),
    category_id: z.string().min(1),
    unit_of_measure: z.string().default("Kg"),
    unit_cost_rwf: z.preprocess((v) => Number(String(v).replace(/[^0-9.-]+/g, "")), z.number()),
    selling_price_rwf: z.preprocess((v) => Number(String(v).replace(/[^0-9.-]+/g, "")), z.number()),
    landed_cost_rwf: z.preprocess((v) => Number(String(v).replace(/[^0-9.-]+/g, "")), z.number()),
    product_stock: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    reorder_point: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    lead_time_days: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    movement_type: z.enum(["Sale", "Adjustment", "Purchase"]).default("Purchase"),
    quantity_ordered_units: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int().optional()),
    quantity_fulfilled_units: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    remaining_stock_units: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    order_id: z.string().default("INITIAL_IMPORT"),
    region: z.string().default("Kigali Hub"),
    customer_id: z.string().optional().nullable(),
    supplier_id: z.string().optional().nullable(),
    po_id: z.string().optional().nullable(),
});

describe('CSV Import Validation', () => {
    it('should validate a correct product row', () => {
        const validRow = {
            product_id: 'AGRI-001',
            category_id: 'CAT-SEEDS',
            unit_of_measure: 'Kg',
            unit_cost_rwf: '1500',
            selling_price_rwf: '2000',
            landed_cost_rwf: '1600',
            product_stock: '100',
            reorder_point: '20',
            lead_time_days: '7',
            movement_type: 'Purchase',
            quantity_fulfilled_units: '100',
            remaining_stock_units: '100',
    };

    const result = RowSchema.safeParse(validRow);
    expect(result.success).toBe(true);
});

    it('should reject a row with missing product_id', () => {
        const invalidRow = {
        category_id: 'CAT-SEEDS',
        unit_cost_rwf: '1500',
    };

        const result = RowSchema.safeParse(invalidRow);
        expect(result.success).toBe(false);
    });

    it('should clean currency formatting from prices', () => {
        const rowWithCurrency = {
        product_id: 'AGRI-001',
        category_id: 'CAT-SEEDS',
        unit_of_measure: 'Kg',
        unit_cost_rwf: 'RWF 1,500.00',
        selling_price_rwf: '2,000',
        landed_cost_rwf: '1600.50',
        product_stock: '100',
        reorder_point: '20',
        lead_time_days: '7',
        quantity_fulfilled_units: '100',
        remaining_stock_units: '100',
    };

    const result = RowSchema.safeParse(rowWithCurrency);
    expect(result.success).toBe(true);
    
    if (result.success) {
        expect(result.data.unit_cost_rwf).toBe(1500);
        expect(result.data.selling_price_rwf).toBe(2000);
        expect(result.data.landed_cost_rwf).toBe(1600.50);
        }
    });
});