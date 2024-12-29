const logout = () => {
    localStorage.removeItem("token")
    window.location.href("/")
}

document.getElementById("logout").addEventListener("click", logout)