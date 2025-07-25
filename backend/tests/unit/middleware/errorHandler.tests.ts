import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../../src/middleware/errorHandler";

describe("errorHandler middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should handle generic errors and return 500", () => {
        const err = new Error("Something went wrong");

        errorHandler(err, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: "Error",
                message: "Something went wrong"
            }
        });
    });

    it("should handle errors with status property", () => {
        const err = Object.assign(new Error("Not Found"), { status: 404 });

        errorHandler(err, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: "Error",
                message: "Not Found"
            }
        });
    });

    it("should handle errors with statusCode property", () => {
        const err = Object.assign(new Error("Bad Request"), { statusCode: 400 });

        errorHandler(err, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500); // Your errorHandler only uses .status, not .statusCode
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: "Error",
                message: "Bad Request"
            }
        });
    });

    it("should handle errors with custom fields", () => {
        const err = Object.assign(new Error("Validation Error"), {
            status: 422,
            violations: ["Field is required"],
            missingValues: ["name"]
        });

        errorHandler(err, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: "Error",
                message: "Validation Error"
            }
        });
        // Note: Your errorHandler doesn't preserve custom fields like violations and missingValues
    });

    it("should handle errors with no message", () => {
        const err = { status: 500 };

        errorHandler(err as any, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: "Error",
                message: "Internal server error"
            }
        });
    });

    it("should handle errors with custom name", () => {
        const err = Object.assign(new Error("Custom error message"), { 
            status: 400,
            name: "ValidationError"
        });

        errorHandler(err, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: "ValidationError",
                message: "Custom error message"
            }
        });
    });

    it("should handle null/undefined errors", () => {
        const err = null;

        errorHandler(err as any, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: "Error",
                message: "Internal server error"
            }
        });
    });

    it("should handle empty error object", () => {
        const err = {};

        errorHandler(err as any, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                name: "Error",
                message: "Internal server error"
            }
        });
    });
});