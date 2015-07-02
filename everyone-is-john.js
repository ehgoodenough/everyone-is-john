var Games = new Mongo.Collection("games")

if(Meteor.isClient) {
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
            this.redirect("/game")
        } else {
            this.render("game", {
                "data": function() {
                    return Games.findOne({
                        "name": game_name
                    })
                }
            })
        }
    })

    Template.new_game.helpers({
        "print": function() {
            console.log(this)
        }
    })

    Template.new_game.events({
        "submit form": function(event) {
            event.preventDefault()
            var game_name = event.target.name.value
            Games.insert({
                "name": game_name
            })
            Router.go("/game/" + game_name)
        }
    })
}

if(Meteor.isServer) {
    Meteor.startup(function() {
        Games.remove({})
    })
}
