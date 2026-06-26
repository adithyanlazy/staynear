import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';
import api from '../utils/api';

const Footer = () => {
  const [contact, setContact] = useState({ contactEmail: 'contact@staynear.com', contactPhone: '+91 9876543210' });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data.data.contactEmail || res.data.data.contactPhone) {
          setContact({
            contactEmail: res.data.data.contactEmail || 'contact@staynear.com',
            contactPhone: res.data.data.contactPhone || '+91 9876543210',
          });
        }
      } catch (err) {
        // keep defaults
      }
    };
    fetchContact();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-white">StayNear</span>
            </Link>
            <p className="text-sm text-gray-400">
              Find the best PG accommodations near your college in Mangalore. 
              Comfortable, affordable, and secure stays for students.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
              <li><Link to="/pgs" className="hover:text-primary-500 transition-colors">Find PGs</Link></li>
              <li><Link to="/register" className="hover:text-primary-500 transition-colors">Sign Up</Link></li>
              <li><Link to="/login" className="hover:text-primary-500 transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Popular Areas</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/pgs?area=Surathkal" className="hover:text-primary-500 transition-colors">Surathkal</Link></li>
              <li><Link to="/pgs?area=Hampankatta" className="hover:text-primary-500 transition-colors">Hampankatta</Link></li>
              <li><Link to="/pgs?area=Kadri" className="hover:text-primary-500 transition-colors">Kadri</Link></li>
              <li><Link to="/pgs?area=Bejai" className="hover:text-primary-500 transition-colors">Bejai</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Mangalore, Karnataka, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>{contact.contactPhone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>{contact.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} StayNear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
