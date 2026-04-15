import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaPaw, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'grooming',
    description: '',
    price: '',
    duration: '1hour',
    features: [],
    isAvailable: true
  });
  const [featureInput, setFeatureInput] = useState('');

  const categories = [
    { value: 'grooming', label: 'Grooming' },
    { value: 'vet', label: 'Vet Care' },
    { value: 'daycare', label: 'Daycare' },
    { value: 'boarding', label: 'Boarding' },
    { value: 'walking', label: 'Walking' },
    { value: 'training', label: 'Training' }
  ];

  const durations = [
    { value: '30min', label: '30 Minutes' },
    { value: '1hour', label: '1 Hour' },
    { value: '2hours', label: '2 Hours' },
    { value: 'full-day', label: 'Full Day' },
    { value: 'overnight', label: 'Overnight' }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (feature) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const serviceData = {
        ...formData,
        price: Number(formData.price)
      };
      
      if (editingService) {
        await axios.put(
          `http://localhost:5000/api/services/${editingService._id}`,
          serviceData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Service updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/services',
          serviceData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Service created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price,
      duration: service.duration,
      features: service.features || [],
      isAvailable: service.isAvailable
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: '',
      category: 'grooming',
      description: '',
      price: '',
      duration: '1hour',
      features: [],
      isAvailable: true
    });
    setFeatureInput('');
  };

  const getCategoryColor = (category) => {
    const colors = {
      grooming: 'bg-pink-100 text-pink-800',
      vet: 'bg-blue-100 text-blue-800',
      daycare: 'bg-green-100 text-green-800',
      boarding: 'bg-purple-100 text-purple-800',
      walking: 'bg-yellow-100 text-yellow-800',
      training: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Services</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary text-sm px-4 py-2 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{service.name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${getCategoryColor(service.category)}`}>
                  {service.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <span className="flex items-center text-gray-500">
                  <FaClock className="mr-1 text-xs" /> {service.duration}
                </span>
                <span className="flex items-center text-green-600 font-semibold">
                  <FaMoneyBillWave className="mr-1 text-xs" /> ${service.price}
                </span>
              </div>
              <span className={`text-xs ${service.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {service.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            {service.features && service.features.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {service.features.slice(0, 2).map((feature, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {feature}
                  </span>
                ))}
                {service.features.length > 2 && (
                  <span className="text-xs text-gray-400">+{service.features.length - 2}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FaPaw className="text-5xl mx-auto mb-4 text-gray-300" />
          <p>No services found. Click "Add New Service" to get started.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Service Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="input-field"
                  placeholder="e.g., Premium Dog Grooming"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input-field"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Duration *</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="input-field"
                  >
                    {durations.map(dur => (
                      <option key={dur.value} value={dur.value}>{dur.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Price ($) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="49.99"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Status</label>
                  <select
                    value={formData.isAvailable}
                    onChange={(e) => setFormData({...formData, isAvailable: e.target.value === 'true'})}
                    className="input-field"
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows="3"
                  className="input-field"
                  placeholder="Describe the service..."
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Features</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="input-field flex-1"
                    placeholder="e.g., Professional groomer"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm flex items-center">
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  <FaSave className="inline mr-2" /> {editingService ? 'Update' : 'Create'} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;