"use client";

import { Star } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface WatchlistTableProps {
    watchlist: {
        symbol: string;
        company: string;
    }[];
}

export default function WatchlistTable({
                                           watchlist,
                                       }: WatchlistTableProps) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Market Cap</TableHead>
                        <TableHead>P/E Ratio</TableHead>
                        {/*<TableHead className="text-right">*/}
                        {/*    Alert*/}
                        {/*</TableHead>*/}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {watchlist.map((stock) => (
                        <TableRow key={stock.symbol}>
                            <TableCell>
                                <Star
                                    className="h-4 w-4 fill-yellow-500 text-yellow-500"
                                />
                            </TableCell>

                            <TableCell className="font-medium">
                                {stock.company}
                            </TableCell>

                            <TableCell>
                                {stock.symbol}
                            </TableCell>

                            <TableCell>
                                $233.16
                            </TableCell>

                            <TableCell className="text-emerald-500 font-medium">
                                +1.54%
                            </TableCell>

                            <TableCell>
                                $3.56T
                            </TableCell>

                            <TableCell>
                                35.5
                            </TableCell>

                            {/*<TableCell className="text-right">*/}
                            {/*    <button*/}
                            {/*        className="*/}
                            {/*            rounded-md*/}
                            {/*            bg-orange-500/10*/}
                            {/*            px-3*/}
                            {/*            py-1*/}
                            {/*            text-sm*/}
                            {/*            text-orange-400*/}
                            {/*            hover:bg-orange-500/20*/}
                            {/*        "*/}
                            {/*    >*/}
                            {/*        Add Alert*/}
                            {/*    </button>*/}
                            {/*</TableCell>*/}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}