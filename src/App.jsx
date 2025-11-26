import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import MovieShowcase from './components/MovieShowcase';
import CharacterShowcase from './components/CharacterShowcase';
import BooksShowcase from './components/BooksShowcase';
import QuoteShowcase from './components/QuoteShowcase';

const envApiKey = import.meta.env.VITE_ONE_API_KEY;

function App() {

  const [apiKey] = useState(envApiKey);

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#030307] via-[#0b1020] to-[#030307] text-gray-100">

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:px-6">

        <header className="rounded-3xl border border-[#1f1a2e] bg-[#0a0f1b]/80 p-8 shadow-[0_0_45px_rgba(93,183,255,0.15)] backdrop-blur">
          <p className="text-xl uppercase font-passion tracking-[0.4em] text-sky-400">
            The One API
          </p>
          <h1 className="mt-4 text-3xl font-passion text-slate-50 md:text-4xl">
            Middle-earth Media Compendium
          </h1>
          <p className="mt-3 max-w-3xl font-garamondBold text-lg text-gray-300">
            Explore production stats for every film and uncover the heroes, hobbits, and
            wizards that shape Tolkien&apos;s legendarium. Both sections are powered live
            by The One API. One API to rule them all!
          </p>

          <nav className="mt-6 flex gap-4">
            <Link to="/" className="text-sky-400 hover:text-sky-300 hover:underline">Movies</Link>
            <Link to="/characters" className="text-sky-400 hover:text-sky-300 hover:underline">Characters</Link>
            <Link to="/books" className="text-sky-400 hover:text-sky-300 hover:underline">Books</Link>
            <Link to="/quotes" className="text-sky-400 hover:text-sky-300 hover:underline">Quotes</Link>
          </nav>
          <p className="mt-4 text-sm text-gray-400">
            Powered by The One API
          </p>
        </header>

        <Routes>
          <Route path="/" element={<MovieShowcase apiKey={apiKey} />} />
          <Route path="/characters" element={<CharacterShowcase apiKey={apiKey} />} />
          <Route path="/books" element={<BooksShowcase />} />
          <Route path="/quotes" element={<QuoteShowcase apiKey={apiKey} />} />
        </Routes>

      </div>

    </div>

  );

}

export default App;