'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Palette, Gift, MessageCircle } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    title: "Mini'Me Figurines",
    subtitle: "Personalized For You",
    description: "Custom-made mini figurines that look just like you. The perfect collectible!",
    cta: "Shop Now",
    href: "/shop?category=figurines",
    gradient: "from-purple-900 via-purple-800 to-indigo-900",
    accent: "bg-purple-500",
    image: "/Hero/mini'me.png",
  },
  {
    id: 2,
    title: "Couple Mini'Me",
    subtitle: "Valentine's Special",
    description: "Celebrate love with custom couple figurines. Perfect for anniversaries and special moments.",
    cta: "Shop Couples",
    href: "/shop?category=figurines",
    gradient: "from-pink-600 via-red-600 to-rose-700",
    accent: "bg-pink-500",
    image: "/Hero/mini'me.png",
  },
  {
    id: 3,
    title: "Custom Lamps",
    subtitle: "Light Up Your Space",
    description: "Personalized lamps with your custom design. Perfect for any room.",
    cta: "Shop Lamps",
    href: "/shop?category=lamps",
    gradient: "from-yellow-600 via-orange-500 to-amber-600",
    accent: "bg-yellow-500",
    image: "/Hero/lamp.png",
  },
  {
    id: 4,
    title: "Custom Keychains",
    subtitle: "Carry Your Memories",
    description: "Personalized keychains that go everywhere with you. Great gifts!",
    cta: "Shop Keychains",
    href: "/shop?category=accessories",
    gradient: "from-blue-900 via-blue-800 to-cyan-900",
    accent: "bg-blue-500",
    image: "/Hero/keychain.png",
  },
];

const featureItems = [
  { icon: Truck, title: 'Free Shipping', desc: 'Orders Rs. 2,000+' },
  { icon: Palette, title: 'Handcrafted', desc: 'Made with love' },
  { icon: Gift, title: 'Perfect Gift', desc: 'For loved ones' },
  { icon: MessageCircle, title: 'Support', desc: 'Always here' },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Main Hero Carousel */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].gradient}`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '40px 40px',
                }}
              />
            </div>

            {/* Content Container */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-white z-10"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`inline-block ${heroSlides[currentSlide].accent} text-white text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4`}
                  >
                    {heroSlides[currentSlide].subtitle}
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-4 tracking-tight"
                  >
                    {heroSlides[currentSlide].title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg sm:text-xl text-white/80 mb-8 max-w-md"
                  >
                    {heroSlides[currentSlide].description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      href={heroSlides[currentSlide].href}
                      className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 group shadow-lg hover:shadow-xl"
                    >
                      {heroSlides[currentSlide].cta}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Visual Element */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="hidden lg:flex items-center justify-center"
                >
                  <div className="relative">
                    {/* Floating Product Image */}
                    <motion.div
                      animate={{
                        y: [0, -15, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="filter drop-shadow-2xl"
                    >
                      <Image
                        src={heroSlides[currentSlide].image}
                        alt={heroSlides[currentSlide].title}
                        width={400}
                        height={400}
                        className="w-80 h-80 object-contain"
                        priority
                      />
                    </motion.div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-300 group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-300 group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 h-2 bg-white rounded-full'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/70 rounded-full'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feature Cards Below Hero */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {featureItems.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <feature.icon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                  <p className="text-gray-500 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
