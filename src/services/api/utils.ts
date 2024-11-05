export interface apiResponse {
  status: number;
  body: any;
}


export const parseJsonResponse = async (res: Response): Promise<apiResponse> => {
  try {
    const responseBody = await res.json();
    return { status: res.status, body: responseBody };
  } catch {
    throw new Error("не получилось распарсить в json");
  }
};
