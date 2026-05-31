/** API may return a bare array or paginated { result, total }. */
export function normalizeIssuesList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}
