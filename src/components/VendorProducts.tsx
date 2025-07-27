import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Loader,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { productService, Product, ProductFormData } from '../services/productService';
import { imageService } from '../services/cloudinaryService';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';

const VendorProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    discount_price: undefined,
    stock_quantity: 0,
    category: '',
    subcategory: '',
    images: [],
    is_organic: false,
    is_featured: false
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load vendor products
  useEffect(() => {
    fetchVendorProducts();
    fetchCategories();
  }, []);
  
  // Load subcategories when category changes
  useEffect(() => {
    if (productForm.category) {
      fetchSubcategories(productForm.category);
    } else {
      setSubcategories([]);
    }
  }, [productForm.category]);

  // Fetch vendor products
  const fetchVendorProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.getVendorProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.error || 'Failed to load products');
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Error fetching vendor products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch product categories
  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch subcategories for a category
  const fetchSubcategories = async (category: string) => {
    try {
      const response = await productService.getSubcategories(category);
      if (response.success && response.data) {
        setSubcategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  // Handle product form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setProductForm({
        ...productForm,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name === 'price' || name === 'discount_price' || name === 'stock_quantity') {
      setProductForm({
        ...productForm,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setProductForm({
        ...productForm,
        [name]: value
      });
    }
  };

  // Handle image URL input
  const handleImageUrlInput = async (imageUrl: string) => {
    if (!imageUrl.trim()) return;
    
    setUploadingImage(true);
    try {
      // Validate the image URL
      const validation = await imageService.validateImageUrl(imageUrl);
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid image URL');
        return;
      }

      setProductForm({
        ...productForm,
        images: [...productForm.images, imageUrl]
      });
      toast.success('Image added successfully');
    } catch (err) {
      toast.error('Error adding image');
      console.error('Image add error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove image from form
  const removeImage = (index: number) => {
    const newImages = [...productForm.images];
    newImages.splice(index, 1);
    setProductForm({
      ...productForm,
      images: newImages
    });
  };

  // Handle product create/update form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (productForm.images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }
    
    setIsLoading(true);
    try {
      let response;
      if (isEditingProduct && currentProduct) {
        // Update existing product
        response = await productService.updateProduct(currentProduct.id, productForm);
        if (response.success) {
          toast.success('Product updated successfully');
          // Update product in state
          setProducts(products.map(p => 
            p.id === currentProduct.id ? { ...p, ...response.data } : p
          ));
        }
      } else {
        // Create new product
        response = await productService.createProduct(productForm);
        if (response.success) {
          toast.success('Product created successfully');
          // Add new product to state
          setProducts([...products, response.data]);
        }
      }
      
      if (response?.success) {
        resetForm();
      } else {
        toast.error(response?.error || 'Failed to save product');
      }
    } catch (err) {
      toast.error('Error saving product');
      console.error('Product save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form and state
  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: 0,
      discount_price: undefined,
      stock_quantity: 0,
      category: '',
      subcategory: '',
      images: [],
      is_organic: false,
      is_featured: false
    });
    setIsAddingProduct(false);
    setIsEditingProduct(false);
    setCurrentProduct(null);
  };

  // Edit product
  const editProduct = (product: Product) => {
    setCurrentProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discount_price: product.discount_price,
      stock_quantity: product.stock_quantity,
      category: product.category,
      subcategory: product.subcategory || '',
      images: product.images || [product.image_url].filter(Boolean) as string[],
      is_organic: product.is_organic,
      is_featured: product.is_featured
    });
    setIsEditingProduct(true);
    setIsAddingProduct(true);
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setIsLoading(true);
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        toast.success('Product deleted successfully');
        setProducts(products.filter(p => p.id !== id));
      } else {
        toast.error(response.error || 'Failed to delete product');
      }
    } catch (err) {
      toast.error('Error deleting product');
      console.error('Product delete error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort products
  const sortedProducts = [...products].filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'price') {
      return sortOrder === 'asc' 
        ? a.price - b.price 
        : b.price - a.price;
    } else if (sortBy === 'stock') {
      return sortOrder === 'asc' 
        ? a.stock_quantity - b.stock_quantity 
        : b.stock_quantity - a.stock_quantity;
    }
    return 0;
  });

  // Toggle sort order
  const toggleSort = (field: 'name' | 'price' | 'stock') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Render sort icon
  const renderSortIcon = (field: 'name' | 'price' | 'stock') => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-metal heading-metal-lg">
          <Package className="inline-block mr-2" size={24} />
          Your Products
        </h2>
        <button 
          className="btn-metal" 
          onClick={() => setIsAddingProduct(!isAddingProduct)}
          disabled={isLoading}
        >
          {isAddingProduct ? 'Cancel' : (
            <>
              <Plus size={16} />
              Add Product
            </>
          )}
        </button>
      </div>
      
      {isAddingProduct && (
        <div className="metal-glass-card">
          <h3 className="heading-metal heading-metal-md mb-lg">
            {isEditingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={productForm.name}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-input"
                rows={4}
                value={productForm.description}
                onChange={handleFormChange}
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  value={productForm.price}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Discount Price (₹)</label>
                <input
                  type="number"
                  name="discount_price"
                  className="form-input"
                  value={productForm.discount_price === undefined ? '' : productForm.discount_price}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-input"
                  value={productForm.category}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Subcategory</label>
                <select
                  name="subcategory"
                  className="form-input"
                  value={productForm.subcategory}
                  onChange={handleFormChange}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  name="stock_quantity"
                  className="form-input"
                  value={productForm.stock_quantity}
                  onChange={handleFormChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group flex items-center">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    name="is_organic"
                    checked={productForm.is_organic}
                    onChange={(e) => setProductForm({...productForm, is_organic: e.target.checked})}
                    className="form-checkbox"
                  />
                  <span>Organic Product</span>
                </label>
                
                <label className="form-checkbox-label ml-4">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({...productForm, is_featured: e.target.checked})}
                    className="form-checkbox"
                  />
                  <span>Featured Product</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Product Images</label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                {productForm.images.map((url, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden h-32">
                    <img 
                      src={url} 
                      alt={`Product ${index+1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      aria-label="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                <ImageUpload
                  onImageUpload={handleImageUrlInput}
                  placeholder="Enter product image URL"
                  className="border-2 border-dashed border-gray-300 rounded-md p-4"
                />
              </div>
              <p className="text-xs text-metal mt-2">Upload up to 4 images. First image will be the main product image.</p>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button 
                type="button" 
                className="btn-metal btn-outline"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-metal"
                disabled={isLoading || uploadingImage}
              >
                {isLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : isEditingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {!isAddingProduct && (
        <>
          <div className="metal-glass-card flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-metal-accent" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                className="btn-metal btn-sm flex items-center gap-1"
                onClick={() => toggleSort('name')}
              >
                Name {renderSortIcon('name')}
              </button>
              <button 
                className="btn-metal btn-sm flex items-center gap-1"
                onClick={() => toggleSort('price')}
              >
                Price {renderSortIcon('price')}
              </button>
              <button 
                className="btn-metal btn-sm flex items-center gap-1"
                onClick={() => toggleSort('stock')}
              >
                Stock {renderSortIcon('stock')}
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-10">
              <Loader className="animate-spin" size={32} />
            </div>
          ) : error ? (
            <div className="metal-glass-card p-6 text-center">
              <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />
              <p className="text-metal">{error}</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="metal-glass-card p-6 text-center">
              <Package className="mx-auto mb-2 text-metal-accent" size={32} />
              <h3 className="heading-metal heading-metal-md mb-2">No Products Found</h3>
              <p className="text-metal">
                {searchTerm ? 'No products match your search.' : 'You haven\'t added any products yet.'}
              </p>
              {searchTerm && (
                <button 
                  className="btn-metal mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedProducts.map(product => (
                <div key={product.id} className="metal-glass-card">
                  <div className="h-40 rounded-t-md overflow-hidden mb-4">
                    <img 
                      src={product.images?.[0] || product.image_url || '/images/product-placeholder.jpg'} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="heading-metal heading-metal-sm mb-2">{product.name}</h3>
                    <p className="text-metal text-sm line-clamp-2 mb-2">{product.description}</p>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="text-accent font-bold">₹{product.price}</div>
                        {product.discount_price && (
                          <div className="text-xs text-metal line-through">₹{product.original_price}</div>
                        )}
                      </div>
                      <div className="text-sm text-metal">
                        Stock: {product.stock_quantity || (product.in_stock ? 'In stock' : 'Out of stock')}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-metal">
                        {product.category}{product.subcategory ? ` > ${product.subcategory}` : ''}
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          className="btn-icon"
                          onClick={() => editProduct(product)}
                          aria-label="Edit product"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-icon text-red-500"
                          onClick={() => deleteProduct(product.id)}
                          aria-label="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VendorProducts;
