export async function getProductData(productId: number): Promise<any> {
  const url = `http://localhost:3000/catalog/product/${productId}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching product data: ${response.statusText}`);
      }
      return response.json();
    })
    .catch(() => {
      return { ok: false };
    });
}
