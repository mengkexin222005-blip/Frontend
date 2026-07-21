import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";

const PAGE_SIZE = 10;

export function useUserRecords(employeeId, resource, enabled) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const buildParams = useCallback(
    (pageNum) => {
      const params = new URLSearchParams({ page: pageNum, limit: PAGE_SIZE });
      if (search) params.set("search", search);
      if (filter) {
        const filterKey = resource === "quotations" ? "stage" : "status";
        params.set(filterKey, filter);
      }
      return params.toString();
    },
    [search, filter, resource],
  );

  const fetchFirst = useCallback(async () => {
    if (!employeeId || !enabled) return;
    setLoading(true);
    try {
      const { data: res } = await api.get(
        `/api/users/${employeeId}/${resource}?${buildParams(1)}`,
      );
      setData(res.data);
      setTotalRows(res.pagination.total);
      setPage(1);
    } catch (err) {
      console.error(`useUserRecords [${resource}]:`, err);
    } finally {
      setLoading(false);
    }
  }, [employeeId, resource, enabled, buildParams]);

  // "View more" — appends next page
  const fetchMore = useCallback(async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const { data: res } = await api.get(
        `/api/users/${employeeId}/${resource}?${buildParams(nextPage)}`,
      );
      setData((prev) => [...prev, ...res.data]);
      setPage(nextPage);
    } catch (err) {
      console.error(`useUserRecords more [${resource}]:`, err);
    } finally {
      setLoadingMore(false);
    }
  }, [employeeId, resource, page, buildParams]);

  // Re-fetch from page 1 when tab enabled or search/filter changes
  useEffect(() => {
    fetchFirst();
  }, [fetchFirst]);

  const handleSearch = (val) => setSearch(val);
  const handleFilter = (val) => setFilter(val);

  const hasMore = data.length < totalRows;

  return {
    data,
    loading,
    loadingMore,
    totalRows,
    hasMore,
    handleSearch,
    handleFilter,
    search,
    filter,
    fetchMore,
  };
}
