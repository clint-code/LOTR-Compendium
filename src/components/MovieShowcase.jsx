import { useEffect, useMemo, useState } from "react";

const API_BASE = 'https://the-one-api.dev/v2';

export default function MovieShowcase({ apiKey }) {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        if (!apiKey) {
            setError(
                'Missing API key. Add VITE_ONE_API_KEY (or VITE_API_KEY) to your .env.local file and restart the dev server.',
            );
            return;
        }

        const controller = new AbortController();

        const fetchMovies = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${API_BASE}/movie`, {
                    headers: { Authorization: `Bearer ${apiKey}` },
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch movies. Please verify your API key.');
                }
                const data = await response.json();
                console.log("Movies data:", data);

                setMovies(Array.isArray(data.docs) ? data.docs : []);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Something went wrong while fetching movies.');
                    setMovies([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!selectedMovie) return;
        const handler = (event) => {
            if (event.key === 'Escape') setSelectedMovie(null);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [selectedMovie]);

    console.log("Selected movie: ", selectedMovie);

    const filteredMovies = useMemo(() => {
        return movies
            .filter((movie) =>
                movie.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [movies, searchTerm]);


    return (
        <section className="rounded-3xl border border-[#161728] bg-[#070913]/80 p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] backdrop-blur">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-passion uppercase tracking-[0.4em] text-sky-400">
                        Films
                    </p>
                    <h2 className="text-2xl font-passion text-slate-50">
                        Middle-earth Film Archive
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
                            placeholder="Search movie title..."
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
                    Pulling reels from the vaults of Minas Tirith...
                </div>
            )}

            {!loading && error && !movies.length && (
                <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                </div>
            )}

            {!loading && filteredMovies.length === 0 && (
                <div className="mt-8 rounded-2xl border border-gray-700 bg-[#0b1224]/70 p-6 text-center text-gray-400">
                    No movies match your query. Try a different title.
                </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                {filteredMovies.map((movie) => (
                    <button
                        type="button"
                        key={movie._id}
                        onClick={() => setSelectedMovie(movie)}
                        className="group flex flex-col rounded-3xl border border-[#1a1f32] bg-gradient-to-b from-[#152238] via-[#0d1324] to-[#090f1c] p-6 text-left shadow-[0_15px_30px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:border-sky-400/40"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-garamondBold text-slate-50">
                                {movie.name}
                            </h3>
                            <span className="rounded-full border-2 border-white px-3 py-1 text-md font-passion uppercase tracking-[0.2em] text-white">
                                {movie.runtimeInMinutes} min
                            </span>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-gray-400">
                            <div>
                                <p className="text-white text-xl font-passion">Budget</p>
                                <p className="text-xl text-gray-100 font-garamondBold">
                                    ${movie.budgetInMillions}M
                                </p>
                            </div>
                            <div>
                                <p className="text-white text-xl font-passion">Box Office</p>
                                <p className="text-xl text-gray-100 font-garamondBold">
                                    ${movie.boxOfficeRevenueInMillions}M
                                </p>
                            </div>
                            <div>
                                <p className="text-white text-xl font-passion">Awards</p>
                                <p className="text-xl text-gray-100 font-garamondBold">
                                    {movie.academyAwardWins} wins ·{' '}
                                    {movie.academyAwardNominations} noms
                                </p>
                            </div>
                            <div>
                                <p className="text-white text-xl font-passion">Rotten Tomatoes</p>
                                <p className="text-xl text-gray-100 font-garamondBold">
                                    {movie.rottenTomatoesScore}%
                                </p>
                            </div>
                        </div>
                        <p className="mt-5 text-sm text-gray-400 font-garamondItalic">
                            Click for full production stats
                        </p>
                    </button>
                ))}
            </div>

        </section>
    );
}