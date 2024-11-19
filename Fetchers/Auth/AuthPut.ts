export default function AuthPut(url: string, data: any, errorHandler: () => {}, accessToken: any, responseHandler?: () => {}) {

    fetch(url, { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${accessToken}` }, body: JSON.stringify(data) })
        .then(response => {
            if (!response.ok) {
                errorHandler()
                return
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
            errorHandler()
        })

}
