async function post(url, body, callback) {
    await fetch(url,
        {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body,
        }
    ).then(res => callback(res));
}

export {
    post
};