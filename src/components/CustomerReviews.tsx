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
    <section id="reviews-section" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Customer Satisfaction & Social Proof</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Verified Customer Reviews
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Real feedback from watch buyers who purchased authentic Casio watches from New Madina Electronics in Karachi, Lahore, Islamabad, and all Pakistan.
            </p>
          </div>

          {/* Aggregate Rating Pill & Add Review CTA */}
          <div className="flex items-center gap-4">
            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3 shadow-xs">
              <div className="text-2xl font-mono font-extrabold text-slate-900">4.9</div>
              <div className="text-xs">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-slate-500 text-[11px]">Based on 480+ Reviews</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid - Clean White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="space-y-2.5">
                {/* Header: Stars & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  {rev.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Verified Buyer
                    </span>
                  )}
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Watch Info */}
              <div className="pt-3 border-t border-slate-100 space-y-1">
                <div className="font-bold text-xs text-slate-900">{rev.author}</div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{rev.city}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">{rev.date}</span>
                </div>
                <div className="font-mono text-[10px] text-amber-800 font-semibold truncate pt-0.5">
                  Bought: {rev.watchPurchased}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Write a Review Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />

            <div className="relative bg-white border border-slate-200 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl z-10 p-6 space-y-4 text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-base text-slate-900">Share Your Review</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asad Mehmood"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Karachi (Gulshan) or Lahore"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Casio Watch Model Bought</label>
                  <input
                    type="text"
                    placeholder="e.g. Casio MTP-1302D or G-Shock GA-2100"
                    value={newWatch}
                    onChange={(e) => setNewWatch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Rating (Stars)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewRating(s)}
                        className={`p-1.5 rounded cursor-pointer ${s <= newRating ? 'text-amber-500' : 'text-slate-300'}`}
                      >
                        <Star className={`w-5 h-5 ${s <= newRating ? 'fill-amber-400' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Your Review / Experience</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about the watch authenticity, delivery time, packaging, or customer service..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
