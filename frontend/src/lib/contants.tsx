export const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT || "http://localhost:8081/api/v1";

// Function to handle the response
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Server error');
    }
    return response.json();  // assuming the server always returns JSON
};

// GET request
export const fetchGet = async (endpoint: any) => {
    const response = await fetch(`${SERVER_ENDPOINT}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });
    return handleResponse(response);
};

// POST request
export const fetchPost = async (endpoint: any, data: any) => {
    const response = await fetch(`${SERVER_ENDPOINT}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

// DELETE request
export const fetchDelete = async (endpoint: any) => {
    const response = await fetch(`${SERVER_ENDPOINT}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });
    return handleResponse(response);
};

// PUT request
export const fetchPut = async (endpoint: any, data: any) => {
    const response = await fetch(`${SERVER_ENDPOINT}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};
