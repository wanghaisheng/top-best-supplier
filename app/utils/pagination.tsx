export default function usePagination(data, page, perPage) {
  const startIndex = (page - 1) * perPage;
  return data.slice(startIndex, startIndex + perPage);
}
