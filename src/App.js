import React, { Component } from 'react';
import logo from './logo.svg';
// import Login from './Login.js';
import Test from './unsign.js';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: ['Nie zalogowany'],
      protected: ['ukryta'],
      token: 0,
    }
  }
  componentDidMount() {
    this.statusToken()
  }
  statusToken(){
      axios.get('http://localhost:1337/status', {
        headers: {
          'Content-Typ': 'application/json',
          'Authorization': localStorage.getItem('Authorization'),
        },
      })
      .then(response => {
        var status = response.data.status;
        if (status === 'success') {
          this.setState({
            status: 'zalogowany!',
            protected: 'widoczna',
          })
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          status: 'Nie zalogowany',
          protected: 'ukryta',
        })
      });
  }

  login(){
    axios.post('http://localhost:1337/login', {
        'email': 'test@test.com',
        'password': 'test',
    })
    .then(response => {
      console.log('dodałem token do localStorage, zalogowano');
      var status = response.data.status;
      var token = response.data.token;
      if(status === 'success') {
        localStorage.setItem('Authorization', 'Token ' + token);
        this.statusToken()
      }
    })
    .catch(error => {
      console.log(error);
      console.log('Dane niepoprawne, spróbuj ponownie');
    });
  }


  register(){ 
    axios({
      method: 'post',
      url: 'http://localhost:1337/register',
      headers: {'Content-Typ': 'application/json'},
      data: {
        email: 'test@test.com',
        password: 'test',
      }
    }).then(response => {
      console.log(response);
      var status = response.data.status;
      var token = response.data.token;
      if(status === 'success') {
        console.log('Podałeś wszystkie poprawne dane, zarejestrowano');
        localStorage.setItem('Authorization', 'Token ' + token);
        this.statusToken();
      } else {
        console.log('Uzupełni wszystkie dane, nie zarejestrowano');
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  logOut(){
    localStorage.removeItem('Authorization');
    this.statusToken();
  }
  // register(){ 
  //   axios.post('http://localhost:1337/register', {
  //       email: 'test@test.com',
  //       password: 'test',
  //   })
    // .then(response => {
    //   console.log(response);
    // })
    // .catch(error => {
    //   console.log(error);
    // });
  // }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Obecnie jesteś: {this.state.status}</h1>
        </header>
        <p className="App-intro">
          Aplikacja napisana w celu poznania API oraz TOKEN.<br/>
          <button onClick={this.register.bind(this)}>rejestracja</button><br/>
          <button onClick={this.login.bind(this)}>login</button><br/>
          <button onClick={this.statusToken.bind(this)}>status</button><br/>
          <button onClick={this.logOut.bind(this)}>wyloguj</button>
          </p>
          <Test protected={this.state.protected} />
      </div>
    );
  }
}

export default App;
