import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import firebase from 'firebase';

import logo from '../../images/logo_horizontal.svg';
import signin from '../../images/signin.svg';
import user from '../../images/user.svg';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: localStorage.email || '',
      password: localStorage.password || '',
      errors: [],
      errClass: false,
      errInput: false
    }

    this.handleOnEmail = this.handleOnEmail.bind(this);
    this.handleOnPassword = this.handleOnPassword.bind(this);
    this.handleOnPasswordConfirm = this.handleOnPasswordConfirm.bind(this);
    this.handleOnSignin = this.handleOnSignin.bind(this);
    this.handleOnLoginGoogle = this.handleOnLoginGoogle.bind(this);
  }

  componentDidMount() {
    firebase.auth().getRedirectResult().then(result => {
      if (result.user) {
        hashHistory.push('/dashboard');
      }
    })
  }

  handleOnEmail(e) {
    e.preventDefault();
    this.setState({ email: e.target.value })
  }

  handleOnPassword(e) {
    e.preventDefault();
    this.setState({ password: e.target.value })
  }

  handleOnPasswordConfirm(e) {
    e.preventDefault();
    const passwordInput = window.document.querySelector('.input-password');
    const icon = window.document.querySelector('.far')
    if (this.state.passView === false) {
      passwordInput.setAttribute('type', 'text')
      icon.classList.remove('fa-eye')
      icon.classList.add('fa-eye-slash')
      this.setState({ passView: true })
    } else {
      passwordInput.setAttribute('type', 'password')
      icon.classList.remove('fa-eye-slash')
      icon.classList.add('fa-eye')
      this.setState({ passView: false })
    }
  }

  handleOnSignin(e) {
    e.preventDefault();
    const { email, password } = this.state;
    const errors = [];
    const regPW = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}');
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;

    if (!email.length) {
      isValid = false;
      errors.push('メールアドレスが未入力です')
      this.setState({
        errClass: true,
        errInput: true
      })
    }
    if (!email.match(regEmail)) {
      isValid = false;
      errors.push('メールアドレスの入力形式が違います')
      this.setState({
        errClass: true,
        errInput: true,
      })
    }

    if (!password.length) {
      isValid = false;
      errors.push('パスワードが未入力です')
      this.setState({
        errClass: true,
        errInput: true
      })
    }
    if (!password.match(regPW)) {
      isValid = false;
      errors.push('パスワードの入力形式が違います')
      this.setState({
        errClass: true,
        errInput: true
      })
    }

    if (!isValid) {
      this.setState({
        errors,
        errClass: false,
        errInput: false
      })
    }

    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      localStorage.email = email;
      localStorage.password = password;
      hashHistory.push('/dashboard')
    }).catch(() => {
      this.state.errors.push('ログインに失敗しました');
      this.setState({
        errClass: true
      })
    })
  }

  handleOnLoginGoogle(e) {
    e.preventDefault();
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).catch((err) => {
      this.setState({
        errors: err
      })
    })
  }

  render() {
    const errClass = this.state.errClass === true ? 'md-text err-msg is-block' : 'md-text err-msg';
    const errInput = this.state.errInput === true ? 'md-form-input is-error' : 'md-form-input';

    return (
      <div className="l-main">
        <header className="l-header md-header">
          <div className="l-header-wrap">
            <img src={logo} alt="RIOT" className="md-img md-img-logo" />
            <Link to="/signup" className="md-btn md-btn--style01">
              <img src={user} alt="signin" className="md-icon md-icon-signin" />
              <span className="md-btn-name">登録</span>
            </Link>
          </div>
        </header>
        <section className="md-section signin-section">
          <div className="md-wrapper">
            <h2 className="md-title md-title-h2">サインイン</h2>
            <p className="md-text main-desc">登録しているメールアドレスとパスワードを入力してログインしてください。<br />Googleアカウントでのログインも可能です。</p>
            <div className="md-form-wrap signin-form">
              <form onSubmit={this.handleOnSignin} className="md-form">
                {this.state.errors.map((err, i) => {
                  return (
                    <p className={errClass} key={i}><i class="fas fa-exclamation-triangle"></i>{err}</p>
                  )
                })}
                <div className="md-form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="sample@sample.com"
                    value={this.state.email}
                    onChange={this.handleOnEmail}
                    onBlur={this.handleOnEmail}
                    className={errInput}
                  />
                </div>
                <div className="md-form-group md-form-group--pw">
                  <input
                    type="password"
                    name="password"
                    placeholder="●●●●●●●●"
                    value={this.state.password}
                    onChange={this.handleOnPassword}
                    onBlur={this.handleOnPassword}
                    className={`${errInput} input-password`}
                  />
                  <i className="far fa-eye check-pw" onClick={this.handleOnPasswordConfirm} />
                </div>
                <div className="md-form-group">
                  <button className="md-btn md-btn--style02">
                    <img src={signin} alt="user" className="md-icon md-icon-user" />
                    <span className="md-btn-name">サインイン</span>
                  </button>
                </div>
              </form>
              <button className="md-btn md-btn--styleGoogle" onClick={this.handleOnLoginGoogle}>
                <i className="fab fa-google"></i>
                <span className="md-btn-name">Google Login</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Signin;
