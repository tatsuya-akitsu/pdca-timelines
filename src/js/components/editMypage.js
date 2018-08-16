import React, { Component } from 'react';
import firebase from 'firebase';

import GlobalHeader from './header';
import SuccessBaloon from './successBaloon';
import ErrBaloon from './errbaloon';
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
      nameErrors: [],
      thumbErrors: [],
      errors: [],
      errClass: false,
      errInput: false,
      nameSuccess: [],
      thumbSuccess: [],
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
    const nameErrors = [];
    const regName = /(ちんちん|おっぱい)/;
    let isValid = true;

    const errDOM = document.getElementsByClassName('err-name')
    const sucDOM = document.getElementsByClassName('name-success')

    if (!editName.length) {
      isValid = false;
      nameErrors.push('アカウント名が未入力です')
      for (let i = 0; i < errDOM.length; i++) {
        errDOM[i].classList.add('is-block')
      }
      this.setState({
        errClass: false,
        errInput: false
      })
    }
    if (regName.test(editName)) {
      isValid = false;
      nameErrors.push('卑猥もしくは不適切な言葉が含まれています')
      for (let i = 0; i < errDOM.length; i++) {
        errDOM[i].classList.add('is-block')
      }
      this.setState({
        errClass: false,
        errInput: false
      })
    }
    if (!isValid) {
      this.setState({
        nameErrors,
        errClass: true,
        errInput: true
      })
      return;
    }

    const user = firebase.auth().currentUser
    user.updateProfile({
      displayName: editName
    }).then(() => {
      this.state.nameSuccess.push('ユーザー名を変更しました')
      for (let i = 0; i < sucDOM.length; i++) {
        sucDOM[i].classList.add('is-block')
      }
      this.setState({ successClass: true })
    }).catch((err) => {
      nameErrors.push(err)
      this.setState({
        errClass: true,
      })
    })
  }

  handleOnThumbSubmit(e) {
    e.preventDefault();
    const editPhoto = this.state.editPhoto
    const thumbErrors = []
    let isValid = true;

    const errDOM = document.getElementsByClassName('err-thumb')
    const sucDOM = document.getElementsByClassName('thumb-success')

    if (!editPhoto.length) {
      isValid = false;
      thumbErrors.push('画像をアップロードしてください')
      for (let i = 0; i < errDOM.length; i++) {
        errDOM[i].classList.add('is-block')
      }
      this.setState({
        errClass: false,
        errInput: false
      })
    }
    if (!isValid) {
      this.setState({
        thumbErrors,
        errClass: true,
        errInput: true
      })
      return;
    }

    const user = firebase.auth().currentUser
    user.updateProfile({
      photoURL: editPhoto
    }).then(() => {
      this.state.thumbSuccess.push('アイコンを変更しました')
      for (let i = 0; i < sucDOM.length; i++) {
        sucDOM[i].classList.add('is-block')
      }
      this.setState({ successClass: true })
    }).catch((err) => {
      thumbErrors.push(err)
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

    const sucDOM = document.getElementsByClassName('mail-success')

    auth.sendPasswordResetEmail(email).then(() => {
      this.setState({ sendSuccessClass: true })
      for (let i = 0; i < sucDOM.length; i++) {
        sucDOM[i].classList.add('is-block')
      }
    }).catch((err) => {
      errors.push(err)
      this.setState({
        errClass: true,
      })
    })
  }

  render() {
    const errInput = this.state.errInput === true ? 'md-form-input is-error' : 'md-form-input';

    return (
      <div id="l-contain">
        <GlobalHeader />
        <p className="md-text success-text mail-success">パスワード変更用メールを送信しました。メールに沿って進めてください。</p>
        <ErrBaloon className="md-text err-msg" name="err-name" items={this.state.nameErrors} />
        <ErrBaloon className="md-text err-msg" name="err-thumb" items={this.state.thumbErrors} />
        <SuccessBaloon className="md-text success-text" name="name-success" items={this.state.nameSuccess} />
        <SuccessBaloon className="md-text success-text" name="thumb-success" items={this.state.thumbSuccess} />
        <section className="md-section md-section--mypage">
          <div className="md-wrapper">
            <h2 className="md-title md-title-h2--small">プロフィール編集</h2>
            <div className="md-inner">
              <div className="profile-wrap fleB">
                <img src={this.state.photo} alt="" className="user-profile-img" />
                <div className="profile-about">
                  <form onSubmit={this.handleOnNameSubmit} className="md-form">
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
                    <button className="md-btn md-btn--style01 btn--changePassword" onClick={this.handleChangePassword}>
                      <span className="md-btn-name">パスワードを変更する</span>
                    </button>
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
