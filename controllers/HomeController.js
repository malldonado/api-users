class HomeController{

    async index(req, res){
        res.send("API Users");
    }

}

module.exports = new HomeController();