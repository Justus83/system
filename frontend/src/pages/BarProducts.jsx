import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { barProductsAPI } from '../services/api';
import { useSearchParams } from 'react-router-dom';
import { ProductTable, SearchBar, ProductModal } from '../components/shared';

const BarProducts = () => {
  const { selectedStore, user } = useAuth();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || 'beer';
  const [productType, setProductType] = useState(typeParam);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [enumOptions, setEnumOptions] = useState({
    brands: [],
    beerSizes: [],
    spiritSizes: [],
    spiritTypes: [],
    spiritYears: [],
    wineSizes: [],
    wineTypes: [],
    wineYears: [],
    champagneSizes: [],
    juiceSizes: [],
    softDrinkTypes: [],
    softDrinkSizes: [],
    packaging: []
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    brand: '',
    // Beer specific
    size: '',
    packaging: '',
    // Spirit specific
    type: '',
    spiritSize: '',
    year: '',
    // Wine specific
    wineType: '',
    wineSize: '',
    wineYear: '',
    // Champagne specific
    champagneSize: '',
    // Juice specific
    juiceSize: '',
    // Soft Drink specific
    softDrinkType: '',
    softDrinkSize: '',
  });

  useEffect(() => {
    fetchData();
    fetchEnums();
  }, [selectedStore, productType]);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && (typeParam === 'beer' || typeParam === 'spirit' || typeParam === 'wine' || typeParam === 'champagne' || typeParam === 'juice' || typeParam === 'softdrink')) {
      setProductType(typeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = products.filter(product => {
      if (productType === 'beer') {
        return (
          product.brandName?.toLowerCase().includes(term) ||
          product.sizeName?.toLowerCase().includes(term) ||
          product.packagingName?.toLowerCase().includes(term)
        );
      } else {
        return (
          product.brandName?.toLowerCase().includes(term) ||
          product.typeName?.toLowerCase().includes(term) ||
          product.sizeName?.toLowerCase().includes(term)
        );
      }
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products, productType]);

  const fetchEnums = async () => {
    try {
      const [brandsRes, beerSizesRes, spiritSizesRes, spiritTypesRes, spiritYearsRes, wineSizesRes, wineTypesRes, wineYearsRes, champagneSizesRes, juiceSizesRes, softDrinkTypesRes, softDrinkSizesRes, packagingRes] = await Promise.all([
        barProductsAPI.getBrands(),
        barProductsAPI.getBeerSizes(),
        barProductsAPI.getSpiritSizes(),
        barProductsAPI.getSpiritTypes(),
        barProductsAPI.getSpiritYears(),
        barProductsAPI.getWineSizes(),
        barProductsAPI.getWineTypes(),
        barProductsAPI.getWineYears(),
        barProductsAPI.getChampagneSizes(),
        barProductsAPI.getJuiceSizes(),
        barProductsAPI.getSoftDrinkTypes(),
        barProductsAPI.getSoftDrinkSizes(),
        barProductsAPI.getPackaging(),
      ]);

      setEnumOptions({
        brands: brandsRes.data,
        beerSizes: beerSizesRes.data,
        spiritSizes: spiritSizesRes.data,
        spiritTypes: spiritTypesRes.data,
        spiritYears: spiritYearsRes.data,
        wineSizes: wineSizesRes.data,
        wineTypes: wineTypesRes.data,
        wineYears: wineYearsRes.data,
        champagneSizes: champagneSizesRes.data,
        juiceSizes: juiceSizesRes.data,
        softDrinkTypes: softDrinkTypesRes.data,
        softDrinkSizes: softDrinkSizesRes.data,
        packaging: packagingRes.data
      });
    } catch (error) {
      console.error('Error fetching enums:', error);
    }
  };

  const fetchData = async () => {
    if (!selectedStore) return;
    
    setLoading(true);
    try {
      let productsRes;
      if (productType === 'beer') {
        productsRes = await barProductsAPI.getBeersByStore(selectedStore.id);
      } else if (productType === 'spirit') {
        productsRes = await barProductsAPI.getSpiritsByStore(selectedStore.id);
      } else if (productType === 'wine') {
        productsRes = await barProductsAPI.getWinesByStore(selectedStore.id);
      } else if (productType === 'champagne') {
        productsRes = await barProductsAPI.getChampagnesByStore(selectedStore.id);
      } else if (productType === 'juice') {
        productsRes = await barProductsAPI.getJuicesByStore(selectedStore.id);
      } else {
        productsRes = await barProductsAPI.getSoftDrinksByStore(selectedStore.id);
      }

      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleEnumAdded = (enumType) => {
    // Refresh enums when a new one is added
    fetchEnums();
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      const dataToSubmit = {
        ...data,
        storeId: selectedStore.id,
      };

      if (productType === 'beer') {
        delete dataToSubmit.type;
        delete dataToSubmit.spiritSize;
        delete dataToSubmit.year;
        delete dataToSubmit.wineType;
        delete dataToSubmit.wineSize;
        delete dataToSubmit.wineYear;
        delete dataToSubmit.champagneSize;
        delete dataToSubmit.juiceSize;
        delete dataToSubmit.softDrinkType;
        delete dataToSubmit.softDrinkSize;
      } else if (productType === 'spirit') {
        dataToSubmit.size = dataToSubmit.spiritSize;
        delete dataToSubmit.spiritSize;
        delete dataToSubmit.packaging;
        delete dataToSubmit.wineType;
        delete dataToSubmit.wineSize;
        delete dataToSubmit.wineYear;
        delete dataToSubmit.champagneSize;
        delete dataToSubmit.juiceSize;
        delete dataToSubmit.softDrinkType;
        delete dataToSubmit.softDrinkSize;
        if (!dataToSubmit.year) {
          delete dataToSubmit.year;
        }
      } else if (productType === 'wine') {
        dataToSubmit.type = dataToSubmit.wineType;
        dataToSubmit.size = dataToSubmit.wineSize;
        dataToSubmit.year = dataToSubmit.wineYear;
        delete dataToSubmit.wineType;
        delete dataToSubmit.wineSize;
        delete dataToSubmit.wineYear;
        delete dataToSubmit.spiritSize;
        delete dataToSubmit.packaging;
        delete dataToSubmit.champagneSize;
        delete dataToSubmit.juiceSize;
        delete dataToSubmit.softDrinkType;
        delete dataToSubmit.softDrinkSize;
        if (!dataToSubmit.year) {
          delete dataToSubmit.year;
        }
      } else if (productType === 'champagne') {
        dataToSubmit.size = dataToSubmit.champagneSize;
        delete dataToSubmit.champagneSize;
        delete dataToSubmit.type;
        delete dataToSubmit.spiritSize;
        delete dataToSubmit.year;
        delete dataToSubmit.wineType;
        delete dataToSubmit.wineSize;
        delete dataToSubmit.wineYear;
        delete dataToSubmit.packaging;
        delete dataToSubmit.juiceSize;
        delete dataToSubmit.softDrinkType;
        delete dataToSubmit.softDrinkSize;
        if (!dataToSubmit.size) {
          delete dataToSubmit.size;
        }
      } else if (productType === 'juice') {
        dataToSubmit.size = dataToSubmit.juiceSize;
        delete dataToSubmit.juiceSize;
        delete dataToSubmit.type;
        delete dataToSubmit.spiritSize;
        delete dataToSubmit.year;
        delete dataToSubmit.wineType;
        delete dataToSubmit.wineSize;
        delete dataToSubmit.wineYear;
        delete dataToSubmit.champagneSize;
        delete dataToSubmit.packaging;
        delete dataToSubmit.softDrinkType;
        delete dataToSubmit.softDrinkSize;
        if (!dataToSubmit.size) {
          delete dataToSubmit.size;
        }
      } else {
        // Soft Drink
        dataToSubmit.type = dataToSubmit.softDrinkType;
        dataToSubmit.size = dataToSubmit.softDrinkSize;
        delete dataToSubmit.softDrinkType;
        delete dataToSubmit.softDrinkSize;
        delete dataToSubmit.spiritSize;
        delete dataToSubmit.year;
        delete dataToSubmit.wineType;
        delete dataToSubmit.wineSize;
        delete dataToSubmit.wineYear;
        delete dataToSubmit.champagneSize;
        delete dataToSubmit.juiceSize;
        delete dataToSubmit.packaging;
        if (!dataToSubmit.brand) {
          delete dataToSubmit.brand;
        }
        if (!dataToSubmit.size) {
          delete dataToSubmit.size;
        }
      }

      if (editingProduct) {
        if (productType === 'beer') {
          await barProductsAPI.updateBeer(editingProduct.id, dataToSubmit);
        } else if (productType === 'spirit') {
          await barProductsAPI.updateSpirit(editingProduct.id, dataToSubmit);
        } else if (productType === 'wine') {
          await barProductsAPI.updateWine(editingProduct.id, dataToSubmit);
        } else if (productType === 'champagne') {
          await barProductsAPI.updateChampagne(editingProduct.id, dataToSubmit);
        } else if (productType === 'juice') {
          await barProductsAPI.updateJuice(editingProduct.id, dataToSubmit);
        } else {
          await barProductsAPI.updateSoftDrink(editingProduct.id, dataToSubmit);
        }
      } else {
        if (productType === 'beer') {
          await barProductsAPI.createBeer(dataToSubmit);
        } else if (productType === 'spirit') {
          await barProductsAPI.createSpirit(dataToSubmit);
        } else if (productType === 'wine') {
          await barProductsAPI.createWine(dataToSubmit);
        } else if (productType === 'champagne') {
          await barProductsAPI.createChampagne(dataToSubmit);
        } else if (productType === 'juice') {
          await barProductsAPI.createJuice(dataToSubmit);
        } else {
          await barProductsAPI.createSoftDrink(dataToSubmit);
        }
      }

      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Error saving product: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    
    // Use the ID fields from the API response (not the name fields)
    const formValues = {
      brand: product.brandId || '',
      size: product.sizeId || '',
      packaging: product.packagingId || '',
      type: product.typeId || '',
      spiritSize: product.sizeId || '',
      year: product.yearId || '',
      wineType: product.typeId || '',
      wineSize: product.sizeId || '',
      wineYear: product.yearId || '',
      champagneSize: product.sizeId || '',
      juiceSize: product.sizeId || '',
      softDrinkType: product.typeId || '',
      softDrinkSize: product.sizeId || '',
    };
    
    console.log('Editing product:', product);
    console.log('Form values:', formValues);
    
    setFormData(formValues);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      if (productType === 'beer') {
        await barProductsAPI.deleteBeer(id);
      } else if (productType === 'spirit') {
        await barProductsAPI.deleteSpirit(id);
      } else if (productType === 'wine') {
        await barProductsAPI.deleteWine(id);
      } else if (productType === 'champagne') {
        await barProductsAPI.deleteChampagne(id);
      } else if (productType === 'juice') {
        await barProductsAPI.deleteJuice(id);
      } else {
        await barProductsAPI.deleteSoftDrink(id);
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      size: '',
      packaging: '',
      type: '',
      spiritSize: '',
      year: '',
      wineType: '',
      wineSize: '',
      wineYear: '',
      champagneSize: '',
      juiceSize: '',
      softDrinkType: '',
      softDrinkSize: '',
    });
    setEditingProduct(null);
  };

  // Check if user can manage products (only management roles)
  const canManageProducts = () => {
    // If no role is set, default to true for backward compatibility
    if (!user?.role) return true;
    const allowedRoles = ['OWNER', 'ADMIN', 'BRANCH_MANAGER', 'MANAGER', 'STORE_MANAGER'];
    return allowedRoles.includes(user.role);
  };

  // Get table columns based on product type
  const getColumns = (productType) => {
    if (productType === 'beer') {
      return [
        { key: 'brandName', title: 'Brand', isPrimary: true },
        { key: 'sizeName', title: 'Size' },
        { key: 'packagingName', title: 'Packaging' },
      ];
    } else if (productType === 'spirit') {
      return [
        { key: 'typeName', title: 'Type', isPrimary: true },
        { key: 'brandName', title: 'Brand' },
        { key: 'sizeName', title: 'Size' },
        { key: 'yearName', title: 'Year' },
      ];
    } else if (productType === 'wine') {
      return [
        { key: 'typeName', title: 'Type', isPrimary: true },
        { key: 'brandName', title: 'Brand' },
        { key: 'sizeName', title: 'Size' },
        { key: 'yearName', title: 'Year' },
      ];
    } else if (productType === 'champagne') {
      return [
        { key: 'brandName', title: 'Brand', isPrimary: true },
        { key: 'sizeName', title: 'Size' },
      ];
    } else if (productType === 'juice') {
      return [
        { key: 'brandName', title: 'Brand', isPrimary: true },
        { key: 'sizeName', title: 'Size' },
      ];
    } else {
      return [
        { key: 'typeName', title: 'Type', isPrimary: true },
        { key: 'brandName', title: 'Brand' },
        { key: 'sizeName', title: 'Size' },
      ];
    }
  };

  // Form fields configuration
  const formFields = useMemo(() => {
    const baseFields = [];

    if (productType === 'beer') {
      baseFields.push(
        { 
          name: 'brand', 
          label: 'Brand', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Brand',
          options: enumOptions.brands.map(b => ({ value: b.id, label: b.name })) 
        },
        { 
          name: 'size', 
          label: 'Size', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Size',
          options: enumOptions.beerSizes.map(s => ({ value: s.id, label: s.name })) 
        },
        { 
          name: 'packaging', 
          label: 'Packaging', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Packaging',
          options: enumOptions.packaging.map(p => ({ value: p.id, label: p.name })) 
        }
      );
    } else if (productType === 'spirit') {
      baseFields.push(
        { 
          name: 'type', 
          label: 'Type', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Type',
          options: enumOptions.spiritTypes.map(t => ({ value: t.id, label: t.name })) 
        },
        { 
          name: 'brand', 
          label: 'Brand', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Brand',
          options: enumOptions.brands.map(b => ({ value: b.id, label: b.name })) 
        },
        { 
          name: 'spiritSize', 
          label: 'Size', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Size',
          options: enumOptions.spiritSizes.map(s => ({ value: s.id, label: s.name })) 
        },
        { 
          name: 'year', 
          label: 'Year', 
          type: 'select', 
          required: false, 
          placeholder: 'Select Year',
          options: enumOptions.spiritYears.map(y => ({ value: y.id, label: y.name })) 
        }
      );
    } else if (productType === 'wine') {
      baseFields.push(
        { 
          name: 'wineType', 
          label: 'Type', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Type',
          options: enumOptions.wineTypes.map(t => ({ value: t.id, label: t.name })) 
        },
        { 
          name: 'brand', 
          label: 'Brand', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Brand',
          options: enumOptions.brands.map(b => ({ value: b.id, label: b.name })) 
        },
        { 
          name: 'wineSize', 
          label: 'Size', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Size',
          options: enumOptions.wineSizes.map(s => ({ value: s.id, label: s.name })) 
        },
        { 
          name: 'wineYear', 
          label: 'Year', 
          type: 'select', 
          required: false, 
          placeholder: 'Select Year',
          options: enumOptions.wineYears.map(y => ({ value: y.id, label: y.name })) 
        }
      );
    } else if (productType === 'champagne') {
      baseFields.push(
        { 
          name: 'brand', 
          label: 'Brand', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Brand',
          options: enumOptions.brands.map(b => ({ value: b.id, label: b.name })) 
        },
        { 
          name: 'champagneSize', 
          label: 'Size', 
          type: 'select', 
          required: false, 
          placeholder: 'Select Size',
          options: enumOptions.champagneSizes.map(s => ({ value: s.id, label: s.name })) 
        }
      );
    } else if (productType === 'juice') {
      baseFields.push(
        { 
          name: 'brand', 
          label: 'Brand', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Brand',
          options: enumOptions.brands.map(b => ({ value: b.id, label: b.name })) 
        },
        { 
          name: 'juiceSize', 
          label: 'Size', 
          type: 'select', 
          required: false, 
          placeholder: 'Select Size',
          options: enumOptions.juiceSizes.map(s => ({ value: s.id, label: s.name })) 
        }
      );
    } else {
      // Soft Drink
      baseFields.push(
        { 
          name: 'softDrinkType', 
          label: 'Type', 
          type: 'select', 
          required: true, 
          placeholder: 'Select Type',
          options: enumOptions.softDrinkTypes.map(t => ({ value: t.id, label: t.name })) 
        },
        { 
          name: 'brand', 
          label: 'Brand', 
          type: 'select', 
          required: false, 
          placeholder: 'Select Brand',
          options: enumOptions.brands.map(b => ({ value: b.id, label: b.name })) 
        },
        { 
          name: 'softDrinkSize', 
          label: 'Size', 
          type: 'select', 
          required: false, 
          placeholder: 'Select Size',
          options: enumOptions.softDrinkSizes.map(s => ({ value: s.id, label: s.name })) 
        }
      );
    }

    return baseFields;
  }, [enumOptions, productType]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={`Search ${productType}s...`}
        onAddClick={() => {
          resetForm();
          setShowModal(true);
        }}
        addButtonText={`Add ${productType === 'beer' ? 'Beer' : productType === 'spirit' ? 'Spirit' : productType === 'wine' ? 'Wine' : productType === 'champagne' ? 'Champagne' : productType === 'juice' ? 'Juice' : 'Soft Drink'}`}
        showAddButton={canManageProducts()}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <ProductTable
            columns={getColumns(productType)}
            data={filteredProducts}
            emptyMessage={`No ${productType}s found`}
            searchQuery={searchTerm}
            onEdit={canManageProducts() ? handleEdit : null}
            onDelete={canManageProducts() ? handleDelete : null}
            actions={true}
          />
        </div>
      )}

      <ProductModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setError('');
          resetForm();
        }}
        onSubmit={handleSubmit}
        title={`${editingProduct ? 'Edit' : 'Add'} ${productType === 'beer' ? 'Beer' : productType === 'spirit' ? 'Spirit' : productType === 'wine' ? 'Wine' : productType === 'champagne' ? 'Champagne' : productType === 'juice' ? 'Juice' : 'Soft Drink'}`}
        fields={formFields}
        initialData={formData}
        saving={saving}
        onEnumAdded={handleEnumAdded}
        error={error}
        storeId={selectedStore?.id}
      />
    </div>
  );
};

export default BarProducts;
