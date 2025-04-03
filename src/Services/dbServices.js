const baseUrl = 'http://localhost:5000/api/userScore';

export const getScore = ({ userId, bestScore }) => {
    return fetch(`${baseUrl}/getScore`, {
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ userId, bestScore })
    })

};

export const updateScore = ({ userId, bestScore }) => {
    return fetch(`${baseUrl}/setScore`, {
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ userId, bestScore })
    })
}

