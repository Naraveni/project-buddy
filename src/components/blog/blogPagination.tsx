import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Badge } from "../ui/badge"

interface BlogPaginationProps {
  totalPages: number
  currentPage: number
  searchParams: Record<string, string | string[] | undefined>
}

export function BlogPagination({ totalPages, currentPage, searchParams }: BlogPaginationProps) {
  if (totalPages <= 1) return null

  const getHref = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) params.set(key, value[0])
      else if (value) params.set(key, value)
    })
    params.set("page", page.toString())
    return `/blogs/me?${params.toString()}`
  }

  return (
    <div className="mt-6 flex justify-center pb-2">
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious >
                <Link href={getHref(currentPage - 1)} />
              </PaginationPrevious>
            </PaginationItem>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <PaginationItem key={pageNum}>
                <Badge variant={ currentPage === pageNum ? "default" : "secondary"}>
                <Link href={getHref(pageNum)}>{pageNum}</Link>
                </Badge>
            </PaginationItem>
          ))}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext >
                <Link href={getHref(currentPage + 1)} />
              </PaginationNext>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
