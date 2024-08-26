"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { BannerColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface BannerClientProsp {
    data: BannerColumn[]
}

export const BannerClient: React.FC<BannerClientProsp> = ({
    data
}) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
        <div className="flex items-center justify-between">
            <Heading 
            title={`Banner (${data.length})`}
            description="Atur Banner untuk toko"
            />
            <Button onClick={() => router.push(`/${params.storeId}/banners/new`) }>
                <Plus className="mr-2 h-4 w-4"/>
                Add New
            </Button>
        </div>
        <Separator />
        <DataTable data={data} columns={columns} searchKey="label" />
        <Heading
        title="API"
        description="API untuk Banners"
        />
        <Separator/>
        <ApiList namaIndikator={"banners"} idIndikator={"bannerId"}/>
        </>
    )
}