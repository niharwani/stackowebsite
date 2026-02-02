'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Award, Package, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Happy Collectors', value: '50K+', icon: Users },
  { label: 'Products', value: '500+', icon: Package },
  { label: 'Years in Business', value: '8+', icon: Award },
  { label: 'Five Star Reviews', value: '10K+', icon: Star },
];

const values = [
  {
    title: 'Authenticity First',
    description: 'We only source from official manufacturers and authorized distributors. Every figure is 100% genuine.',
    icon: '✓',
  },
  {
    title: 'Collector Community',
    description: 'We\'re collectors too! We understand the passion and excitement of finding that perfect piece.',
    icon: '❤️',
  },
  {
    title: 'Premium Quality',
    description: 'From packaging to delivery, we ensure your collectibles arrive in pristine condition.',
    icon: '⭐',
  },
  {
    title: 'Expert Curation',
    description: 'Our team hand-picks the best figures from across all your favorite universes.',
    icon: '🎯',
  },
];

const team = [
  { name: 'Alex Chen', role: 'Founder & CEO', emoji: '👨‍💼' },
  { name: 'Sarah Kim', role: 'Head of Curation', emoji: '👩‍🎨' },
  { name: 'Marcus Johnson', role: 'Operations Lead', emoji: '👨‍💻' },
  { name: 'Emily Rodriguez', role: 'Customer Success', emoji: '👩‍💼' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
              Our Story
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              From passionate collectors to industry leaders, we've built Stacko to bring joy to fellow enthusiasts around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-6">
                Built by Collectors, For Collectors
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  It all started in 2016 when our founder, Alex, couldn't find a reliable source for authentic collectible figures. Frustrated by counterfeits and poor customer service, he decided to create the store he wished existed.
                </p>
                <p>
                  What began as a small operation in a garage has grown into one of the most trusted names in collectibles. But our mission remains the same: to deliver authentic, high-quality figures to passionate collectors everywhere.
                </p>
                <p>
                  Today, Stacko serves over 50,000 collectors across the globe. We've built relationships with official manufacturers and created a community where enthusiasts can share their passion.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gray-100 rounded-2xl border border-gray-200 p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {['🦸', '🎮', '🎬', '🎌'].map((emoji, i) => (
                    <motion.div
                      key={i}
                      className="w-28 h-28 lg:w-32 lg:h-32 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center text-5xl lg:text-6xl"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at Stacko.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Meet the Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Stacko who make the magic happen.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
                  {member.emoji}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-funko-purple text-sm font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="w-12 h-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Ready to Start Your Collection?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg">
              Join thousands of happy collectors and discover your next favorite figure today.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg group"
            >
              Browse Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
