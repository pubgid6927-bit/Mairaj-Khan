import React, { useState } from 'react';
import { CustomerReview } from '../types';
import { INITIAL_REVIEWS } from '../data/reviews';
import { useCart } from '../context/CartContext';
import { Star, CheckCircle, MessageSquarePlus, X, MapPin } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useCart();

  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newWatch, setNewWatch] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) {
      addToast('Please fill out your name and review message.', 'info');
      return;
    }

    const review: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      city: newCity.trim() || 'Karachi, Pakistan',
      watchPurchased: newWatch.trim() || 'Casio Watch',
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      verifiedPurchase: true
    };

    setReviews([review, ...reviews]);
    addToast('Thank you for submitting your verified review!');
    setIsModalOpen(false);

    setNewAuthor('');
    setNewCity('');
    setNewWatch('');
    setNewComment('');
  };

  return (
    <section id="reviews-section" className="py-16 sm:py-24 bg-white border-t border-neutral-200 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Verified Patron Experiences</span>
            </div>
            <h2
              className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight font-serif"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Verified Customer Reviews
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Read authentic feedback from Casio collectors and watch enthusiasts across Karachi, Lahore, Islamabad, and nationwide Pakistan.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-neutral-950 hover:bg-neutral-800 text-white font-bold tracking-wider uppercase text-xs rounded transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-300" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-[#fbfbfa] border border-neutral-200/90 rounded-lg space-y-4 hover:border-neutral-900 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'}`}
                      />
                    ))}
                  </div>

                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Watch Info */}
              <div className="pt-4 border-t border-neutral-200/80 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-neutral-950">{rev.author}</p>
                  <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-700" />
                    <span>{rev.city}</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    {rev.watchPurchased}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-1">{rev.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white border border-neutral-300 rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-4 font-sans animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-bold text-neutral-950 text-sm uppercase tracking-wider font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
                Submit Your Verified Review
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. DHA Karachi"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Watch Model Purchased</label>
                  <input
                    type="text"
                    placeholder="e.g. GA-2100 CasiOak"
                    value={newWatch}
                    onChange={(e) => setNewWatch(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs text-neutral-500 font-mono ml-2">({newRating} out of 5 stars)</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Your Review & Experience *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about watch authenticity, packaging, delivery speed, or store experience..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded hover:bg-neutral-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white font-bold tracking-wider uppercase rounded transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
