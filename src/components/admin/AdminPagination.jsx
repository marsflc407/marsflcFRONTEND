import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminPagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 border-t border-[#123B63]/10 bg-white px-5 py-4"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="inline-flex items-center gap-1 border border-[#123B63]/15 px-3 py-2 text-sm font-600 text-[#123B63] transition-colors hover:border-[#00A651] hover:text-[#008A43] disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
      </button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map(
        (pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? "page" : undefined}
            className={`h-9 min-w-9 border px-3 text-sm font-600 transition-colors ${pageNumber === page ? "border-[#00A651] bg-[#00A651] text-white" : "border-[#123B63]/15 text-[#123B63] hover:border-[#00A651] hover:text-[#008A43]"}`}
          >
            {pageNumber}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        className="inline-flex items-center gap-1 border border-[#123B63]/15 px-3 py-2 text-sm font-600 text-[#123B63] transition-colors hover:border-[#00A651] hover:text-[#008A43] disabled:cursor-not-allowed disabled:opacity-35"
      >
        Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

export function useAdminPagination(items, pageSize = 10, resetKey = "") {
  const [page, setPage] = React.useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  React.useEffect(() => setPage(1), [resetKey, items.length]);
  React.useEffect(
    () => setPage((current) => Math.min(current, pageCount)),
    [pageCount],
  );
  return {
    page,
    pageCount,
    setPage,
    pageItems: items.slice((page - 1) * pageSize, page * pageSize),
  };
}
