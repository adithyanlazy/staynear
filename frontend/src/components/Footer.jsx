import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import api from '../utils/api';

const Footer = () => {
  const [contact, setContact] = useState({ contactEmail: 'contact@staynear.com', contactPhone: '+91 9876543210' });
  const [siteLogo, setSiteLogo] = useState('');
  const [siteName, setSiteName] = useState('StayNear');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/settings');
        const s = res.data.data;
        setContact({
          contactEmail: s.contactEmail || 'contact@staynear.com',
          contactPhone: s.contactPhone || '+91 9876543210',
        });
        if (s.siteLogo) setSiteLogo(s.siteLogo);
        if (s.siteName) setSiteName(s.siteName);
      } catch (err) {
        // keep defaults
      }
    };
    fetchData();
  }, []);

  return (
    <footer className="bg-[#020b0a] text-gray-500 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              {siteLogo ? (
                <img src={siteLogo} alt={siteName} className="h-10 w-10 rounded-xl object-cover logo-dark" />
              ) : (
                <img src="/staynear-logo.png" alt={siteName} className="h-10 w-10 logo-dark" />
              )}
              <span className="text-xl font-display font-bold text-white">{siteName}</span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-[210px]">
              The smartest way to find student PG accommodation in Mangalore.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">Navigation</h3>
            <ul className="space-y-3 text-sm">
              {[['/', 'Home'], ['/pgs', 'Find PGs'], ['/register', 'Sign Up'], ['/login', 'Login']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">Popular Areas</h3>
            <ul className="space-y-3 text-sm">
              {['Surathkal', 'Hampankatta', 'Kadri', 'Bejai'].map(area => (
                <li key={area}>
                  <Link to={`/pgs?area=${area}`} className="hover:text-primary-400 transition-colors">
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span>Mangalore, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>{contact.contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>{contact.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.05] gap-3">
          <p className="text-xs text-gray-700">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">Made with ♥ for Mangalore students</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
