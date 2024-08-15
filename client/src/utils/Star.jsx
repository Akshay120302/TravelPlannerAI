import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function Star() {
  const [rating, setRating] = useState(null);
  const [rateColor, setRateColor] = useState(null);

  return (
    <div style={{display:'flex' , justifyContent: 'center' , alignItems: 'center' , gap: '5px'}}>
      {[...Array(5)].map((star, index) => {
        const currentRate = index + 1;
        return (
          <label key={index} style={{cursor:"pointer"}}>
            <input
              type="radio"
              name="rate"
              value={currentRate}
              onClick={() => setRating(currentRate)}
              style={{ display: 'none' }}
              required
            />
            <FaStar
              color={currentRate <= (rateColor || rating) ? 'yellow' : 'grey'}
              size={24}
            />
          </label>
        );
      })}
    </div>
  );
}
