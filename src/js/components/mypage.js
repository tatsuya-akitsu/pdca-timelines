import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import firebase from 'firebase';
import GlobalHeader from './header';

class Mypage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      photo: ''
    }
  }

  componentDidMount() {
    this.fetchUserData()
  }

  fetchUserData() {
    const user = firebase.auth().currentUser

    if (user != null) {
      console.log(user)
      this.setState({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      })
    }
  }

  render() {
    return (
      <div id="l-contain">
        <GlobalHeader />
        <section className="md-section md-section--mypage">
          <div className="md-wrapper">
            <h2 className="md-title md-title-h2--small">プロフィール</h2>
            <div className="md-inner">
              <div className="profile-wrap fleB">
                <img src={this.state.photo} alt="" className="user-profile-img" />
                <div className="profile-about">
                  <p className="md-text md-profile-name">{this.state.name}</p>
                  <Link to="/mypage/:uid/edit" className="md-btn md-btn--style01 btn--color04">
                    <span className="md-btn-name">プロフィール編集</span>
                  </Link>
                  <div className="profile-info">
                    <div className="profile-info-item">
                      <p className="md-text profile-label">Email</p>
                      <p className="md-text profile-email">{this.state.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Mypage
