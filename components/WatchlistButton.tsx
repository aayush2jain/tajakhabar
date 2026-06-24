"use client";
import React, { useMemo, useState } from "react";
import { Star, Loader2 } from "lucide-react";
// Minimal WatchlistButton implementation to satisfy page requirements.
// This component focuses on UI contract only. It toggles local state and
// calls onWatchlistChange if provided. Styling hooks match globals.css.
import { toggleWatchlist } from "@/lib/actions/watchlist.actions";
const WatchlistButton = ({
                             symbol,
                             company,
                             isInWatchlist,
                             showTrashIcon = false,
                             type = "button",
                             onWatchlistChange,
                         }: WatchlistButtonProps) => {
    const [added, setAdded] = useState<boolean>(!!isInWatchlist);

    const label = useMemo(() => {
        if (type === "icon") return added ? "" : "";
        return added ? "Remove from Watchlist" : "Add to Watchlist";
    }, [added, type]);

    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);

            const result = await toggleWatchlist(
                symbol,
                company
            );

            setAdded(result.added);

            onWatchlistChange?.(symbol, result.added);
        } catch (error) {
            console.error("Failed to update watchlist", error);
        } finally {
            setLoading(false);
        }
    };

    if (type === "icon") {
        return (
            <button
                title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
                onClick={handleClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={added ? "#FACC15" : "none"}
                    stroke="#FACC15"
                    strokeWidth="1.5"
                    className="watchlist-star"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
                    />
                </svg>
            </button>
        );
    }

    return (
        <button
            disabled={loading}
            onClick={handleClick}
            title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
            aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
            className={`
        inline-flex items-center gap-2
        rounded-lg border px-4 py-2
        text-sm font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
                added
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                    : "border-gray-700 bg-gray-900 text-gray-300 hover:border-yellow-500 hover:text-yellow-500"
            }
    `}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Star
                    className={`h-4 w-4 ${
                        added ? "fill-yellow-500 text-yellow-500" : ""
                    }`}
                />
            )}

            <span>
        {added ? "In Watchlist" : "Add to Watchlist"}
    </span>
        </button>
    );
};

export default WatchlistButton;