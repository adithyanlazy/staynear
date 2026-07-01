import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, animate } from 'framer-motion';
import {
  Search, MapPin, Star, Users, Building, Shield,
  ArrowRight, ChevronRight, GraduationCap, CheckCircle2, TrendingUp,
} from 'lucide-react';
import { heroContainer, heroItem, staggerContainer, staggerItem, fadeUp, viewportOnce } from '../utils/motion';
import { usePageMeta } from '../hooks/usePageMeta';
import SearchBar from '../components/SearchBar';
import PGCard from '../components/PGCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import api from '../utils/api';

const StatItem = ({ icon: Icon, value, label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const hasSuffix = typeof value === 'string' && value.includes('+');
  const isDecimal = !isNaN(numValue) && !Number.isInteger(numValue);

  useEffect(() => {
    if (!inView || isNaN(numValue)) return;
    const controls = animate(0, numValue, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(isDecimal ? v.toFixed(1) : Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, numValue, isDecimal]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center">
      <div className="w-12 h-12 mb-3 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary-500" />
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
        {isNaN(numValue) ? '—' : <>{display}{hasSuffix ? '+' : ''}</>}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</div>
    </div>
  );
};

const Home = () => {
  usePageMeta(
    'StayNear — Find PG Accommodations in Mangalore',
    'Find verified PG accommodations near your college in Mangalore. Search by college, area, budget and amenities — with real student reviews.'
  );
  const [featuredPGs, setFeaturedPGs] = useState([]);
  const [stats, setStats] = useState(null);
  const [popularAreas, setPopularAreas] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pgsRes, statsRes, areasRes, testimonialsRes] = await Promise.all([
          api.get('/pgs/featured'),
          api.get('/pgs/stats'),
          api.get('/pgs/popular-areas'),
          api.get('/testimonials'),
        ]);
        setFeaturedPGs(pgsRes.data.data);
        setStats(statsRes.data.data);
        setPopularAreas(areasRes.data.data);
        setTestimonials(testimonialsRes.data.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const colleges = [
    'NITK Surathkal', 'St Aloysius College', 'Yenepoya University',
    'Srinivas University', 'Canara Engineering College', 'AJ Institute',
  ];

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden hero-mesh">
        {/* Decorative blobs */}
        <div className="absolute top-1/3 left-0 w-[480px] h-[480px] bg-primary-700/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[380px] h-[380px] bg-gold-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Floating trust badges — large screens only */}
        <div className="absolute top-[30%] right-[5%] hidden xl:flex flex-col gap-3 pointer-events-none z-10">
          <div className="glass-dark rounded-2xl px-4 py-3 flex items-center gap-3 animate-float shadow-lg">
            <div className="w-9 h-9 bg-gold-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-white fill-current" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">4.8 ★ Rating</div>
              <div className="text-white/50 text-xs">500+ student reviews</div>
            </div>
          </div>
          <div className="glass-dark rounded-2xl px-4 py-3 flex items-center gap-3 animate-float-slow shadow-lg">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Verified PGs</div>
              <div className="text-white/50 text-xs">Quality assured</div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={heroContainer}
            initial="initial"
            animate="animate"
          >

            {/* Status pill */}
            <motion.div variants={heroItem} className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/70 text-sm font-medium">Mangalore's #1 PG Finder</span>
            </motion.div>

            {/* Logo mark */}
            <motion.img
              variants={heroItem}
              src="/staynear-logo.png"
              alt="StayNear"
              className="w-16 h-16 mx-auto mb-6 logo-dark drop-shadow-xl"
            />

            {/* Headline */}
            <motion.h1
              variants={heroItem}
              className="font-display font-bold text-white leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.6rem, 7.5vw, 5.5rem)' }}
            >
              Find Your Perfect
              <span
                className="block italic"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fcd34d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                PG in Mangalore
              </span>
            </motion.h1>

            <motion.p variants={heroItem} className="text-base md:text-lg text-white/50 mb-10 max-w-lg mx-auto leading-relaxed">
              Discover comfortable, affordable, and secure accommodations near your college.
            </motion.p>

            {/* Search */}
            <motion.div variants={heroItem} className="relative z-10 mb-6">
              <SearchBar />
            </motion.div>

            {/* Browse CTA */}
            <motion.div variants={heroItem}>
              <Link
                to="/pgs"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-glow-primary mb-10"
              >
                Browse All PGs
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* College quick links */}
            <motion.div variants={heroItem} className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <span className="text-white/25 text-sm">Near:</span>
              {colleges.slice(0, 4).map(college => (
                <Link
                  key={college}
                  to={`/pgs?collegeNearby=${college}`}
                  className="text-sm text-white/40 hover:text-gold-400 transition-colors"
                >
                  {college}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white dark:from-surface-section to-transparent pointer-events-none" />
      </section>

      {/* ── STATS ── */}
      <motion.section
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={viewportOnce}
        className="py-16 bg-white dark:bg-surface-section border-b border-gray-100 dark:border-white/[0.05]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatItem icon={Building} value={stats?.totalPGs} label="Total PGs" />
            <StatItem icon={MapPin} value={stats?.totalAreas} label="Areas Covered" />
            <StatItem icon={Users} value={stats?.happyStudents} label="Happy Students" />
            <StatItem icon={Star} value={stats?.avgRating} label="Avg Rating" />
          </div>
        </div>
      </motion.section>

      {/* ── FEATURED PGS ── */}
      {(loading || featuredPGs.length > 0) && (
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-surface-raised">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4"
          >
            <div>
              <p className="section-label mb-2">Hand-picked for you</p>
              <h2 className="section-title">Featured PGs</h2>
            </div>
            <Link
              to="/pgs"
              className="inline-flex items-center gap-1.5 text-primary-500 dark:text-primary-400 font-semibold text-sm hover:gap-2.5 transition-all self-start md:self-auto"
            >
              View all listings <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={viewportOnce}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredPGs.map(pg => (
                <motion.div key={pg._id} variants={staggerItem}>
                  <PGCard pg={pg} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      )}

      {/* ── POPULAR AREAS ── */}
      {popularAreas.length > 0 && (
      <motion.section
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={viewportOnce}
        className="py-20 md:py-28 bg-white dark:bg-surface-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Explore by location</p>
            <h2 className="section-title">Popular Areas in Mangalore</h2>
            <p className="section-subtitle max-w-lg mx-auto">
              Find the perfect neighbourhood that suits your lifestyle and college proximity
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularAreas.map((area, index) => (
              <Link
                key={index}
                to={`/pgs?area=${area.name}`}
                className="group relative aspect-square rounded-2xl overflow-hidden"
              >
                <img
                  src={area.image}
                  alt={area.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/20 transition-colors duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="text-white font-semibold text-sm md:text-base leading-tight">
                    {area.name}
                  </h3>
                  <p className="text-white/40 text-xs mt-0.5 group-hover:text-white/70 transition-colors">
                    Explore →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>
      )}

      {/* ── WHY STAYNEAR ── */}
      <motion.section
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={viewportOnce}
        className="py-20 md:py-28 bg-gray-50 dark:bg-surface-raised"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Built for students</p>
            <h2 className="section-title">Why StayNear?</h2>
            <p className="section-subtitle max-w-lg mx-auto">
              Everything you need to find and secure your ideal accommodation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: 'Smart Search',
                description:
                  'Powerful filters for budget, amenities, distance to college, and sharing type — find your match in seconds.',
                iconBg: 'bg-primary-50 dark:bg-primary-950/40',
                iconColor: 'text-primary-500',
              },
              {
                icon: Shield,
                title: 'Verified Listings',
                description:
                  'Every PG is verified for safety and quality. Real photos, genuine student reviews, no surprises.',
                iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
                iconColor: 'text-emerald-500',
              },
              {
                icon: GraduationCap,
                title: 'College-First',
                description:
                  'Search by college, see distance, find what your peers recommend. Made specifically for Mangalore students.',
                iconBg: 'bg-amber-50 dark:bg-amber-950/40',
                iconColor: 'text-gold-600 dark:text-gold-400',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card p-8 group hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-14 h-14 mb-6 rounded-2xl ${feature.iconBg} flex items-center justify-center`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
      <motion.section
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={viewportOnce}
        className="py-20 md:py-28 bg-white dark:bg-surface-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Student voices</p>
            <h2 className="section-title">What Students Say</h2>
            <p className="section-subtitle">Trusted by thousands across Mangalore</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6 flex flex-col">
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-gold-400 fill-current'
                          : 'text-gray-200 dark:text-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-1">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-white/10"
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-400">{testimonial.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
      )}

      {/* ── CTA ── */}
      <motion.section
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={viewportOnce}
        className="py-20 bg-gray-50 dark:bg-surface-raised"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden px-6 py-16 md:py-20"
            style={{
              background: 'linear-gradient(135deg, #042f2e 0%, #0f766e 45%, #0d9488 100%)',
            }}
          >
            {/* Decorative orbs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse 60% 70% at 85% 50%, rgba(245,158,11,0.12) 0%, transparent 60%)',
              }}
            />

            <div className="relative text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 mb-6">
                <TrendingUp className="w-4 h-4 text-gold-300" />
                <span className="text-white/80 text-sm font-medium">Join 1000+ happy students</span>
              </div>

              <h2
                className="font-display font-bold text-white mb-4 leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}
              >
                Ready to Find Your <br />
                <span
                  className="italic"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24, #fcd34d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Perfect PG?
                </span>
              </h2>

              <p className="text-white/55 mb-10 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                Join thousands of students who found their ideal home through StayNear.
              </p>

              <Link
                to="/pgs"
                className="inline-flex items-center gap-2 bg-white text-primary-800 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body"
              >
                Start Searching
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
