/**
 * Utilitaire pour tester la connexion à l'API backend
 */
export async function testBackendConnection() {
  const isDev = import.meta.env.DEV;
  const apiBaseUrl = import.meta.env?.API_BASE_URL;
  const apiUrl = (isDev || !apiBaseUrl) ? '/api' : apiBaseUrl;
  
  try {
    const response = await fetch(`${apiUrl}/news`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });
    
    return {
      success: response.ok,
      status: response.status,
      url: `${apiUrl}/news`,
      message: response.ok ? 'Backend accessible' : `Erreur HTTP ${response.status}`
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      url: `${apiUrl}/news`,
      message: error.message || 'Erreur de connexion',
      error: error
    };
  }
}

