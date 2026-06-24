import WatchlistTable from "@/components/WatchlistTable";
import { Button } from "@/components/ui/button";
import {getUserWatchlist} from "@/lib/actions/watchlist.actions";
import SearchCommand from "@/components/SearchCommand";
export default async function WatchlistPage() {
    const watchlist = await getUserWatchlist();

    return (
        <main className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">
                    Watchlist
                </h1>


                <SearchCommand
                    renderAs="button"
                    label="Add Stock"
                    initialStocks={[]}
                />
            </div>

            <WatchlistTable watchlist={watchlist} />
        </main>
    );
}