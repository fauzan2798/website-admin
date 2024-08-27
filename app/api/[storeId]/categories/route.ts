import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request,
    {params} : { params: {storeId: string }}
) {
    try {
        const { userId } = auth()
        const body  = await req.json()

        const { name, bannerId } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        
        if (!name) return new NextResponse("Nama kategori perlu diinput", { status: 400 })

        if (!bannerId) return new NextResponse("Banner id diperlukan", { status: 400 })

        if (!params.storeId) return new NextResponse("Id Tidak terdaftar", { status: 400 })

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })        
        
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 400 })
            
        const category = await db.category.create({
            data: {
                name,
                bannerId,
                storeId: params.storeId,
            }
        })


        return NextResponse.json(category)

    } catch (err) {
        console.log("[CATEGORIES POST]", err)
        return new NextResponse("Internal err", { status: 500})
    }
}

export async function GET(
    req: Request,
    { params } : { params : { storeId: string }}
) {
    try {
        if (!params.storeId) return new NextResponse("Id Tidak ada")
        
        const categories = await db.banner.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(categories)
    } catch (err) {
        console.log("[CATEGORIES_GET]", err)
        return new NextResponse("Internal Err", {status: 500 })
    }

}