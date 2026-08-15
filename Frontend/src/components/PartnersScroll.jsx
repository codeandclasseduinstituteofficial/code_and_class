import React from 'react';

// Import your images from assets
import nsdc from '../assets/national-skill.webp';
import skillIndia from '../assets/skill-india.webp';
import msme from '../assets/msme.webp';
import dduGky from '../assets/ddu.webp';
import iso from '../assets/iso.webp';

const partners = [
  { src: nsdc, alt: 'national skill_development_corporation' },
  { src: skillIndia, alt: 'skill_india' },
  { src: msme, alt: 'skill_msme' },
  { src: dduGky, alt: 'ddu-gky' },
  { src: iso, alt: 'iso' },
];

const PartnersScroll = () => {
  return (
    <div className="container-fluid mx-auto lg:mt-0">
      <div className="main_container overflow-hidden w-full pause-on-hover pb-3">
        <div className="animate-scroll-left flex lg:w-[3000px] xl:w-[2000px] w-[4000px] gap-4">
          {/* Render the list TWICE so the loop is seamless */}
          {[...partners, ...partners].map((partner, idx) => (
            <div key={`${partner.alt}-${idx}`} className="flex gap-x-5 shrink-0">
              <img
                src={partner.src}
                alt={partner.alt}
                width={200}
                height={150}
                loading="lazy"
                className="object-contain hover:shadow-lg hover:border hover:rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersScroll;