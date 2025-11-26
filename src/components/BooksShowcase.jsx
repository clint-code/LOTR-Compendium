import { useEffect, useMemo, useState } from "react";

const API_BASE = 'https://the-one-api.dev/v2';

export default function BooksShowcase() {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

        const controller = new AbortController();

        const fetchBooks = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${API_BASE}/book`, {
                    headers: { Authorization: `Bearer}` },
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch books.');
                }
                const data = await response.json();
                console.log("Books data:", data);

                setBooks(Array.isArray(data.docs) ? data.docs : []);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Something went wrong.');
                    setBooks([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
        return () => controller.abort();
    }, []);

    const filteredBooks = useMemo(() => {
        return books
            .filter((book) =>
                book.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [books, searchTerm]);

    return (
        <section className="rounded-3xl border border-[#161728] bg-[#070913]/80 p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-passion uppercase tracking-[0.4em] text-sky-400">
                        Books
                    </p>
                    <h2 className="text-2xl font-passion text-slate-50">
                        Middle-earth Literature
                    </h2>
                </div>
                <form
                    className="flex w-full max-w-md flex-col gap-3 md:flex-row md:items-center"
                    onSubmit={(event) => {
                        event.preventDefault();
                        setSearchTerm(searchInput.trim());
                    }}
                >
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search book name..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full rounded-2xl border border-[#20233e] bg-[#0e1427]/80 px-4 py-3 text-gray-100 placeholder-gray-500 outline-none transition focus:border-sky-400"
                        />
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-gray-500">
                            Search
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="rounded-2xl border border-sky-400/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sky-200 transition hover:bg-sky-400 hover:text-[#04101c]"
                        >
                            Apply
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchInput('');
                                setSearchTerm('');
                            }}
                            className="rounded-2xl border border-gray-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-300 transition hover:bg-gray-700 hover:text-white"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {loading && (
                <div className="mt-8 flex items-center justify-center rounded-2xl border border-dashed border-sky-400/40 bg-[#0b1224]/70 p-8 text-sky-100">
                    Summoning the inhabitants of Middle-earth...
                </div>
            )}

            {!loading && error && !books.length && (
                <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                </div>
            )}

            {!loading && filteredBooks.length === 0 && (
                <div className="mt-8 rounded-2xl border border-gray-700 bg-[#0b1224]/70 p-6 text-center text-gray-400">
                    No books match your query.
                </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredBooks.map((book) => (
                    <div
                        key={book._id}
                        className="flex flex-col rounded-3xl border border-[#1a1f32] bg-gradient-to-b from-[#152238] via-[#0d1324] to-[#090f1c] p-6 text-left shadow-[0_15px_30px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:border-sky-400/40"
                    >
                        <h3 className="text-2xl font-garamondRegular text-slate-50 mb-4">
                            {book.name}
                        </h3>

                        <p className="text-sm text-gray-400">
                            {book.summary}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );

}