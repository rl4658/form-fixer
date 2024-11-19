

export default function AuthGet(url: string, setter: (data: any) => void, errorHandler: () => {}, accessToken: any) {

    fetch(url, { method: "GET", headers: { "Content-Type": "application/json", authorization: `Bearer ${accessToken}` } })
        .then(response => {
            if (!response.ok) {
                errorHandler()
                return
            }
            response.json()
        })
        .then(data => {
            setter(data)
        })

        .catch(error => {
            console.log(error)
            errorHandler()
        })
}
