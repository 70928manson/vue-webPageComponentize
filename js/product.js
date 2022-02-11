import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";

let productModal = {};
let delProductModal = {};

const app = createApp({
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/v2',
            api_Path: 'manson972',
            products: [],
            tempProduct: {
                //新增多圖片
                imagesUrl: [],
            },
            isNew: false,
        }
    },
    methods: {
        checkLogin() {
            //確認用戶是否登入成功
            axios.post(`${this.url}/api/user/check`)
                .then((res) => {
                    console.log('resp ', res);
                    this.getProductsData();
                })
                .catch((err) => {
                    alert(err.data.message);
                    //登入失敗 導回原本登入畫面
                    window.location = 'index.html';
                })
        },
        getProductsData() {
            axios.get(`${this.url}/api/${this.api_Path}/admin/products`)
                .then((res) => {
                    const { products } = res.data;
                    this.products = products;
                })
                .catch((err) => {
                    alert(err.data.message);
                    console.log(err);
                })
        },
        openModal(status, product) {
            console.log(status, product);
            if(status === 'isNew'){
                this.tempProduct = {
                    //新增多圖片
                    imagesUrl: [],
                }
                productModal.show();
                this.isNew = true;
            }else if(status === 'edit'){
                this.tempProduct = { ...product } //注意淺拷貝問題
                productModal.show();
                this.isNew = false;
            }else if(status === 'delete'){
                delProductModal.show();
                this.tempProduct = { ...product } //注意淺拷貝問題
            }
        },
        updateProduct() {
            let url = `${this.url}/api/${this.api_Path}/admin/product`;
            let method = 'post';

            //若為編輯情況，url和method被替換
            if(!this.isNew){
               url = `${this.url}/api/${this.api_Path}/admin/product/${this.tempProduct.id}`;
               method = 'put';
            }

            axios[method](url, { data: this.tempProduct })
                .then((res) => {
                    console.log(res);

                    this.getProductsData();
                    productModal.hide();
                })
                .catch((err) => {
                    alert(err.data.message);
                    console.log(err);
                })
        },
        deletProduct() {
            let url = `${this.url}/api/${this.api_Path}/admin/product/${this.tempProduct.id}`;

            axios.delete(url)
                .then((res) => {
                    console.log(res);
                    this.getProductsData();
                    delProductModal.hide();
                })
                .catch((err) => {
                    alert(err.data.message);
                    console.log(err);
                })
        }
    },
    mounted() {
        //取得dom元素=>mounted
        // 取得 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;

        this.checkLogin();
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    }
});

app.mount('#app');
