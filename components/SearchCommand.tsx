"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import {Loader2,  TrendingUp,Star} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.action";
import {useDebounce} from "@/hooks/useDebounce";
import {toggleWatchlist} from "@/lib/actions/watchlist.actions";
import {getCurrentUserWatchlistSymbols} from "@/lib/actions/watchlist.actions";

export default  function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);
    const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([]);
    const isSearchMode = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);
    const handleToggleWatchlist = async (
        e: React.MouseEvent,
        symbol: string,
        company: string
    ) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const result = await toggleWatchlist(
                symbol,
                company
            );

            if (result.added) {
                setWatchlistSymbols(prev => [
                    ...prev,
                    symbol
                ]);
            } else {
                setWatchlistSymbols(prev =>
                    prev.filter(s => s !== symbol)
                );
            }
        } catch (error) {
            console.error(
                "Failed to update watchlist",
                error
            );
        }
    };
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setOpen(v => !v)
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])
    useEffect(() => {
        const loadWatchlist = async () => {
            try {
                const symbols = await getCurrentUserWatchlistSymbols();
                setWatchlistSymbols(symbols);
            } catch (error) {
                console.error("Failed to load watchlist:", error);
            }
        };

        loadWatchlist();
    }, []);
    const handleSearch = async () => {
        if(!isSearchMode) return setStocks(initialStocks);

        setLoading(true)
        try {
            const results = await searchStocks(searchTerm.trim());
            setStocks(results);
        } catch {
            setStocks([])
        } finally {
            setLoading(false)
        }
    }

    const debouncedSearch = useDebounce(handleSearch, 300);

    useEffect(() => {
        debouncedSearch();
    }, [searchTerm]);

    const handleSelectStock = () => {
        setOpen(false);
        setSearchTerm("");
        setStocks(initialStocks);
    }

    return (
        <>
            {renderAs === 'text' ? (
                <span onClick={() => setOpen(true)} className="search-text">
            {label}
          </span>
            ): (
                <Button onClick={() => setOpen(true)} className="search-btn">
                    {label}
                </Button>
            )}
            <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
                <div className="search-field">
                    <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search stocks..." className="search-input" />
                    {loading && <Loader2 className="search-loader" />}
                </div>
                <CommandList className="search-list">
                    {loading ? (
                        <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
                    ) : displayStocks?.length === 0 ? (
                        <div className="search-list-indicator">
                            {isSearchMode ? 'No results found' : 'No stocks available'}
                        </div>
                    ) : (
                        <ul>
                            <div className="search-count">
                                {isSearchMode ? 'Search results' : 'Popular stocks'}
                                {` `}({displayStocks?.length || 0})
                            </div>
                            {displayStocks?.map((stock, i) => (
                                <li key={stock.symbol} className="search-item">
                                    <Link
                                        href={`/stocks/${stock.symbol}`}
                                        onClick={handleSelectStock}
                                        className="search-item-link"
                                    >
                                        <TrendingUp className="h-4 w-4 text-gray-500" />
                                        <div  className="flex-1">
                                            <div className="search-item-name">
                                                {stock.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {stock.symbol} | {stock.exchange } | {stock.type}
                                            </div>
                                        </div>
                                        <Star
                                            onClick={(e) =>
                                                handleToggleWatchlist(
                                                    e,
                                                    stock.symbol,
                                                    stock.name
                                                )
                                            }
                                            className={`h-4 w-4 cursor-pointer transition-colors ${
                                                watchlistSymbols.includes(stock.symbol)
                                                    ? "fill-yellow-500 text-yellow-500"
                                                    : "text-gray-400 hover:text-yellow-500"
                                            }`}
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )
                    }
                </CommandList>
            </CommandDialog>
        </>
    )
}
export {};