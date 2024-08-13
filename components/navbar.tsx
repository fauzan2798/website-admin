import { UserButton } from "@clerk/nextjs"
import { MainNav } from "./main-nav"
import StoreSwicher from "./store-switcher"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import db from "@/lib/db"

const Navbar = async () => {
    const { userId } = auth()

    if (!userId) {
        redirect('/sign-in')
    }

    const stores = await db.store.findMany({
        where: {
            userId
        }
    })

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwicher items={stores}/>
                <MainNav className="px-4"/>
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
        </div>
    )
}

export default Navbar