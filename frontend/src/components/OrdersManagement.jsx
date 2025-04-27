import PropTypes from "prop-types";
import OrderCard from "./OrderCard";
import Collapsible from "./Collapsible";

function OrdersManagement({ orders, setOrders, selectedOrders, setSelectedOrders }) {
  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkAction = async (action) => {
    const token = localStorage.getItem("token");
    const selectedOrdersData = orders.filter((order) =>
      selectedOrders.includes(order.id)
    );

    for (const order of selectedOrdersData) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/admin/${order.id}/${action}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
      } catch (error) {
        console.error("Error updating order:", error);
      }
    }

    setSelectedOrders([]);
  };

  const awaitingApproval = orders.filter((order) => order.status === "DRAFT");
  const previousOrders = orders.filter((order) => order.status !== "DRAFT");

  const getOrderBorderColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "border-l-green-500";
      case "DENIED":
        return "border-l-red-500";
      case "DRAFT":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-500";
    }
  };

  const getStatusBadgeClasses = (status) => {
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
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Orders Awaiting Approval</h2>
        {awaitingApproval.length === 0 ? (
          <p className="text-gray-500 italic">No orders awaiting approval.</p>
        ) : (
          <div>
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => handleBulkAction("APPROVED")}
                disabled={selectedOrders.length === 0}
                className={`rounded-md bg-green-500 text-white px-4 py-2 font-medium transition-all ${
                  selectedOrders.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-600"
                }`}
              >
                Approve Selected ({selectedOrders.length})
              </button>
              <button
                onClick={() => handleBulkAction("DENIED")}
                disabled={selectedOrders.length === 0}
                className={`rounded-md bg-red-500 text-white px-4 py-2 font-medium transition-all ${
                  selectedOrders.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-600"
                }`}
              >
                Deny Selected ({selectedOrders.length})
              </button>
            </div>
            <ul className="space-y-4">
              {awaitingApproval.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrders.includes(order.id)}
                  onCheckboxChange={handleCheckboxChange}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <Collapsible
          title={
            <span className="text-xl font-bold text-gray-800">Previous Orders</span>
          }
          initialOpen={false}
        >
          {previousOrders.length === 0 ? (
            <p className="text-gray-500 italic">No previous orders.</p>
          ) : (
            <ul className="space-y-4 mt-4">
              {previousOrders.map((order) => (
                <li
                  key={order.id}
                  className={`rounded-lg border shadow-sm overflow-hidden border-l-8 ${getOrderBorderColor(
                    order.status
                  )}`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-lg">Order Information</h3>
                          <span
                            className={`text-white text-xs font-medium px-2.5 py-0.5 rounded ${getStatusBadgeClasses(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
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
                            <span className="col-span-2">{order.email || "N/A"}</span>
                          </p>
                          <p className="grid grid-cols-3">
                            <span className="font-medium text-gray-500">Address:</span>
                            <span className="col-span-2">{order.address}</span>
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
              ))}
            </ul>
          )}
        </Collapsible>
      </div>
    </div>
  );
}

OrdersManagement.propTypes = {
  orders: PropTypes.array.isRequired,
  setOrders: PropTypes.func.isRequired,
  selectedOrders: PropTypes.array.isRequired,
  setSelectedOrders: PropTypes.func.isRequired,
};

export default OrdersManagement;