import { getPaginatedInventory } from "@/app/lib/actions/inventory";
import InventoryTable from "@/app/app/components/inventory/InventoryTable";

export const dynamic = 'force-dynamic';

export default async function InventoryPage({
    searchParams,
    }: {
    searchParams: Promise<{ page?: string; query?: string }>;
    }) {
    const resolvedParams = await searchParams;
    
    const currentPage = Number(resolvedParams.page) || 1;
    const query = resolvedParams.query || "";

    const { items, totalPages, totalCount } = await getPaginatedInventory(currentPage, query);

    return (
        <div className="p-8 space-y-6">
        <header className="flex justify-between items-end">
            <div>
            <h1 className="text-3xl font-bold text-slate-900">Inventory Master List</h1>
            <p className="text-slate-500">Managing {totalCount} active products in the hub.</p>
            </div>
        </header>

        <InventoryTable 
            key={`${query}-${currentPage}`} 
            initialData={items} 
            totalPages={totalPages} 
            currentPage={currentPage} 
        />
        </div>
    );
}