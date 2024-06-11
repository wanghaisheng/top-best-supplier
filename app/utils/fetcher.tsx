"use client";
import useSWR from "swr";
import httpsFetch from "./fetch";
import usePagination from "./pagination";

export function usePaginatedSWR(url, page, perPage) {
  const { data } = useSWR(url, httpsFetch, {
    revalidateOnMount: true, // Initial data fetch
    revalidateOnFocus: true, // Refetch when component gains focus
    revalidateOnReconnect: true, // Refetch if network is restored
    revalidateInterval: process.env.NEXT_PUBLIC_RE_VALIDATE, // Refetch
    keepPreviousData: true, // Maintain stale data while fetching new
  });

  const results = data?.data?.result ?? [];

  const paginatedData = usePagination(results, page, perPage);

  return {
    paginatedData,
    data,
    loading: !data,
  };
}

export function useSingleSWR(url) {
  const { data } = useSWR(url, httpsFetch, {
    revalidateOnMount: true, // Initial data fetch
    revalidateOnFocus: true, // Refetch when component gains focus
    revalidateOnReconnect: true, // Refetch if network is restored
    revalidateInterval: process.env.NEXT_PUBLIC_RE_VALIDATE,
    keepPreviousData: true, // Maintain stale data while fetching new
  });
  const result = data?.data ?? {};

  return {
    result,
    data,
    loading: !data,
  };
}

export function useSingleSWRAdmin(url) {
  const { data } = useSWR(`${url}&cache=no`, httpsFetch, {
    revalidateOnMount: true, // Initial data fetch
    revalidateOnFocus: true, // Refetch when component gains focus
    revalidateOnReconnect: true, // Refetch if network is restored
    keepPreviousData: false, // Maintain stale data while fetching new
  });
  const result = data?.data ?? {};
  return {
    result,
    data,
    loading: !data,
  };
}

export function usePaginatedSWRAdmin(url, page, perPage) {
  const { data } = useSWR(`${url}&cache=no`, httpsFetch);

  const results = data?.data?.result ?? [];

  const paginatedData = usePagination(results, page, perPage);
  const raw_data = data;
  return {
    paginatedData,
    raw_data,
    loading: !data,
  };
}
