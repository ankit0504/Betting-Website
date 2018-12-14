import React, { Component } from 'react';
import './App.css';
import Bets from './Bets.js'

const BASEURL = 'http://localhost:4000'

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      refresh:false,
      users: [],
      user: {
        username: '',
        password: ''
      },

      bet: {
        user1: sessionStorage.getItem("user"),
        user2: '',
        title: '',
        description: '',
        open: false,
        completed: false,
        public: false,
        category:'sports'
      }
    }
  }

  componentDidMount(){
    this.getUsers()
    this.render()
  }

  getUsers = _ => {
    fetch(BASEURL + '/users')
    .then(response => response.json())
    .then(response => this.setState({ users: response.data}))
    .catch(err => console.log(err))
  }

  renderUsers = ({ user_id, username, password }) => <div key={user_id}>{username} | {password} </div>

  addUser = _ => {
    const { users, user } = this.state
    for (let el in users){
      if(users[el].username === user.username) {
        console.log("Username taken.")
        return;
      }
    }
    fetch(BASEURL + '/user/add',{
      method: "POST",
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(this.getUsers)
    .catch( err => console.log(err))
  }

  refresh = _ =>{ //helps refresh the Bets Component
    this.setState({refresh:!this.state.refresh});
    console.log(this.state.refresh);
  }

  addBet = _ => {
    const {bet} = this.state
    bet.user1 = sessionStorage.getItem("user");
    console.log(bet);
    fetch(BASEURL + '/bet/add', {
      method: "POST",
      body: JSON.stringify(bet),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(this.refresh)
    .catch(err => console.log(err))
  }

  login = _ => {
    const { users, user } = this.state
    for (let el in users){
      if(users[el].username === user.username) {
        fetch(BASEURL + '/login', {
          method: "POST",
          body: JSON.stringify(user),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(function (response) {
          if(response) {
            console.log(response);
            console.log("login successful!")
            sessionStorage.setItem("user", user.username)
            const curr_user = sessionStorage.getItem("user")
            console.log("SESSION STORAGE: ", curr_user)
          }
          else {
            console.log(response);
            console.log("could not verify password")
          }
        })
        .then(this.getUsers)
        .then(this.refresh)
        .catch(error => console.error('Error:', error));
      }
    }
  }

  render() {
    const { user, bet ,refresh} = this.state
    return (
      <div className="App">
        {/* {users.map(this.renderUsers)} */}

        <div>

          <input
            value={user.username}
            onChange={e => this.setState({ user: {...user, username:e.target.value} })}
            placeholder="Username" />

          <input
            value={user.password}
            type="password"
            onChange={e => this.setState({ user: {...user, password:e.target.value}})}
            placeholder="Password"/>

          <button className="btn btn-secondary" onClick={this.addUser}>Register</button>
          <button className="btn btn-secondary" onClick={this.login}>Login</button>

        </div>
        <div>

          <input
            value={bet.title}
            onChange={e => this.setState({ bet: {...bet, title:e.target.value} })}
            placeholder="Title"
          />

          <input
            value={bet.description}
            onChange={e => this.setState({ bet: {...bet, description:e.target.value} })}
            placeholder="Description"
          />

          <label>Public?
            <input
              type="checkbox"
              onChange={e => this.setState({ bet: {...bet, public:e.target.checked} })}
              checked={bet.public}
            />
          </label>

          <label>Open?
            <input
              type="checkbox"
              onChange={e => this.setState({ bet: {...bet, open:e.target.checked} })}
              checked={bet.open}
            />
          </label>

          <select value={bet.category} onChange={e => this.setState({ bet: {...bet, category:e.target.value} })}>
            <option value="sports">Sports</option>
            <option value="entertainment">Entertainment</option>
            <option value="personal">Personal</option>
          </select>

          <input
            value={bet.open ? undefined : bet.user2}
            onChange={e => this.setState({ bet: {...bet, user2:e.target.value} })}
            placeholder="Competing User"
            hidden={bet.open}
          />

          <button className="btn btn-secondary" onClick={this.addBet}>Add Bet</button>
        </div>

        <Bets refresh = {refresh} />

      </div>
    );
  }
}

export default App;
