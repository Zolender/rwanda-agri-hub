import { getPaginatedInventory } from "@/app/lib/actions/inventory";
import InventoryTable from "@/app/components/inventory/InventoryTable";

export default async function InventoryPage({
    searchParams,
    }: {
    searchParams: { page?: string; query?: string };
    }) {
    const currentPage = Number(searchParams.page) || 1;
    const query = searchParams.query || "";

    const { items, totalPages, totalCount } = await getPaginatedInventory(currentPage, query);

    return (
        <div className="p-8 space-y-6">
        <header className="flex justify-between items-end">
            <div>
            <h1 className="text-3xl font-bold text-slate-900">Inventory Master List</h1>
            <p className="text-slate-500">Managing {totalCount} active products in the hub.</p>
            </div>
        </header>

        {/* This component will handle the search input and the actual table rows */}
        <InventoryTable 
            initialData={items} 
            totalPages={totalPages} 
            currentPage={currentPage} 
        />
        </div>
    );
}