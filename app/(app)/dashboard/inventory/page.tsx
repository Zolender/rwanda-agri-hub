import { getPaginatedInventory } from "@/app/lib/actions/inventory";
import InventoryTable from "@/app/(app)/components/inventory/InventoryTable";
import InventoryPageHeader from "@/app/(app)/components/inventory/InventoryPageHeader";

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
            <InventoryPageHeader totalCount={totalCount} />

            <InventoryTable
                key={`${query}-${currentPage}`}
                initialData={items}
                totalPages={totalPages}
                currentPage={currentPage}
            />
        </div>
    );
}