import PropTypes from "prop-types";

function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="mb-6 flex space-x-4 border-b border-gray-200">
      <button
        onClick={() => onTabChange("orders")}
        className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors duration-200 ${
          activeTab === "orders"
            ? "bg-white text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600 hover:text-blue-600"
        }`}
      >
        Manage Orders
      </button>
      <button
        onClick={() => onTabChange("catalog")}
        className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors duration-200 ${
          activeTab === "catalog"
            ? "bg-white text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600 hover:text-blue-600"
        }`}
      >
        Manage Catalog
      </button>
    </div>
  );
}

TabNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default TabNavigation;