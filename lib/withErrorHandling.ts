type Handler = (
  request: Request,
  context: any
) => Promise<Response>;

export function withErrorHandling(
  handler: Handler
): Handler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);

      const status =
        error instanceof Error &&
        'status' in error &&
        typeof error.status === 'number'
          ? error.status
          : 500;

      const message =
        error instanceof Error
          ? error.message
          : 'เกิดข้อผิดพลาดที่ไม่คาดคิด';

      return Response.json(
        {
          error: message,
        },
        {
          status,
        }
      );
    }
  };
}