import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import firebase from 'firebase';

import logo from '../../images/logo_horizontal.svg';
import signin from '../../images/signin.svg';
import cloud from '../../images/cloud.svg';
import user from '../../images/user.svg';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      passView: false,
      photoURL: '',
      errors: [],
      errClass: false,
      errInput: false
    }

    this.handleOnName = this.handleOnName.bind(this);
    this.handleOnEmail = this.handleOnEmail.bind(this);
    this.handleOnPassword = this.handleOnPassword.bind(this);
    this.handleOnPasswordConfirm = this.handleOnPasswordConfirm.bind(this);
    this.handleOnImg = this.handleOnImg.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  handleOnName(e) {
    e.preventDefault();
    this.setState({ name: e.target.value })
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
    if (this.state.passView === false) {
      passwordInput.setAttribute('type', 'test')
      this.setState({ passView: true })
    } else {
      passwordInput.setAttribute('type', 'password')
      this.setState({ passView: false })
    }
  }

  handleOnImg(e) {
    const storageRef = firebase.storage().ref();
    var uploadRef = storageRef.child(e.target.files[0].name);
    const f = e.target.files[0];
    uploadRef.put(f).then((snapshot) => {
      uploadRef.getDownloadURL().then((url) => {
        const thumbnail = window.document.querySelector('.dropzone-thumb');
        thumbnail.style.backgroundImage = "url("+url+")";
        console.log(url)
        this.setState({ photoURL: url })
      }).catch((err) => {
        console.log(err)
      });
    });
  }

  handleOnSubmit(e) {
    e.preventDefault();
    const { name, email, password, photoURL } = this.state;
    const errors = [];
    const regName = /(ちんちん|おっぱい)/;
    const regPW = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}');
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;

    if (!name.length) {
      isValid = false;
      errors.push('アカウント名が未入力です')
      this.setState({
        errClass: true,
        errInput: true
      })
    }
    if (regName.test(name)) {
      isValid = false;
      errors.push('卑猥もしくは不適切な言葉が含まれています')
      this.setState({
        errClass: true,
        errInput: true
      })
    }

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
      errors.push('パスワードは半角英数字の大文字･小文字･数字を含む8文字以上で設定をお願いします')
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
      });
      return;
    }

    console.log(this.state)

    firebase.auth().createUserWithEmailAndPassword(email, password).then(newUser => {
      return newUser.user.updateProfile({
        displayName: name,
        photoURL: photoURL
      });
    }).then(() => {
      hashHistory.push('/dashboard');
    }).catch(err => {
      this.setState({
        errors: [err.message],
        errClass: true
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
            <Link to="/signin" className="md-btn md-btn--style01">
              <img src={signin} alt="signin" className="md-icon md-icon-signin" />
              <span className="md-btn-name">サインイン</span>
            </Link>
          </div>
        </header>
        <section className="md-section signin-section">
          <div className="md-wrapper">
            <h2 className="md-title md-title-h2">
              より分かりやすく<br />
              より使いやすくPDCAを
            </h2>
            <p className="md-text main-desc">
              日々のタスク管理、スケジュール管理、どの工数にどれだけ時間がかかっているのか、日々の業務においてどこに課題点があるのか、何故そのタスクをこなすのか。<br />
              日々の業務の生産向上、品質向上を簡単に管理していくことを目的としたサービスです。<br /><br />
              社会人1年目〜3年目の方々、業務改善を考えている方により簡単により親しみを持ってPDCAを回していけるツールです。
            </p>
            <div className="md-form-wrap signin-form">
              <form onSubmit={this.handleOnSubmit} className="md-form">
                <p className={errClass}>{this.state.errors}</p>
                <div className="md-form-group">
                  <label>User Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="user name"
                    value={this.state.name}
                    onChange={this.handleOnName}
                    onBlur={this.handleOnName}
                    className={errInput}
                  />
                </div>
                <div className="md-form-group">
                  <label>Email</label>
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
                <div className="md-form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="●●●●●●●●"
                    value={this.state.password}
                    onChange={this.handleOnPassword}
                    onBlur={this.handleOnPassword}
                    className={`${errInput} posR input-password`}
                  />
                  <i
                    className="material-icons posA check-pw"
                    onClick={this.handleOnPasswordConfirm}
                  >remove_red_eye</i>
                </div>
                <div className="md-form-group">
                  <label>Thumbnail</label>
                  <div className="dropzone posR">
                    <p className="md-text upload-text">
                      <img src={cloud} alt="cloud" className="md-icon md-icon-cloud" />
                      クリックしてファイルをアップロードしてください
                    </p>
                    <input
                      type="file"
                      name="file"
                      className="posA"
                      onChange={this.handleOnImg}
                    />
                    <div className="dropzone-thumb" />
                  </div>
                </div>
                <div className="md-form-group">
                  <button className="md-btn md-btn--style02">
                    <img src={user} alt="user" className="md-icon md-icon-user" />
                    <span className="md-btn-name">登録</span>
                  </button>
                </div>
              </form>
              <p className="md-text md-text--small">
                すでにRIOTのアカウントをお持ちの方
                <Link to="/signin" className="md-link">サインインはこちらからどうぞ</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Signup;
