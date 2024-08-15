"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"


export const BannerClient = () => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
        <div className="flex items-center justify-between">
            <Heading 
            title="Banner (0)"
            description="Atur Banner untuk toko"
            />
            <Button onClick={() => router.push(`/${params.storeId}/banners/new`) }>
                <Plus className="mr-2 h-4 w-4"/>
                Add New
            </Button>
        </div>
        <Separator/>
        </>
    )
}