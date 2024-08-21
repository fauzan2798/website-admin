import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request,
    {params} : { params: {storeId: string }}
) {
    try {
        const { userId } = auth()
        const body  = await req.json()

        const { label, imageUrl } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        
        if (!label) return new NextResponse("Label perlu diinput", { status: 400 })

        if (!imageUrl) return new NextResponse("Masukkan gambar", { status: 400 })

        if (!params.storeId) return new NextResponse("Id Tidak terdaftar", { status: 400 })

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })        
        
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 400 })
            
        const banner = await db.banner.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId,
            }
        })


        return NextResponse.json(banner)

    } catch (err) {
        console.log("[BANNERS POST]", err)
        return new NextResponse("Internal err", { status: 500})
    }
}

export async function GET(
    req: Request,
    { params } : { params : { storeId: string }}
) {
    try {
        if (!params.storeId) return new NextResponse("Id Tidak ada")
        
        const banner = await db.banner.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(banner)
    } catch (err) {
        console.log("[BANNERS_GET]", err)
        return new NextResponse("Internal Err", {status: 500 })
    }

}