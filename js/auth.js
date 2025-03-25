new Vue({
    el: "#app",
    data: {
        username: "",
        password: "",
        error: ""
    },
    methods: {
        async login() {
            this.error = "";
            const response = await window.electronAPI.login({
                username: this.username,
                password: this.password
            });

            if (!response.success) {
                this.error = response.message;
            } else {
                sessionStorage.setItem("user", JSON.stringify(response.user));
            }
        }
    }
});