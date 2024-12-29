const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login.html"
}

document.getElementById("logout").addEventListener("click", logout)