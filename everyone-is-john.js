var Games = new Mongo.Collection("games")
var Users = new Mongo.Collection("users")

if(Meteor.isClient) {
    var user = Users.insert({})
    Session.set("user", user)

    Router.route("/", function() {
        this.render("home")
    })
    Router.route("/play", function() {
        this.render("new_game")
    })
    Router.route("/play/:code", function() {
        var game_code = this.params.code
        var game = Games.findOne({
            "code": game_code
        })
        if(game == undefined) {
            this.render("new_game", {
                "data": {
                    "code": game_code
                }
            })
        } else {
            this.render("game", {
                "data": Games.findOne({
                    "code": game_code
                })
            })
        }
    })

    Template.registerHelper("print", function() {
        console.log(this)
    })

    Template.game.events({
        "submit #chat": function(event) {
            event.preventDefault()
            var author = Session.get("user")
            var message = event.target.message.value
            event.target.message.value = new String()
            Games.update(this._id, {
                "$push": {
                    "chats": {
                        "author": author,
                        "message": message
                    }
                }
            })
        }
    })

    Template.new_game.events({
        "submit form": function(event) {
            event.preventDefault()
            var game_master = Session.get("user")
            var game_name = event.target.name.value
            var game_code = game_name.toLowerCase()
            var game = Games.findOne({
                "code": game_code
            })
            if(game != undefined) {
                alert(game_name + " already exists")
            } else {
                Router.go("/play/" + game_code)
                Games.insert({
                    "code": game_code,
                    "name": game_name,
                    "chats": new Array(),
                    "master": game_master
                })
            }
        }
    })
}

if(Meteor.isServer) {
    Meteor.startup(function() {
        Games.remove({})
        Games.insert({
            "name": "Awesomesauce",
            "code": "awesomesauce",
            "master": "PM9LKALL2ATCY27VV",
            "chats": new Array()
        })
    })
}
