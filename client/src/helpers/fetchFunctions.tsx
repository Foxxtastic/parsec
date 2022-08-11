export function getAllData(url: string) {
    return fetch(url)
        .then((res) => res.json())
        .catch(err => console.log(err))
}

export function getData(url: string, index: number) {
    const fetchUrl = `${url}/${index}`
    return fetch(fetchUrl)
        .then((res) => res.json())
        .catch(err => console.log(err))
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

export function createFile(url: string, file: any) {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(url, {
        method: 'POST',
        body:
            formData
    })
        .then(res => res.json())
        .then(jsonResponse => {
            if (jsonResponse.error) {
                throw new Error(jsonResponse.error.message);
            }
            return jsonResponse;
        })
}

export function updateData(url: string, id: any, data: any) {
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            data,
        })
    })
        .then(res => res.json())
        .then(jsonResponse => {
            if (jsonResponse.error) {
                throw new Error(jsonResponse.error.message);
            }
            return jsonResponse;
        })
}

export function deleteData(url: string, id: number) {
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
    })
        .then(res => res.json())
        .then(jsonResponse => {
            if (jsonResponse.error) {
                throw new Error(jsonResponse.error.message);
            }
            return jsonResponse;
        })
}

export function getKeywordsInDocument(text: string) {
    return fetch("https://dolphin-app-e3wt6.ondigitalocean.app/backend/find_keywords", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(text)
    })
        .then(res => res.json())
        .then(jsonResponse => {
            if (jsonResponse.error) {
                throw new Error(jsonResponse.error.message);
            }
            return jsonResponse;
        })
}
