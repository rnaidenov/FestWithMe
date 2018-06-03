import React from 'react';
import Carousel from 'nuka-carousel';

function CustomCarousel({ content, onClick, decorators, slidesToShow, slideWidth, className }) {
  const carouselContent = content.map((c,idx) => (
    <div key={idx} onClick={(e) => onClick(e, c.ref)} className='resultsContainer'>
      {c.element}
    </div>
    ));

  // Left and right arrows for the carousel element
  const _decorators = [{
    component: ({ previousSlide }) => (
      <i className="material-icons prevArrow" onClick={previousSlide}>&#xE314;</i>
          ),
    position: 'CenterLeft',
  },
  {
    component: ({ nextSlide }) => (
      <i className="material-icons nextArrow" onClick={nextSlide}>&#xE315;</i>
          ),
    position: 'CenterRight',
  },
  ];

  return (
    <Carousel
      decorators={decorators || _decorators}
      slidesToShow={slidesToShow}
      slideWidth={slideWidth}
      className={className}
      wrapAround={true}
      fixedHeight={false}
    >
      {carouselContent}
    </Carousel>
  );
}

export default CustomCarousel;
