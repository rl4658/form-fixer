import { header } from "./Get.js";

export default function Put(
    url: string,
    data: any,
    errorHandler: (error: any) => void,
    responseHandler?: (message: any) => void
) {
    fetch(url, {
        method: "PUT",
        headers: header,
        body: JSON.stringify(data),
    })
        .then((response) => {
            // Handle JSON response for both error and success
            return response.json().then((data) => {
                if (!response.ok) {
                    // Call the error handler with error message
                    errorHandler(data.error || "An error occurred.");
                    throw new Error(data.error); // Stop further execution
                }
                return data; // Return successful data
            });
        })
        .then((data) => {
            // Call the response handler for success, if provided
            if (responseHandler) {
                responseHandler(data.message || "Request successful.");
            }
        })
        .catch((error) => {
            console.error("Request failed:", error);
            // Fallback for handling errors if no response available
            if (errorHandler) {
                errorHandler("An unexpected error occurred.");
            }
        });
}
