import React, { Component } from 'react';
import firebase from 'firebase';
import ClassNames from '../../../node_modules/classnames';

import GlobalHeader from './header';
import cloud from '../../images/cloud.svg';

class EditMypage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      editName: '',
      email: '',
      editEmail: '',
      photo: '',
      editPhoto: '',
      providerId: '',
      errors: [],
      errClass: false,
      errInput: false,
      successClass: false,
      sendSuccessClass: false
    }

    this.handleOnName = this.handleOnName.bind(this)
    this.handleOnImg = this.handleOnImg.bind(this)
    this.handleOnNameSubmit = this.handleOnNameSubmit.bind(this)
    this.handleOnThumbSubmit = this.handleOnThumbSubmit.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
  }

  componentDidMount() {
    this.fetchUserData()
  }

  fetchUserData() {
    const user = firebase.auth().currentUser

    if (user != null) {
      user.providerData.forEach((item) => {
        this.setState({
          name: item.displayName,
          email: item.email,
          photo: item.photoURL,
          provider: item.providerId
        })
      })      
    }
  }

  handleOnName(e) {
    e.preventDefault();
    this.setState({ editName: e.target.value })
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
        this.setState({ editPhoto: url })
      }).catch((err) => {
        console.log(err)
      });
    });
  }

  handleOnNameSubmit(e) {
    e.preventDefault();
    const editName = this.state.editName;
    const errors = [];
    const regName = /(ちんちん|おっぱい)/;
    let isValid = true;

    if (!editName.length) {
      isValid = false;
      errors.push('アカウント名が未入力です')
      this.setState({
        errClass: true,
        errInput: true
      })
    }
    if (regName.test(editName)) {
      isValid = false;
      errors.push('卑猥もしくは不適切な言葉が含まれています')
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

    const user = firebase.auth().currentUser
    user.updateProfile({
      displayName: editName
    }).then(() => {
      this.setState({ successClass: true })
    }).catch((err) => {
      errors.push(err)
      this.setState({
        errClass: true,
      })
    })
  }

  handleOnThumbSubmit(e) {
    e.preventDefault();
    const editPhoto = this.state.editPhoto
    const errors = []

    const user = firebase.auth().currentUser
    user.updateProfile({
      photoURL: editPhoto
    }).then(() => {
      this.setState({ successClass: true })
    }).catch((err) => {
      errors.push(err)
      this.setState({
        errClass: true,
      })
    })
  }

  handleChangePassword(e) {
    e.preventDefault();

    const auth = firebase.auth()
    const email = this.state.email
    const errors = []

    auth.sendPasswordResetEmail(email).then(() => {
      this.setState({ sendSuccessClass: true })
    }).catch((err) => {
      errors.push(err)
      this.setState({
        errClass: true,
      })
    })
  }

  render() {
    const errClass = this.state.errClass === true ? 'md-text err-msg is-block' : 'md-text err-msg';
    const errInput = this.state.errInput === true ? 'md-form-input is-error' : 'md-form-input';

    const successClass = ClassNames({
      success: true,
      isBlock: this.state.successClass === true
    })

    return (
      <div id="l-contain">
        <GlobalHeader />
        <section className="md-section md-section--mypage">
          <div className="md-wrapper">
            <h2 className="md-title md-title-h2--small">プロフィール編集</h2>
            <div className="md-inner">
              <div className="profile-wrap fleB">
                <img src={this.state.photo} alt="" className="user-profile-img" />
                <div className="profile-about">
                  <p className={`md-text success-text ${successClass}`}>プロフィールの更新が完了しました</p>
                  <form onSubmit={this.handleOnNameSubmit} className="md-form">
                    {this.state.errors.map((err, i) => {
                      return (
                        <p className={errClass} key={i}><i className="fas fa-exclamation-triangle"></i>{err}</p>
                      )
                    })}
                    <div className="md-form-group">
                      <input
                        type="text"
                        name="name"
                        placeholder={this.state.name}
                        value={this.state.editName}
                        onChange={this.handleOnName}
                        onBlur={this.handleOnName}
                        className={errInput}
                      />
                    </div>
                    <div className="md-form-group">
                      <button className="md-btn md-btn--style01 btn--color04">
                        <span className="md-btn-name">保存</span>
                      </button>
                    </div>
                  </form>
                  <form onSubmit={this.handleOnThumbSubmit} className="md-form">
                    {this.state.errors.map((err, i) => {
                      return (
                        <p className={errClass} key={i}><i className="fas fa-exclamation-triangle"></i>{err}</p>
                      )
                    })}
                    <div className="md-form-group">
                      <label>Thumbnail</label>
                      <div className="dropzone posR">
                        <div className="dropzone-inner posA">
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
                    </div>
                    <div className="md-form-group">
                      <button className="md-btn md-btn--style01 btn--color04">
                        <span className="md-btn-name">保存</span>
                      </button>
                    </div>
                  </form>
                  {this.state.provider === 'google.com' ? null : 
                    <button className="md-btn md-btn--style01" onClick={this.handleChangePassword}>パスワードを変更する</button>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default EditMypage
