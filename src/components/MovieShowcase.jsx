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
        <section className="rounded-3xl border border-[#161728] p-6 backdrop-blur">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-passion uppercase tracking-[0.4em]">
                        Films
                    </p>
                    <h2 className="text-2xl font-passion">
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
                            className="w-full rounded-2xl border border-[#20233e] px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition"
                        />
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-gray-500">
                            Search
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="rounded-2xl border border-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:bg-red-600 hover:text-white"
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
                <div className="mt-8 flex items-center justify-center rounded-2xl border border-dashed p-8 text-sky-100">
                    Pulling reels from the vaults of Minas Tirith...
                </div>
            )}

            {!loading && error && !movies.length && (
                <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                </div>
            )}

            {!loading && filteredMovies.length === 0 && (
                <div className="mt-8 rounded-2xl border border-gray-700 p-6 text-center text-gray-400">
                    No movies match your query. Try a different title.
                </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                {filteredMovies.map((movie) => (
                    <button
                        type="button"
                        key={movie._id}
                        className="group flex flex-col rounded-3xl border border-red-600 p-6 text-left transition hover:-translate-y-1 hover:border-red-600/40"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-garamondBold">
                                {movie.name}
                            </h3>
                            <span className="rounded-full border-2 border-red-600 px-3 py-1 text-md font-passion uppercase tracking-[0.2em] text-red-600">
                                {movie.runtimeInMinutes} min
                            </span>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-gray-400">
                            <div>
                                <p className="text-xl font-passion">Budget</p>
                                <p className="text-xl font-garamondBold">
                                    ${movie.budgetInMillions}M
                                </p>
                            </div>
                            <div>
                                <p className="text-xl font-passion">Box Office</p>
                                <p className="text-xl font-garamondBold">
                                    ${movie.boxOfficeRevenueInMillions}M
                                </p>
                            </div>
                            <div>
                                <p className="text-xl font-passion">Awards</p>
                                <p className="text-xl font-garamondBold">
                                    {movie.academyAwardWins} wins ·{' '}
                                    {movie.academyAwardNominations} noms
                                </p>
                            </div>
                            <div>
                                <p className="text-xl font-passion">Rotten Tomatoes</p>
                                <p className="text-xl font-garamondBold">
                                    {movie.rottenTomatoesScore}%
                                </p>
                            </div>
                        </div>

                    </button>
                ))}
            </div>

        </section>
    );
}