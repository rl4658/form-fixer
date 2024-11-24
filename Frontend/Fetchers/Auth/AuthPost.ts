export default function AuthPost(url: string, data: any, errorHandler: (error: any) => void, accessToken: any, responseHandler?: () => {},) {

    fetch(url, { method: "POST", headers: { "Content-Type": "application/json", authorization: `Bearer ${accessToken}` }, body: JSON.stringify(data) })
        .then(response => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    // Handle the error response
                    errorHandler(errorData.error);
                });
            }
            response.json()
        })
        .then(data => {
            if (responseHandler) {
                responseHandler()
            }
        })

        .catch(error => {
            console.log(error)

        })

}