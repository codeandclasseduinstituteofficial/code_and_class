const API_URL = "http://localhost:8080/api";


export const addClassTenLecture = async (
    data,
    token
) => {

    const response = await fetch(
        `${API_URL}/classTenth/add`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(data)
        }
    );


    const result = await response.json();


    if (!response.ok) {

        throw new Error(
            result.message || "Failed to add class 10 lecture"
        );

    }


    return result;

};



export const addIntermediateLecture = async (
    data,
    token
) => {


    const response = await fetch(
        `${API_URL}/intermediate/add`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(data)
        }
    );


    const result = await response.json();


    if (!response.ok) {

        throw new Error(
            result.message || "Failed to add intermediate lecture"
        );

    }


    return result;

};