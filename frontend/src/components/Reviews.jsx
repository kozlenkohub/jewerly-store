import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import axios from '../config/axiosInstance';

const ReviewForm = ({ onSubmit, onCancel, isLoading }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setComment('');
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit} className="border-b pb-6 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  className="hidden"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                />
                <FaStar
                  className="w-6 h-6 transition-colors"
                  color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your Review"
          required
          className="border p-2 min-h-[100px] futura"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-mainColor text-white px-4 py-2 w-fit futura hover:bg-mainColor/90 disabled:bg-gray-400">
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 futura">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

const Reviews = ({ reviews = [], productId, onReviewAdded }) => {
  const [localReviews, setLocalReviews] = useState(reviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const handleNewReview = async (reviewData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/product/review', {
        productId,
        ...reviewData,
      });

      const newReview = response.data.review;
      setLocalReviews([newReview, ...localReviews]);
      onReviewAdded(newReview); // Add this line
      setShowReviewForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index}>
        {index < rating ? (
          <FaStar className="text-yellow-500 w-4 h-4" />
        ) : (
          <FaRegStar className="text-yellow-500 w-4 h-4" />
        )}
      </span>
    ));
  };

  return (
    <div className="border p-6">
      {error && <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">{error}</div>}
      <div className="flex flex-col gap-6">
        {localReviews.length === 0 ? (
          <div className="text-center text-gray-500 py-8 futura">
            <p>No reviews yet.</p>
            <p className="mt-2">Be the first to review this product!</p>
          </div>
        ) : (
          localReviews.map((review, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="font-medium">{review.name}</span>
              </div>
              <p className="text-gray-600 futura">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        {!isAuthenticated ? (
          <div className="text-center">
            <p className="text-gray-600 mb-2 futura">Please sign in to write a review</p>
            <a
              href="/login"
              className="bg-mainColor text-white px-4 py-2 hover:bg-mainColor/90 inline-block">
              Sign In
            </a>
          </div>
        ) : !showReviewForm ? (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-mainColor text-white px-4 py-2 hover:bg-mainColor/90 w-full md:w-auto">
            Write a Review
          </button>
        ) : (
          <div className="border-t pt-6">
            <h3 className="font-medium text-lg mb-4">Write a Review</h3>
            <ReviewForm
              onSubmit={handleNewReview}
              onCancel={() => setShowReviewForm(false)}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
