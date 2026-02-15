
"use client"

import { useState, useEffect } from 'react';
import { useFirestore, useStorage } from '@/firebase';
import { 
  collection, 
  onSnapshot, 
  updateDoc, 
  doc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp, 
  setDoc 
} from 'firebase/firestore';
import { uploadMenuImage } from '@/lib/upload-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Trash2, 
  Camera, 
  Loader2, 
  Plus, 
  X, 
  RefreshCw,
  Tv,
  Film
} from 'lucide-react';
import Image from 'next/image';

interface Movie {
  id: string;
  title: string;
  url: string;
  hint: string;
  type: 'movie' | 'ad';
}

export default function MovieManager() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const firestore = useFirestore();
  const storage = useStorage();

  useEffect(() => {
    if (!firestore) return;

    const unsub = onSnapshot(collection(firestore, "movies"), (snapshot) => {
      setMovies(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Movie)));
    });

    return () => unsub();
  }, [firestore]);

  const handleAddMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !storage) return;
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadMenuImage(storage, file, "posters") || "";
      }
      await addDoc(collection(firestore, "movies"), {
        title: formData.get("title"),
        hint: formData.get("hint") || "movie poster",
        type: formData.get("type") || "movie",
        url: imageUrl,
        timestamp: serverTimestamp()
      });
      setFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error("Error adding movie:", err);
    } finally { setIsUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("Delete this poster permanently?")) return;
    await deleteDoc(doc(firestore, "movies", id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ADD MOVIE FORM */}
      <section className="bg-[#121212] border-2 border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-xl font-black uppercase italic mb-6 flex items-center gap-3 text-primary">
          <Film className="w-6 h-6" /> Deploy New Theater Content
        </h2>
        <form onSubmit={handleAddMovie} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Title</label>
            <Input name="title" placeholder="e.g. Gladiator II" required className="bg-zinc-900 border-zinc-800 text-white rounded-xl" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Visual Keyword</label>
            <Input name="hint" placeholder="e.g. cinema luxury" className="bg-zinc-900 border-zinc-800 text-white rounded-xl" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Format</label>
            <select name="type" className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-sm outline-none">
              <option value="movie">Upcoming Movie</option>
              <option value="ad">Theater Ad Banner</option>
            </select>
          </div>
          
          <div className="relative">
            <label className="flex items-center justify-center w-full h-10 border-2 border-dashed border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-900 transition-all text-zinc-500 hover:text-primary">
              <Camera className="w-4 h-4 mr-2" />
              <span className="text-[10px] font-black uppercase">{file ? "Ready" : "Upload Image"}</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <Button disabled={isUploading} className="bg-primary text-black hover:bg-white font-black uppercase italic h-10 rounded-xl">
            {isUploading ? <Loader2 className="animate-spin" /> : "Deploy to Screens"}
          </Button>
        </form>
      </section>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden transition-all hover:border-primary/50 shadow-xl">
             <div className="relative aspect-[2/3] w-full bg-zinc-800">
               {movie.url ? (
                 <Image src={movie.url} alt={movie.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
               ) : (
                 <div className="h-full flex items-center justify-center text-zinc-700">
                   <Film size={48} />
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
               <div className="absolute bottom-4 left-4 right-4">
                 <span className="bg-primary/20 text-primary text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-primary/20 mb-1 inline-block">
                   {movie.type}
                 </span>
                 <p className="font-black italic uppercase text-white leading-none tracking-tighter text-sm truncate">
                   {movie.title}
                 </p>
               </div>

               <button 
                onClick={() => handleDelete(movie.id)}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-xl"
               >
                 <Trash2 size={16} />
               </button>
             </div>
          </div>
        ))}

        {movies.length === 0 && (
          <div className="col-span-full h-64 flex flex-col items-center justify-center bg-zinc-900/40 border-4 border-dashed border-zinc-800 rounded-[3rem] text-zinc-700">
             <Tv size={48} className="mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">No Live Ad Content</p>
          </div>
        )}
      </div>
    </div>
  );
}
