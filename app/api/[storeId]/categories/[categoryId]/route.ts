import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    { params }: { params: { categoryId: string} }
) {
    try {
        if (!params.categoryId) {
            return new NextResponse("Kategori id dibutuhkan", { status: 400})
        }

        const category = await db.category.findUnique({
            where: {
                id: params.categoryId,
            },
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("[CATEGORY_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string} }
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const { name, bannerId } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 400 })
        }

        if (!name) {
            return new NextResponse("Harus menginput nama", { status: 400 })
        }

        if (!bannerId) {
            return new NextResponse("Banner id harus dimasukkan", { status: 400 })
        }

        if (!params.categoryId) {
            return new NextResponse("Kategori id dibutuhkan", { status: 400})
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })        

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 400 })

        const category = await db.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                bannerId
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("[CATEGORY_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string} }
) {
    try {
        const { userId } = auth()


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 400 })
        }

        if (!params.categoryId) {
            return new NextResponse("Kategori id dibutuhkan", { status: 400})
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })        

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 400 })

        const category = await db.category.deleteMany({
            where: {
                id: params.categoryId,
            },
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("[CATEGORY_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}