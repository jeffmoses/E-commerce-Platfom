import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../utils/api';
import { addItem } from '../store/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '/placeholder.jpg',
        brand: product.brand,
        quantity,
      })
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-xl text-red-600 mb-4">{error || 'Product not found'}</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isLowStock = product.inventory?.quantity < (product.inventory?.lowStockThreshold || 10);
  const imageUrl = product.images?.[selectedImage]?.url || '/placeholder.jpg';

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-blue-600">
            Products
          </button>
          <span>/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={imageUrl}
                  alt={product.images?.[selectedImage]?.alt || product.name}
                  className="w-full h-96 object-cover rounded-lg bg-gray-100"
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              </div>

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded border-2 overflow-hidden transition-colors ${
                        selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category Badge */}
              <div className="flex gap-2 mb-4">
                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full capitalize">
                  {product.category}
                </span>
                {product.isFeatured && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Brand */}
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                {product.brand}
              </p>

              {/* Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.averageRating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.averageRating.toFixed(1)} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-gray-600 capitalize">{key}:</p>
                        <p className="font-semibold text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dimensions */}
              {product.dimensions && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Dimensions</h3>
                  <p className="text-sm text-gray-600">
                    Length: {product.dimensions.length}mm | Width: {product.dimensions.width}mm |
                    Height: {product.dimensions.height}mm
                  </p>
                  {product.weight && (
                    <p className="text-sm text-gray-600">Weight: {product.weight}kg</p>
                  )}
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {product.inventory?.quantity > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                    <p className="text-green-600 font-semibold">
                      {product.inventory.quantity} in stock
                    </p>
                    {isLowStock && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Low Stock
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                    <p className="text-red-600 font-semibold">Out of Stock</p>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              {product.inventory?.quantity > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4 mb-4">
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: Math.min(10, product.inventory.quantity) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                      addedToCart
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                  </button>
                </div>
              )}

              {/* Back Button */}
              <button
                onClick={() => navigate('/products')}
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
              >
                ← Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
