import React, { useContext, useEffect, useState } from 'react';
import NotesCard from '../components/NotesCard';
import { FaSearch, FaGift } from 'react-icons/fa';
import { AuthContext } from '../context/AuthProvider';
import instance from '../utils/axios';

const NotesCardSkeleton = () => (
  <div className="card-surface overflow-hidden animate-pulse">
    <div className="w-full h-40 bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-8 bg-slate-200 rounded w-full" />
    </div>
  </div>
);

const Notes = () => {
  const { accessToken } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const fetchNotes = async () => {
    try {
      const { data } = await instance.get('/notes', {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      setNotes(data?.notes || data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes?.filter((n) =>
    n?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-10 lg:px-20 relative top-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
          <FaGift /> Free & Premium Notes
        </span>
        <h1 className="section-heading mb-4">Notes Library</h1>
        <p className="section-subheading">
          Download free study notes instantly, or unlock premium notes with a one-time payment.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-12 relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <NotesCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredNotes?.length === 0 ? (
        <p className="text-center text-slate-400 py-16">
          {search ? `No notes found for "${search}"` : 'No notes available yet. Check back soon!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredNotes.map((note, index) => (
            <NotesCard
              key={note?._id || index}
              id={note?._id}
              image={note?.image}
              title={note?.title}
              driveLink={note?.driveLink}
              isPaid={note?.isPaid}
              price={note?.price}
              unlocked={note?.unlocked}
              onUnlocked={fetchNotes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
