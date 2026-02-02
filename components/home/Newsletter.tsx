'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">
            Join the Collectors Club
          </h2>

          {/* Description */}
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Be the first to know about new releases, exclusive drops, and special discounts. Plus, get 10% off your first order!
          </p>

          {/* Form */}
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 bg-green-500/20 text-green-400 px-6 py-4 rounded-xl border border-green-500/30"
            >
              <CheckCircle className="w-6 h-6" />
              <span className="font-medium">Welcome to the club! Check your inbox for your discount code.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-white/40 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {['Exclusive Drops', 'Early Access', '10% First Order'].map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 text-white/60"
              >
                <div className="w-2 h-2 bg-funko-purple rounded-full" />
                <span className="text-sm font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
