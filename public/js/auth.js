import axios from "axios"

export const login = async (email, password) => {

    const res = await axios({
        method: "POST",
        url: "/api/v1/users/login",
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
        url: "/api/v1/users/logout",
    })

    return res
}

export const updateUserData = async (formData) => {
    const res = await axios({
        method: "PATCH",
        url: "/api/v1/users/updateMe",
        data: formData,
    })
    return res
}

export const updatePassword = async(oldPassword , newPassword , newPasswordConfirm) => {
    
    const res = await axios({
        method: "PATCH",
        url: "/api/v1/users/update-password",
        data: {
            oldPassword,
            newPassword,
            newPasswordConfirm
        },
    })

    return res
}