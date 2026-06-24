'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import {auth} from "@/lib/better-auth/auth"
import {headers} from "next/headers";
import {redirect} from "next/navigation";
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        // Better Auth stores users in the "user" collection
        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return [];

        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
        return items.map((i) => String(i.symbol));
    } catch (err) {
        console.error('getWatchlistSymbolsByEmail error:', err);
        return [];
    }
}

export async function getUserWatchlist() {
    await connectToDatabase();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        redirect('/sign-in');
    }

    const watchlist = await Watchlist.find({
        userId: session.user.id,
    })
        .sort({ addedAt: -1 })
        .lean();

    return watchlist.map((item) => ({
        ...item,
        _id: item._id?.toString(),
        addedAt: item.addedAt?.toISOString?.() ?? item.addedAt,
    }));
}

export async function getCurrentUserWatchlistSymbols() {
    await connectToDatabase();

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.email) {
        return [];
    }

    return await getWatchlistSymbolsByEmail(
        session.user.email
    );
}

export async function toggleWatchlist(
    symbol: string,
    company: string
) {
    await connectToDatabase();
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const existing = await Watchlist.findOne({
        userId,
        symbol
    });

    if (existing) {
        await Watchlist.deleteOne({
            userId,
            symbol
        });

        return {
            added: false
        };
    }

    await Watchlist.create({
        userId,
        symbol,
        company
    });

    return {
        added: true
    };
}
export async function isStockInWatchlist(symbol: string) {
    await connectToDatabase();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return false;
    }

    const item = await Watchlist.findOne({
        userId: session.user.id,
        symbol,
    });

    return !!item;
}
