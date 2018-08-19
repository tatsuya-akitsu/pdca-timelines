import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import firebase from 'firebase';

import GlobalHeader from './header';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      errors: []
    }

    this.handleOnLoginGoogle = this.handleOnLoginGoogle.bind(this);
  }

  componentDidMount() {
    firebase.auth().getRedirectResult().then(result => {
      if (result.user) {
        this.setState({ uid: result.user.uid })
        hashHistory.push(`/dashboard/${this.state.uid}`);
      }
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
    return (
      <div className="l-main">
        <GlobalHeader btn="signin" />
        <section className="main-section">
          <div className="md-wrapper main-wrap">
            <div className="main-thumb" />
            <div className="main-box">
              <h2 className="md-title md-title-h2">
                より分かりやすく<br />
                より使いやすくPDCAを
              </h2>
              <p className="md-text main-desc">
                日々のタスク管理、スケジュール管理、どの工数にどれだけ時間がかかっているのか、日々の業務においてどこに課題点があるのか、何故そのタスクをこなすのか。<br />
                日々の業務の生産向上、品質向上を簡単に管理していくことを目的としたサービスです。<br /><br />
                社会人1年目〜3年目の方々、業務改善を考えている方により簡単により親しみを持ってPDCAを回していけるツールです。
              </p>
              <Link to="/signup" className="md-btn md-btn--style02">
                <span className="md-btn-name">RIOTを始める</span>
              </Link>
              <p className="md-text md-text--small">
                すでにRIOTのアカウントをお持ちの方
                <Link to="/signin" className="md-link">サインインはこちらからどうぞ</Link>
              </p>
              <button className="md-btn md-btn--styleGoogle" onClick={this.handleOnLoginGoogle}>
                <i className="fab fa-google"></i>
                <span className="md-btn-name">Google Login</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Main;
