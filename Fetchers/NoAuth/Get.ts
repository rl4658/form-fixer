


export let header = {
    "Content-Type": "application/json"
}

export default function Get(url: string, setter: (data: any) => void, errorHandler: (error: any) => void) {

    fetch(url, { method: "GET", headers: header })

        .then(response => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    // Handle the error response
                    errorHandler(errorData.error);
                });
            }

            response.json()

        })

        .then(data => setter(data))

        .catch(error => {
            console.log(error)

        })
}


