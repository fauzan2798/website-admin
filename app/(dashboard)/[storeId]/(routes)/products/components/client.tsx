"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { ProductColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface ProductClientProsp {
    data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProsp> = ({
    data
}) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
        <div className="flex items-center justify-between">
            <Heading 
            title={`Product (${data.length})`}
            description="Atur Product untuk toko"
            />
            <Button onClick={() => router.push(`/${params.storeId}/products/new`) }>
                <Plus className="mr-2 h-4 w-4"/>
                Add New
            </Button>
        </div>
        <Separator />
        <DataTable data={data} columns={columns} searchKey="name" />
        <Heading
        title="API"
        description="API untuk Products"
        />
        <Separator/>
        <ApiList namaIndikator={"products"} idIndikator={"productId"}/>
        </>
    )
}