import axios from "axios"

export const login = async (email, password) => {

    const res = await axios({
        method: "POST",
        url: "http://127.0.0.1:3000/api/v1/users/login",
        data: {
            email,
            password
        },
    })
    return res
}

export const logout = async () => {
    const res = await axios({
        method: "GET",
        url: "http://127.0.0.1:3000/api/v1/users/logout",
    })

    return res
}