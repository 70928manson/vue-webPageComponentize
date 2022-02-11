import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2'; // API平台
const path = 'manson972';  //個人 API Path

const app = createApp({
    data() {
        return {
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            axios.post(`${url}/admin/signin`, this.user)
                .then((res) => {
                    console.log(res);
                    const { token, expired } = res.data;
                    console.log(token, expired);
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
                    window.location = 'product.html';  //產品頁面

                })
                .catch((err) => {
                    alert(err.data.message);
                });
        }
    },
    mounted() {

    }
});

app.mount('#app');