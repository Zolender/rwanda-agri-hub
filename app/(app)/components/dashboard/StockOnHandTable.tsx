"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp, Search } from "lucide-react";
import {useState, useMemo} from "react";


type Product = {
    id: string;
    categoryId: string;
    unitOfMeasure: string;
    unitCostRwf: number;
    sellingPriceRwf: number;
    quantity: number;
    reorderPointUnits: number;
}

type SortField = keyof Product;
type SortDirection = "asc" | "desc"



const StockOnHandTable = ({products}: {products: Product[]}) => {
    
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<SortField>("id");
    const [sortDirection, setSortDirection] =  useState<SortDirection>("asc");


    const handleSort = (field: SortField)=>{
        if(sortField === field){
            setSortDirection(sortDirection === "asc"? "desc": "asc")
        }else{
            setSortField(field)
            setSortDirection("asc");
        }
    }


    const filteredAndSorted = useMemo(()=>{
        let result = products;
        if(searchTerm){
            result = result.filter(p=>p.id.toLowerCase().includes(searchTerm.toLowerCase())|| p.categoryId.toLowerCase().includes(searchTerm.toLowerCase()))
        }
        result= [...result].sort((a,b)=>{
            const aVal = a[sortField];
            const bVal = b[sortField]

            if(typeof aVal === "string" && typeof bVal === "string"){
                return sortDirection === "asc"
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal)

            }
            if(typeof aVal === "number" && typeof bVal === "number"){
                return sortDirection === "asc"? aVal - bVal : bVal - aVal
            }
            return 0;
        })
        return result
    },[products, searchTerm, sortDirection, sortField])

    const SortIcon = ({field}: {field: SortField})=>{
        if(sortField !== field){
            return <ChevronsUpDown className="w-4 h-4 text-gray-400"/>
        }
        return sortDirection === "asc"
            ? <ChevronUp className="w-4 h4"/>
            : <ChevronDown className="w-4 h4"/>
    }

    
    return (
        <div className="bg-white rounded-lg shadow">
            {/* Search Bar */}
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-700 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by Product ID or Category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border placeholder:text-stone-400 text-stone-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("id")}
                            >
                                <div className="flex items-center gap-2">
                                    Product ID
                                    <SortIcon field="id" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("categoryId")}
                            >
                                <div className="flex items-center gap-2">
                                    Category
                                    <SortIcon field="categoryId" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("quantity")}
                            >
                                <div className="flex items-center gap-2">
                                    Stock Level
                                    <SortIcon field="quantity" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unit
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("reorderPointUnits")}
                            >
                                <div className="flex items-center gap-2">
                                    Reorder Point
                                    <SortIcon field="reorderPointUnits" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th 
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("unitCostRwf")}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Unit Cost (RWF)
                                    <SortIcon field="unitCostRwf" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSorted.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            filteredAndSorted.map((product) => {
                                const isLowStock = product.quantity <= product.reorderPointUnits;
                                
                                return (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.categoryId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                            {product.quantity.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.unitOfMeasure}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.reorderPointUnits.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isLowStock ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    In Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                            {product.unitCostRwf.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Results count */}
            <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-500">
                Showing {filteredAndSorted.length} of {products.length} products
            </div>
        </div>
    );
}
 
export default StockOnHandTable;