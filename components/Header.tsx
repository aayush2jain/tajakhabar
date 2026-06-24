import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import {searchStocks} from "@/lib/actions/finnhub.action";

const Header = async ({
                          user,
                      }: {
    user?: User | null;
}) => {
    const initialStocks = await searchStocks();

    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/">
                    <Image src="/assets/icons/logo.svg" alt="Signalist logo" width={140} height={32} className="h-8 w-auto cursor-pointer" />
                </Link>
                <nav className="hidden sm:block">
                    <NavItems initialStocks = {initialStocks} />
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <UserDropdown
                            user={user}
                            initialStocks={initialStocks}
                        />
                    ) : (
                        <Link
                            href="/sign-in"
                            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
export default Header