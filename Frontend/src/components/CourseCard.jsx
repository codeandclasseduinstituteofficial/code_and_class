import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaClock } from 'react-icons/fa';

const CourseCard = ({ title, description, link, imageUrl, isPopular, price, discount, duration }) => {
  const rawPrice = Number(String(price).replace(/[^\d.]/g, '')) || 0;
  const rawDiscountPct = Number(String(discount).replace(/[^\d.]/g, '')) || 0;
  const originalPrice = rawDiscountPct > 0 ? Math.round(rawPrice + (rawPrice * rawDiscountPct) / 100) : rawPrice;

  return (
    <Link to={`${link}`} className="block h-full group">
      <div className="relative card-surface h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-brand-300">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-44 object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {isPopular && (
            <span className="absolute top-3 right-3 text-xs font-bold bg-accent-500 text-white px-2.5 py-1 rounded-full shadow-md">
              🔥 Popular
            </span>
          )}

          {rawDiscountPct > 0 && (
            <span className="absolute top-3 left-3 text-xs font-bold bg-green-600 text-white px-2.5 py-1 rounded-full shadow-md">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-5 py-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 flex-1">{description}</p>

          {duration && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
              <FaClock className="text-brand-400" />
              {duration}
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
            <div>
              {price ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-brand-600 font-extrabold text-xl">₹{price}</span>
                  {rawDiscountPct > 0 && (
                    <span className="text-sm text-slate-400 line-through">₹{originalPrice}</span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-slate-400">Contact for pricing</span>
              )}
            </div>

            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 shrink-0">
              View
              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;