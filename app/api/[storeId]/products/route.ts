import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { Proportions } from "lucide-react"
import { NextResponse } from "next/server"

export async function POST(req: Request,
    {params} : { params: {storeId: string }}
) {
    try {
        const { userId } = auth()
        const body  = await req.json()

        const { 
            name, 
            images,
            categoryId,
            price,
            isFeatured,
            isArchived 
        } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        
        if (!name) return new NextResponse("Nama perlu diinput", { status: 400 })

        if (!price) return new NextResponse("Harga perlu diinput", { status: 400 })

        if (!categoryId) return new NextResponse("Kategori perlu diinput", { status: 400 })

        if (!images || !images.length) return new NextResponse("Masukkan gambar", { status: 400 })

        if (!params.storeId) return new NextResponse("Id Tidak terdaftar", { status: 400 })

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })        
        
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 400 })
            
        const product = await db.product.create({
            data: {
                name,
                images:{
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                },
                price,
                categoryId,
                isArchived,
                isFeatured,
                storeId: params.storeId,
            }
        })


        return NextResponse.json(product)

    } catch (err) {
        console.log("[PRODUCTS_POST]", err)
        return new NextResponse("Internal err", { status: 500})
    }
}

export async function GET(
    req: Request,
    { params } : { params : { storeId: string }}
) {
    try {

        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined

        const isFeatured = searchParams.get("isFeatured")


        if (!params.storeId) return new NextResponse("Id Tidak ada")
        
        const product = await db.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(product)
    } catch (err) {
        console.log("[PRODUCTS_GET]", err)
        return new NextResponse("Internal Err", {status: 500 })
    }

}