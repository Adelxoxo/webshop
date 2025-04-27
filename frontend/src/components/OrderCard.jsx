import PropTypes from "prop-types";

function OrderCard({ order, isSelected, onCheckboxChange }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500";
      case "DENIED":
        return "bg-red-500";
      case "DRAFT":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <li
      className={`cursor-pointer duration-200 rounded-lg border ${
        isSelected
          ? "border-l-8 border-l-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-l-4 hover:border-l-blue-300"
      } shadow-sm overflow-hidden`}
      onClick={() => onCheckboxChange(order.id)}
    >
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">Order Information</h3>
              {isSelected && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Selected
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <p className="grid grid-cols-3">
                <span className="font-medium text-gray-500">Date:</span>
                <span className="col-span-2">
                  {new Date(order.date).toLocaleDateString() +
                    " " +
                    new Date(order.date).toLocaleTimeString()}
                </span>
              </p>
              <p className="grid grid-cols-3">
                <span className="font-medium text-gray-500">Customer:</span>
                <span className="col-span-2">{order.name}</span>
              </p>
              <p className="grid grid-cols-3">
                <span className="font-medium text-gray-500">Email:</span>
                <span className="col-span-2">{order.email}</span>
              </p>
              <p className="grid grid-cols-3">
                <span className="font-medium text-gray-500">Address:</span>
                <span className="col-span-2">{order.address}</span>
              </p>
              <p className="grid grid-cols-3">
                <span className="font-medium text-gray-500">Status:</span>
                <span className="col-span-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Order Items</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Qty
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.products?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2 px-4 text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-900 text-right">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-900 text-right">
                        {parseFloat(item.price).toFixed(2)} KM
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-900 text-right">
                        {(item.price * item.quantity).toFixed(2)} KM
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td
                      colSpan="3"
                      className="py-2 px-4 text-sm font-medium text-gray-900"
                    >
                      Total
                    </td>
                    <td className="py-2 px-4 text-sm font-bold text-gray-900 text-right">
                      {parseFloat(order.totalAmount).toFixed(2)} KM
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
};

export default OrderCard;