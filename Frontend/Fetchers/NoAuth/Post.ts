
import { header } from "./Get"
import { User } from "../../app/hooks/UserContext.js";

export default function Post(url: string, data: any, errorHandler: (error: any) => void, responseHandler?: () => void, setter?: (data: User) => void) {

    fetch(url, { method: "POST", headers: header, body: JSON.stringify(data) })
        .then(response => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    // Handle the error response

                    errorHandler(errorData.error);
                    throw new Error("Response not OK");
                });
            }
            return response.json() as Promise<User>
        })
        .then((data: User) => {
            if (setter) {
                setter(data)
            }
            if (responseHandler) {
                responseHandler()
            }
        })

        .catch(error => {
            console.log(error)

        })

}