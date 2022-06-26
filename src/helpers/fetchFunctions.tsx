export function getData(url: string) {
    return fetch(url)
        .then((res) => res.json())
}

export function createData(url: string, newItem: any) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
        .then(res => res.json())
        .then(jsonResponse => {
            if (jsonResponse.error) {
                throw new Error(jsonResponse.error.message);
            }
            return jsonResponse;
        })
}