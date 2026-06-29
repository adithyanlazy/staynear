import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Users, Building, Shield, ArrowRight, ChevronRight, GraduationCap } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import PGCard from '../components/PGCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import api from '../utils/api';

const Home = () => {
  const [featuredPGs, setFeaturedPGs] = useState([]);
  const [stats, setStats] = useState(null);
  const [popularAreas, setPopularAreas] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [heroRef, heroVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();
  const [featuredRef, featuredVisible] = useScrollAnimation();
  const [areasRef, areasVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

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
    'Srinivas University', 'Canara Engineering College', 'AJ Institute'
  ];

  return (
    <div className="min-h-screen">
      <section ref={heroRef} className={`relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-visible animate-on-scroll ${heroVisible ? 'visible' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/30 dark:bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-300/30 dark:bg-secondary-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-10">
            <img src="/staynear-logo.png" alt="StayNear" className="w-20 h-20 mx-auto mb-6 logo-dark" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
              Find Your Perfect
              <span className="block gradient-text">PG in Mangalore</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
              Discover comfortable, affordable, and secure PG accommodations near your college.
              Your home away from home awaits.
            </p>
          </div>

          <div className="relative z-10 mb-4">
            <SearchBar />
          </div>

          <div className="flex justify-center mt-6 relative z-0">
            <Link to="/pgs" className="btn-primary inline-flex items-center gap-2">
              View All PGs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="text-sm text-gray-500 dark:text-gray-400">Popular:</span>
            {colleges.slice(0, 4).map(college => (
              <Link
                key={college}
                to={`/pgs?collegeNearby=${college}`}
                className="text-sm text-primary-500 hover:text-primary-600 hover:underline"
              >
                {college}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section ref={statsRef} className={`py-12 bg-white dark:bg-gray-800 animate-on-scroll ${statsVisible ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Building, label: 'Total PGs', value: stats?.totalPGs },
              { icon: MapPin, label: 'Areas Covered', value: stats?.totalAreas },
              { icon: Users, label: 'Happy Students', value: stats?.happyStudents },
              { icon: Star, label: 'Avg Rating', value: stats?.avgRating },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-primary-500" />
                </div>
                {loading ? (
                  <div className="h-9 w-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ) : (
                  <div className="text-3xl font-bold text-gray-900 dark:text-white transition-all duration-500 ease-out">{stat.value}</div>
                )}
                <div className="text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={featuredRef} className={`py-16 md:py-24 animate-on-scroll ${featuredVisible ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured PGs</h2>
            <p className="section-subtitle">Hand-picked accommodations for the best student experience</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPGs.map(pg => (
                  <PGCard key={pg._id} pg={pg} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to="/pgs" className="btn-primary inline-flex items-center gap-2">
                  View All PGs
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section ref={areasRef} className={`py-16 md:py-24 bg-white dark:bg-gray-800 animate-on-scroll ${areasVisible ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Popular Areas in Mangalore</h2>
            <p className="section-subtitle">Explore PGs in the best neighborhoods</p>
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
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold">{area.name}</h3>
                  <p className="text-white/70 text-sm">Explore PGs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section ref={featuresRef} className={`py-16 md:py-24 animate-on-scroll ${featuresVisible ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why StayNear?</h2>
            <p className="section-subtitle">Everything you need to find your perfect accommodation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: 'Easy Search',
                description: 'Find PGs near your college with powerful filters for budget, amenities, and more.'
              },
              {
                icon: Shield,
                title: 'Verified Listings',
                description: 'All PGs are verified for safety and quality. Read genuine student reviews.'
              },
              {
                icon: GraduationCap,
                title: 'Student-Friendly',
                description: 'Designed specifically for students with college-wise search and recommendations.'
              },
            ].map((feature, index) => (
              <div key={index} className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={testimonialsRef} className={`py-16 md:py-24 bg-white dark:bg-gray-800 animate-on-scroll ${testimonialsVisible ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Students Say</h2>
            <p className="section-subtitle">Trusted by thousands of students in Mangalore</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className={`py-16 md:py-24 animate-on-scroll ${ctaVisible ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative text-center text-white">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Find Your Perfect PG?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of students who have found their ideal accommodation through StayNear
              </p>
              <Link to="/pgs" className="inline-flex items-center gap-2 bg-white text-primary-500 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Start Searching
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
