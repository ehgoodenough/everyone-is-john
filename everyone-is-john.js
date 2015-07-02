var Games = new Mongo.Collection("games")

if(Meteor.isClient) {
    Session.set("player", {
        "name": "John"
    })

    Router.route("/", function() {
        this.render("home")
    })
    Router.route("/game", function() {
        this.render("new_game")
    })
    Router.route("/game/:name", function() {
        var game_name = this.params.name
        var game = Games.findOne({
            "name": game_name
        })
        if(game == undefined) {
            this.render("new_game", {
                "data": {
                    "name": game_name
                }
            })
        } else {
            this.render("game", {
                "data": Games.findOne({
                    "name": game_name
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
            var author = Session.get("player").name
            var message = event.target.message.value
            event.target.message.value = new String()
            Games.update(this._id, {
                "$push": {
                    "chat": {
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
            var game_name = event.target.name.value
            var game = Games.findOne({
                "name": game_name
            })
            if(game != undefined) {
                alert(game_name + " already exists")
            } else {
                Router.go("/game/" + window.encodeURI(game_name))
                Games.insert({
                    "name": game_name,
                    "chat": new Array()
                })
            }
        }
    })
}

if(Meteor.isServer) {
    Meteor.startup(function() {
        Games.remove({})
        Games.insert({
            "name": "awesomesauce",
            "chat": new Array()
        })
    })
}
