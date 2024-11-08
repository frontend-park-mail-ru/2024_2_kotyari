/**
 * Интерфейс, описывающий структуру ответа API.
 */
export interface apiResponse {
  /**
   * HTTP-статус ответа.
   */
  status: number;

  /**
   * Тело ответа, может быть любого типа.
   */
  body: any;
}

/**
 * Асинхронная функция для парсинга JSON-ответа из объекта Response.
 *
 * @param {Response} res - Объект Response, полученный от API.
 * @returns {Promise<apiResponse>} Возвращает промис, который разрешается в объект apiResponse.
 * @throws {Error} Выбрасывает ошибку, если не удалось распарсить тело ответа в JSON.
 */
export const parseJsonResponse = async (res: Response): Promise<apiResponse> => {
  if (res.status === 204) return {status: res.status, body: undefined};


  try {
    const responseJson = await res.json();
    return { status: responseJson.status, body: responseJson.body };
  } catch {
    throw new Error("не получилось распарсить в json");
  }
};