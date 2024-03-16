import "@babel/polyfill"
import { login, logout, updateUserData, updatePassword } from "./auth"
import { showAlert } from "./alerts"
import { bookTour } from "./stripe"

const loginForm = document.querySelector(".form--login")
if (loginForm) {

    loginForm.addEventListener("submit", e => {
        e.preventDefault()

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        login(email, password)
            .then(res => {
                showAlert("success", res.data.message)
                setTimeout(() => {
                    window.location.replace("/")
                }, 1500)
            })
            .catch(err => {
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
                    window.location.replace("/")
                }, 1500)
            })
            .catch(err => showAlert("error", err.response.data.message))
    })
}

const updateDataForm = document.querySelector(".form-user-data")
if (updateDataForm) {
    updateDataForm.addEventListener("submit", e => {
        e.preventDefault()

        const form = new FormData()
        form.append("name" ,document.getElementById("name").value)
        form.append("email" ,document.getElementById("email").value)
        form.append("photo" ,document.getElementById("photo").files[0])

        updateUserData(form)
            .then(res => {
                showAlert("success", res.data.message)
            })
            .catch(err => {
                showAlert("error", err.response.data.errors[0].msg)
            })
    })
}

const updatePasswordForm = document.querySelector(".form-user-settings")
if (updatePasswordForm) {
    updatePasswordForm.addEventListener("submit", async e => {
        e.preventDefault()

        document.querySelector(".btn--save-password").textContent = "Updating...."

        const oldPassword = document.getElementById("password-current").value
        const newPassword = document.getElementById("password").value
        const newPasswordConfirm = document.getElementById("password-confirm").value

        try {
            const res = await updatePassword(oldPassword, newPassword, newPasswordConfirm)
            showAlert("success", res.data.message)
        } catch (err) {
            showAlert("error", err.response.data.errors[0].msg)
        }

        document.querySelector(".btn--save-password").textContent = "Save password"
        document.getElementById("password-current").value = ''
        document.getElementById("password").value = ''
        document.getElementById("password-confirm").value = ''
    })
}

const bookBtn = document.querySelector("#book-tour")
if(bookBtn) {
    bookBtn.addEventListener("click", async (e) => {
        e.target.textContent = "Processing..."
        const { tourId } = e.target.dataset

        bookTour(tourId)
    })
}

const alertMessage = document.querySelector("body").dataset.alert 
if(alertMessage) {
    showAlert("success", alertMessage)
}