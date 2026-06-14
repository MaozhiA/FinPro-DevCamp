import { useState } from 'react';
import './carousel.css';

const Carousel = () => {
    const items = [
        <div className="carousel-content">Item 1</div>,
        <div className="carousel-content">Item 2</div>,
        <div className="carousel-content">Item 3</div>,
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const previous = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);

    return (
        <div className="carousel-wrapper">
            <div
                className="carousel-tracker"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div key={index} className="carousel-item">
                        {item}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
                <button onClick={previous} className="carousel-button prev">Previous</button>
                <button onClick={next} className="carousel-button next">Next</button>
            </div>
        </div>
    );
};

export default Carousel;