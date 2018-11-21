import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import ClassNames from '../../../node_modules/classnames';
import firebase from 'firebase';

import logo from '../../images/logo_horizontal.svg';
import signin from '../../images/signin.svg';
import user from '../../images/user.svg';
import dashboard from '../../images/dashboard.svg';
import reports from '../../images/reports.svg';
import userIcon from '../../images/user_white.svg';
import settings from '../../images/settings.svg';
import logout from '../../images/logout.svg';

class GlobalHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      name: '',
      photo: null,
      login: false,
      items: [
        {
          link: '/dashboard',
          img: `${dashboard}`,
          imgClass: 'md-icon md-icon-dashboard',
          name: 'ダッシュボード'
        },
        {
          link: '/reports',
          img: `${reports}`,
          imgClass: 'md-icon md-icon-reports',
          name: 'PDCA'
        }
      ],
      focused: 0
    }

    this.handleLogout = this.handleLogout.bind(this)
    this.handleModal = this.handleModal.bind(this)
  }

  componentDidMount() {
    this.handleLoginUser()
  }

  fetchUserData() {
    const user = firebase.auth().currentUser

    if (user != null) {
      this.setState({
        uid: user.uid,
        name: user.displayName,
        photo: user.photoURL
      })
    }
  }

  handleLoginUser() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ login: true })
        this.fetchUserData()
      } else {
        this.setState({ login: false })
      }
    })
  }

  handleCurrentIndex(index) {
    this.setState({ focused: index })
  }

  handleModal(e) {
    e.preventDefault()
    const modal = document.getElementsByClassName('user-nav-wrap')
    modal[0].classList.toggle('is-open')
  }

  handleLogout(e) {
    e.preventDefault()
    firebase.auth().signOut().then(() => {
      this.props.history.push('/')
    }).then((err) => {
      console.log(err)
    })
  }

  render() {
    const bgColorClass = ClassNames({
      header: true,
      isLogined : this.state.login === true
    });

    return (
      <header className={`l-header md-header ${bgColorClass}`}>
        <div className="l-header-wrap">
          <Link to="/" className="main-logo-link">
            <img src={logo} alt="RIOT" className="md-img md-img-logo" />
          </Link>
          {this.state.login === false ? 
            this.props.btn === 'signin' ? 
              <Link to="/signin" className="md-btn md-btn--style01">
                <img src={signin} alt="signin" className="md-icon md-icon-signin" />
                <span className="md-btn-name">サインイン</span>
              </Link>
              : <Link to="/signup" className="md-btn md-btn--style01">
                <img src={user} alt="signin" className="md-icon md-icon-signin" />
                <span className="md-btn-name">登録</span>
              </Link>
          : 
            <div className="md-header-nav fleB posR">
              <nav className="md-nav">
                <ul className="md-nav-list fleB">
                  {this.state.items.map((item, index) => {
                    let isFocused = ''
                    if (this.state.focused === index) {
                      isFocused = 'isFocused'
                    }
                    return (
                      <li className="md-nav-item" key={index}>
                        <Link to={item.link} className={`md-nav-link ${isFocused}`} onClick={this.handleCurrentIndex.bind(this, index)}>
                          <img src={item.img} alt="" className={item.imgClass} />
                          <span className="md-nav-name">{item.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
              <img src={this.state.photo} alt="" className="user-img" onClick={this.handleModal} />
              <div className="user-nav-wrap posA">
                <div className="user-nav-inner">
                  <p className="md-text user-name">{this.state.name}</p>
                  <ul className="user-nav-list">
                    <li className="user-nav-item">
                      <Link to={`/mypage/${this.state.uid}`} className="user-nav-link">
                        <img src={userIcon} alt="" className="md-icon md-icon-userIcon" />
                        <span className="user-nav-name">プロフィール</span>
                      </Link>
                    </li>
                    <li className="user-nav-item">
                      <Link to={`/settings/${this.state.uid}`} className="user-nav-link">
                        <img src={settings} alt="" className="md-icon md-icon-settings" />
                        <span className="user-nav-name">設定</span>
                      </Link>
                    </li>
                    <li className="user-nav-item">
                      <button className="user-nav-link" onClick={this.handleLogout}>
                        <img src={logout} alt="" className="md-icon md-icon-logout" />
                        <span className="user-nav-name">ログアウト</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          }
        </div>
      </header>
    );
  }
}

export default withRouter(GlobalHeader)
