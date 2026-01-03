from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from ..app.logging import logger

async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail} - Path: {request.url.path}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "path": str(request.url.path),
            "method": request.method
        },
    )

async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {str(exc)} - Path: {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Database error occurred",
            "path": str(request.url.path),
            "error_type": "database_error"
        },
    )

async def websocket_exception_handler(request: Request, exc: Exception):
    logger.error(f"WebSocket error: {str(exc)} - Path: {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "WebSocket communication error",
            "path": str(request.url.path),
            "error_type": "websocket_error"
        },
    )

async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {str(exc)} - Path: {request.url.path} - Headers: {dict(request.headers)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "path": str(request.url.path),
            "error_type": "internal_error"
        },
    )
