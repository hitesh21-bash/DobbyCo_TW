import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaClock, FaMoneyBillWave, FaStar, FaFilter, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [hoveredService, setHoveredService] = useState(null);

  const categories = [
    { value: 'all', label: 'All Services', icon: '🐾' },
    { value: 'grooming', label: 'Grooming', icon: '✂️' },
    { value: 'vet', label: 'Vet Care', icon: '🏥' },
    { value: 'daycare', label: 'Daycare', icon: '🏠' },
    { value: 'boarding', label: 'Boarding', icon: '🛏️' },
    { value: 'walking', label: 'Walking', icon: '🚶' },
    { value: 'training', label: 'Training', icon: '🎓' }
  ];

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? 'http://localhost:5000/api/services'
        : `http://localhost:5000/api/services?category=${selectedCategory}`;
      
      const response = await axios.get(url);
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      grooming: '✂️',
      vet: '🏥',
      daycare: '🏠',
      boarding: '🛏️',
      walking: '🚶',
      training: '🎓'
    };
    return icons[category] || '🐾';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-primary-600">Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive pet care services tailored to your furry friend's needs
          </p>
        </div>

        {/* Category Filter - Desktop */}
        <div className="hidden md:flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="w-full bg-white px-6 py-3 rounded-lg flex items-center justify-between shadow-md"
          >
            <div className="flex items-center space-x-2">
              <FaFilter className="text-primary-600" />
              <span className="font-semibold">Filter Services</span>
            </div>
            {showFilter ? <FaTimes /> : <span>▼</span>}
          </button>

          {showFilter && (
            <div className="mt-4 bg-white rounded-lg shadow-lg p-4 animate-fade-in">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    setSelectedCategory(category.value);
                    setShowFilter(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
                    selectedCategory === category.value
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <FaPaw className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No services found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service._id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredService(service._id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image || `https://source.unsplash.com/featured/?pet,${service.category}`}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-primary-600">
                    {getCategoryIcon(service.category)} {service.category}
                  </div>
                  {hoveredService === service._id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        to={`/booking/${service._id}`}
                        className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 transform scale-90 group-hover:scale-100"
                      >
                        Book Now →
                      </Link>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-500">
                        <FaClock className="mr-1 text-primary-500" />
                        <span className="text-sm">{service.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FaMoneyBillWave className="mr-1 text-green-500" />
                        <span className="text-sm font-semibold text-gray-900">
                          ${service.price}
                        </span>
                      </div>
                    </div>
                    {service.isAvailable ? (
                      <span className="text-green-600 text-sm font-semibold">Available</span>
                    ) : (
                      <span className="text-red-600 text-sm font-semibold">Unavailable</span>
                    )}
                  </div>
                  {service.features && service.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;