import "@babel/polyfill"
import { login, logout } from "./auth"
import { showAlert } from "./alerts"
const form = document.querySelector(".form")

if (form) {

    form.addEventListener("submit", e => {
        e.preventDefault()

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        login(email, password)
            .then(res => {
                showAlert("success", res.data.message)
                setTimeout(() => {
                    window.location.assign("/")
                }, 1500)
            })
            .catch(err => {
                console.log(err.response.data)
                showAlert("error", err.response.data.errors[0].msg)
            })
    })
}

const logoutBtn = document.querySelector(".nav__el--logout")
if (logoutBtn) {
    logoutBtn.addEventListener("click", e => {
        logout()
            .then(res => {
                showAlert("success", res.data.message)
                setTimeout(() => {
                    location.reload(true)
                }, 1500)
            })
            .catch(err => console.log(err))
    })
}