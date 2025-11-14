import React from 'react';
import { Business, Review } from '../types';
import { BusinessCard } from '../components/BusinessCard';
import { StarRating } from '../components/StarRating';

// --- ReviewList Component ---
const ReviewList: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  if (reviews.length === 0) {
    return <p className="text-center text-slate-500 mt-8">Aún no hay reseñas. ¡Sé el primero en dejar una!</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex items-center mb-2">
            <StarRating rating={review.rating} />
            <p className="ml-3 font-bold text-slate-800">{review.userName}</p>
          </div>
          <p className="text-slate-600">{review.comment}</p>
           <p className="text-xs text-slate-400 mt-2">
              {new Date(review.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      ))}
    </div>
  );
};

// --- ReviewForm Component ---
const ReviewForm: React.FC<{
  businessId: number;
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
}> = ({ businessId, onAddReview }) => {
  const [userName, setUserName] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || rating === 0) {
      alert('Por favor, ingresa tu nombre y una calificación.');
      return;
    }
    setIsSubmitting(true);
    await onAddReview({
      businessId,
      userName,
      rating,
      comment,
    });
    // Reset form
    setUserName('');
    setRating(0);
    setComment('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 mt-8">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Deja tu Reseña</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-slate-700">Tu Nombre</label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-slate-50 text-slate-900"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Calificación</label>
          <StarRating rating={rating} onRatingChange={setRating} interactive className="h-7 w-7" />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-slate-700">Comentario (opcional)</label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-slate-50 text-slate-900"
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" disabled={isSubmitting || rating === 0} className="w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
        </button>
      </div>
    </form>
  );
};


// --- Main Page Component ---
interface BusinessDetailPageProps {
  business: Business;
  onBack: () => void;
  getCategoryName: (categoryId: number) => string;
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
}

export const BusinessDetailPage: React.FC<BusinessDetailPageProps> = ({ business, onBack, getCategoryName, onAddReview }) => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a la lista
      </button>

       <BusinessCard business={business} categoryName={getCategoryName(business.categoryId)} isDetailPage={true} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Reseñas y Calificaciones</h2>
        <ReviewList reviews={business.reviews} />
        <ReviewForm businessId={business.id} onAddReview={onAddReview} />
      </div>
    </div>
  );
};