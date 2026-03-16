export default function getApiError(error, fallbackMessage) {
  if (!error) return fallbackMessage;

  if (!error.response) {
    return "Network error: Backend is not reachable at http://localhost:5000. Start backend and check CORS/API URL.";
  }

  return error.response?.data?.message || error.message || fallbackMessage;
}
