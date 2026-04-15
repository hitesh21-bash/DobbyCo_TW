import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaShieldAlt, FaClock, FaHeart, FaArrowRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const HomePage = () => {
  const features = [
    {
      icon: FaPaw,
      title: 'Expert Care',
      description: 'Certified professionals who love pets as much as you do'
    },
    {
      icon: FaShieldAlt,
      title: 'Safe & Secure',
      description: 'Fully insured and background-checked staff'
    },
    {
      icon: FaClock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for your peace of mind'
    },
    {
      icon: FaHeart,
      title: 'Loving Environment',
      description: 'Stress-free, fun, and caring atmosphere for your pets'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      pet: '🐕 Max',
      text: 'DobbyCo took amazing care of my dog Max! The grooming service was exceptional and Max came back looking like a superstar!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      pet: '🐱 Luna',
      text: 'The vet consultation service saved my cat Luna. Professional, caring, and reasonably priced. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      pet: '🐰 Coco',
      text: 'Daycare service is fantastic! My rabbit Coco loves coming here. The staff truly cares about every pet.',
      rating: 5
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl animate-slide-up">
            <div className="flex items-center space-x-2 mb-4">
              <FaPaw className="text-4xl animate-bounce-slow" />
              <span className="text-lg font-semibold">Welcome to DobbyCo</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Premium Pet Care
              <span className="block text-yellow-300">Services</span>
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Professional grooming, veterinary care, and daycare services for your beloved pets. 
              Your pet's happiness is our priority.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/services"
                className="inline-flex items-center justify-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span>Explore Services</span>
                <FaArrowRight />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
              >
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-primary-600">DobbyCo</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best care for your furry family members with love and expertise
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex p-4 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mb-4">
                    <Icon className="text-4xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Our <span className="text-primary-600">Services</span>
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive care tailored to your pet's needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Professional Grooming',
                image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500',
                description: 'Spa treatments, haircuts, nail trimming, and more'
              },
              {
                title: 'Vet Consultation',
                image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500',
                description: 'Expert veterinary care and health checkups'
              },
              {
                title: 'Daycare & Boarding',
                image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500',
                description: 'Safe, fun environment with 24/7 supervision'
              }
            ].map((service, index) => (
              <div key={index} className="card group cursor-pointer">
                <div className="relative overflow-hidden h-64">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link
                    to="/services"
                    className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center space-x-1"
                  >
                    <span>Learn More</span>
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              What Pet Parents <span className="text-primary-600">Say</span>
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from our happy customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.pet}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                <div className="flex text-yellow-400">
                  {'★'.repeat(testimonial.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Give Your Pet the Best Care?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of happy pet parents who trust DobbyCo for their furry family members
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span>Get Started Today</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;