var app = new Vue({
    el: '#app',
    data: {
        backend_portal_user : null,
        username : null,
        password : null,
        isLoading  : true,
        message: 'You loaded this page on ' + new Date().toLocaleString()
    },
    mounted: function () {
        this.$nextTick(function () {
            if(Cookies.get('backend_portal_user')!=null){this.backend_portal_user = JSON.parse(Cookies.get('backend_portal_user'))};
            this.isLoading = !this.isLoading;
        })
    },
    methods : {
        signin : function () {
            this.isLoading=true;

            var url = 'user/check_user';
            var data = {
                            username: this.username,
                            password: this.password
                        };

            // console.log(data);

            axios.post(url, data)
                .then(function (response) {
                    console.log(response);

                    if (response.data._id!=null){

                        Cookies.set('backend_portal_user', response.data);
                        gotoL("/");
                    }else{
                        this.isLoading=false;
                        alertify
                            .alert("Peeps!",response.data.RESULT, function(){
                                console.log(response.data.RESULT);
                            });
                    }
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                    this.isLoading=false;
                    alertify
                        .alert("Peeps!","Network Error", function(){
                            console.log("Network Error");
                        });
                });
        },
        signout : function () {
            alertify.confirm("Peeps!","Do you want to Sign out ?",
                function(){
                    Cookies.remove('backend_portal_user');
                    gotoL("/");
                },
                function(){
                    console.log("did't signed out")
                });


        }
    }
});
var gotoL = function(url){
  window.location = url;
};