import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        First
      </button>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 border rounded transition-colors duration-200 ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </button>
    </div>
  );
};

export default PaginationComponent;
