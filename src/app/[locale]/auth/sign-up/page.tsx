import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import SignUp from "@/app/[locale]/auth/_components/SignUp";


export default async function Page() {
    const session = await getServerSession(authOptions)

    return (
        <SignUp session={session} />
    )
}
