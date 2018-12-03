import React, { Component } from 'react';
import './Bets.css'

const BASEURL = 'http://localhost:4000'

class Bets extends Component {

    constructor(props) {
        super(props);
        this.state = { bets: [],};
    }

    componentDidMount() {
        this.getBets();
    }

    componentDidUpdate(prev){
        console.log("herer");
        if(prev.refresh!==this.props.refresh){
            this.getBets();
            sessionStorage.setItem("user", sessionStorage.getItem("user"))
        }
    }

    getBets = _ => {
        console.log("get bets");
        fetch(BASEURL + '/bets')
        .then(response => response.json())
        .then(response => this.setState({ bets: response.data}))
        .catch(err => console.log(err))
    }

    deleteBet(id) {
        const data = {"id": id}
        fetch(BASEURL + '/bet/delete', {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(this.getBets)
        .catch(err => console.log(err))
    }

    completeBet(id) {
        const data = {"id": id}
        console.log("REACHED completedBet")
        fetch(BASEURL + '/bet/complete', {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(this.getBets)
        .catch(err => console.log(err))
    }

    challengeBet(id) {
        const data = {
            "user": sessionStorage.getItem("user"),
            "id": id
        }
        fetch(BASEURL + '/bet/challenge', {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(this.getBets)
        .catch(err => console.log(err))
    }

    renderYourOngoingBets = (bet) => { //renders your bets that aren't open and aren't completed
        if ((sessionStorage.getItem("user") === bet.user1 ||
             sessionStorage.getItem("user") === bet.user2) &&
             bet.completed === 0 && bet.open === 0 && sessionStorage.getItem("user") !== null) {

            const cat_str = "card " + bet.category
            return (
                <div className="col-3" key={bet.id}>
                    <div className={cat_str} id={bet.id}>
                        <h5 className="title card-header">{bet.title}</h5>
                        <p className="description">{bet.description}</p>
                        <p className="users">{bet.user1} vs. {bet.user2}</p>
                        <button className="btn btn-secondary" onClick={() => this.completeBet(bet.id)}>
                            Complete
                        </button>
                        <button className="btn btn-danger" onClick={() => this.deleteBet(bet.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            )
        }
    }

    renderYourOpenBets = (bet) => { //renders bets you are part of that are open
        if ((sessionStorage.getItem("user") === bet.user1 ||
             sessionStorage.getItem("user") === bet.user2) &&
             bet.open === 1 && sessionStorage.getItem("user") !== null) {

            const cat_str = "card " + bet.category
            return (
                <div className="col-3" key={bet.id}>
                    <div className={cat_str} id={bet.id}>
                        <h5 className="title card-header">{bet.title}</h5>
                        <p className="description">{bet.description}</p>
                        <p className="users">{bet.user1} vs. {bet.user2}</p>
                        <button className="btn btn-danger" onClick={() => this.deleteBet(bet.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            )
        }
    }

    renderOpenBets = (bet) => { //renders any open bets that are not yours (even if they are not public)
        if (sessionStorage.getItem("user") !== bet.user1 &&
            sessionStorage.getItem("user") !== bet.user2 &&
            bet.open === 1) {

            const cat_str = "card " + bet.category
            return (
                <div className="col-3" key={bet.id}>
                    <div className={cat_str} id={bet.id}>
                        <h5 className="title card-header">{bet.title}</h5>
                        <p className="description">{bet.description}</p>
                        <p className="users">{bet.user1} vs. {bet.user2}</p>
                        <button
                            className="btn btn-success"
                            onClick={() => this.challengeBet(bet.id)}>
                            Challenge
                        </button>
                    </div>
                </div>
            );
        }
    }


    renderYourCompletedBets = (bet) => { //renders any bets that are yours and completed
        if ((sessionStorage.getItem("user") === bet.user1 ||
             sessionStorage.getItem("user") === bet.user2) &&
             bet.completed === 1) {

            const cat_str = "card " + bet.category
            return (
                <div className="col-3" key={bet.id}>
                    <div className={cat_str} id={bet.id}>
                        <h5 className="title card-header">{bet.title}</h5>
                        <p className="description">{bet.description}</p>
                        <p className="users">{bet.user1} vs. {bet.user2}</p>
                        <button className="btn btn-danger" onClick={() => this.deleteBet(bet.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            );
        }
    }

    renderPublicBets = (bet) => { //renders any public bets
        if(bet.public === 1) {

            const cat_str = "card " + bet.category
            return(
                <div className="col-3">
                    <div className={cat_str} key={bet.id} id={bet.id}>
                        <h5 className="title card-header">{bet.title}</h5>
                        <p className="description">{bet.description}</p>
                        <p className="users">{bet.user1} vs. {bet.user2}</p>
                    </div>
                </div>
            );
        }

    }

    render() {
        console.log("BETS SESSIONS:", sessionStorage.getItem("user"))
        return (
            <div className="bets">
                <hr/>

                <div className="container testimonial-group">
                    <h1>Your Ongoing Bets</h1>
                    <div className="row text-center flex-nowrap">
                        {this.state.bets.map(this.renderYourOngoingBets)}
                    </div>
                </div>
                <hr/>

                <div className="container testimonial-group">
                    <h1>Your Open Bets</h1>
                    <div className="row text-center flex-nowrap">
                        {this.state.bets.map(this.renderYourOpenBets)}
                    </div>
                </div>
                <hr/>

                <div className="container testimonial-group">
                    <h1>Open Bets</h1>
                    <div className="row text-center flex-nowrap">
                        {this.state.bets.map(this.renderOpenBets)}
                    </div>
                </div>
                <hr/>

                <div className="container testimonial-group">
                    <h1>Your Completed Bets</h1>
                    <div className="row text-center flex-nowrap">
                        {this.state.bets.map(this.renderYourCompletedBets)}
                    </div>
                </div>
                <hr/>

                <div className="container testimonial-group">
                    <h1>All Public Bets</h1>
                    <div className="row text-center flex-nowrap">
                        {this.state.bets.map(this.renderPublicBets)}
                    </div>
                </div>
            </div>
        )
    }
}

export default Bets;
