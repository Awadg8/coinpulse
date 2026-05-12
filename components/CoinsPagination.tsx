"use client";

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildPageNumbers, cn, ELLIPSIS } from "@/lib/utils";

const CoinsPagination = ({
  currentPage,
  totalPages,
  hasMorePages,
}: Pagination) => {
  const pageNumbers = buildPageNumbers(currentPage, totalPages);
  const isLastPage = !hasMorePages || currentPage === totalPages;

  return (
    <PaginationRoot id="coins-pagination">
      <PaginationContent className="pagination-content">
        <PaginationItem className="pagination-control prev">
          <PaginationPrevious
            href={currentPage > 1 ? `/coins?page=${currentPage - 1}` : ""}
            className={cn(
              currentPage === 1
                ? "control-disabled"
                : "control-button",
            )}
          />
        </PaginationItem>

        <div className="pagination-pages">
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === ELLIPSIS ? (
                <span className="ellipses">...</span>
              ) : (
                <PaginationLink
                  href={`/coins?page=${page}`}
                  className={cn("page-link", {
                    "page-link-active": currentPage === page,
                  })}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem className="pagination-control next">
          <PaginationNext
            href={!isLastPage ? `/coins?page=${currentPage + 1}` : ""}
            className={cn(
              isLastPage
                ? "control-disabled"
                : "control-button",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
};

export default CoinsPagination;
