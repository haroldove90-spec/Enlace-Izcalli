import React from 'react';
import { StarIcon } from './Icons';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  className = 'h-5 w-5',
  onRatingChange,
  interactive = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const starRating = interactive ? hoverRating || rating : rating;

        return (
          <StarIcon
            key={index}
            className={`${className} transition-colors duration-150 ${
              starRating >= starValue ? 'text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && onRatingChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        );
      })}
    </div>
  );
};
