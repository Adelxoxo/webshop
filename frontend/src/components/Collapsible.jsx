import { useState } from "react";
import PropTypes from "prop-types";

function Collapsible({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4 border bg-slate-100 border-gray-200 rounded-md">
      <button
        onClick={toggleOpen}
        className="w-full text-left px-4 py-2 rounded-md hover:bg-slate-300 transition-colors duration-200"
      >
        {title}
      </button>
      {isOpen && <div className="p-4 mt-2">{children}</div>}
    </div>
  );
}
Collapsible.propTypes = {
  title: PropTypes.node.isRequired, // Accepts JSX elements or strings
  children: PropTypes.node,
};

export default Collapsible;
