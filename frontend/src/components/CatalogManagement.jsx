import PropTypes from "prop-types";
import AddProductForm from "./AddProductForm";

function CatalogManagement({ products, setProducts, onEditClick }) {
  return (
    <div>
      <AddProductForm products={products} setProducts={setProducts} />
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Product Catalog</h2>
        {products.length === 0 ? (
          <p className="text-gray-500 italic">No products in catalog.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => onEditClick(product)}
                      className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                    <button className="text-sm px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

CatalogManagement.propTypes = {
  products: PropTypes.array.isRequired,
  setProducts: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};

export default CatalogManagement;