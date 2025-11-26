import { useEffect, useMemo, useState } from "react";

const API_BASE = 'https://the-one-api.dev/v2';

export default function QuoteShowcase({ apiKey }) {

    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedQuote, setSelectedQuote] = useState(null);

    useEffect(() => {
        if (!apiKey) {
            setError(
                'Missing API key. Add VITE_ONE_API_KEY (or VITE_API_KEY) to your .env.local file and restart the dev server.',
            );
            return;
        }

        const controller = new AbortController();

        const fetchQuotes = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${API_BASE}/quote`, {
                    headers: { Authorization: `Bearer ${apiKey}` },
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch quotes. Please verify your API key.');
                }
                const data = await response.json();
                console.log("Quotes data:", data);

                setQuotes(Array.isArray(data.docs) ? data.docs : []);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Something went wrong while fetching quotes.');
                    setQuotes([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!selectedQuote) return;
        const handler = (event) => {
            if (event.key === 'Escape') setSelectedQuote(null);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [selectedQuote]);

    console.log("Selected quote: ", selectedQuote);

    const filteredQuotes = useMemo(() => {
        return quotes
            .filter((quote) =>
                quote.dialog.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .sort((a, b) => a.dialog.localeCompare(b.dialog));
    }, [quotes, searchTerm]);

    return (
        <section>
            <div>
                <p className="text-xs font-passion uppercase tracking-[0.4em] text-sky-400">
                    Quotes
                </p>
                <h2 className="text-2xl font-passion text-slate-50">
                    Middle-earth Quote Archive
                </h2>
            </div>

            {loading && (
                <div className="mt-8 flex items-center justify-center rounded-2xl border border-dashed border-sky-400/40 bg-[#0b1224]/70 p-8 text-sky-100">
                    Pulling reels from the vaults of Minas Tirith...
                </div>
            )}

            {!loading && error && !quotes.length && (
                <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                </div>
            )}

            {!loading && filteredQuotes.length === 0 && (
                <div className="mt-8 rounded-2xl border border-gray-700 bg-[#0b1224]/70 p-6 text-center text-gray-400">
                    No quotes match your query. Try a different quote.
                </div>
            )}

            {!loading && filteredQuotes.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredQuotes.map((quote) => (
                        <div
                            key={quote._id}
                            className="rounded-2xl border border-gray-700 bg-[#0b1224]/70 p-6 text-center text-gray-400"
                        >
                            <p>{quote.dialog}</p>
                            <button
                                onClick={() => setSelectedQuote(quote)}
                                className="mt-4 rounded-2xl border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm font-passion text-sky-100 hover:bg-sky-400/20"
                            >
                                View Quote
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedQuote && (
                <div className="mt-8 rounded-2xl border border-gray-700 bg-[#0b1224]/70 p-6 text-center text-gray-400">
                    <p>{selectedQuote.dialog}</p>
                    <button
                        onClick={() => setSelectedQuote(null)}
                        className="mt-4 rounded-2xl border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm font-passion text-sky-100 hover:bg-sky-400/20"
                    >
                        Close
                    </button>
                </div>
            )}

        </section>
    );



}