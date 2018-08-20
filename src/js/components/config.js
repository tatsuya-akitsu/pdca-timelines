import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import firebase from 'firebase';

import GlobalHeader from './header';

class Config extends Component {
  constructor(props) {
    super(props);
    this.db = firebase.firestore()
    this.handleDeleteUserData = this.handleDeleteUserData.bind(this)
  }

  handleDeleteUserData() {
    const user = firebase.auth().currentUser
    const uid = firebase.auth().currentUser.uid
    user.delete().then(() => {
      this.db.collection(uid).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.db.collection(uid).doc(doc.id).delete().then(() => {
            console.log('レポート削除完了')
          }).catch((error) => {
            console.log(error)
          })
        })
      })
      console.log('User data deletion complete')
      hashHistory.push('/#/')
    }).catch((error) => {
      console.log(error)
    })
  }

  render() {
    return (
      <div id="l-contain">
        <GlobalHeader />
        <section className="md-section md-section--config">
          <div className="md-wrapper">
            <h2 className="md-title md-title-h2--small">設定</h2>
            <div className="md-inner">
              <h3 className="md-title md-title-h3">アカウント削除</h3>
              <p className="md-text main-desc">
              データベースに保存されているアカウント登録情報（ユーザー名・サムネイル・メールアドレス・パスワード･PDCA）記録したデータを削除し、以降復旧は不可能になります。<br /><br />
              ※再度ご利用いただく際は<Link to="/signup" className="delete-link">新規会員登録</Link>からとなります。
              </p>
              <button className="md-btn md-btn--style01 btn--color05" onClick={this.handleDeleteUserData}>
                <span className="md-btn-name">アカウントデータと記録したデータを削除する</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Config
