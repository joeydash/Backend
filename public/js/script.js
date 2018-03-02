var app = new Vue({
    el: '#app',
    data: {
        isLoading : true,
        message: 'You loaded this page on ' + new Date().toLocaleString()
    },
    mounted: function () {
        this.$nextTick(function () {
            this.isLoading = !this.isLoading;
        })
    }
});