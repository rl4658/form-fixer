export default function AuthGet(
    url: string,
    setter: (data: any) => void,
    errorHandler: () => void,
    accessToken: string
) {
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                errorHandler();
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Ensure we return the parsed JSON
        })
        .then(data => {
            console.log("Fetch successful:", data);
            setter(data);
        })
        .catch(error => {
            console.error("Fetch error:", error);
            errorHandler();
        });
}
