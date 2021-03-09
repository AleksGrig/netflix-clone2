import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { auth } from '../firebase'
import './SignupScreen.css'

function SignupScreen({ email }) {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const history = useHistory()

  const register = (e) => {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((authUser) => {
        //console.log(authUser)
      })
      .catch(error => alert(error.message))
  }
  const signin = (e) => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((authUser) => {
        console.log(authUser)
        history.push('/')
      })
      .catch(error => alert(error.message))
  }

  return (
    <div className="signupScreen">
      <form>
        <h1>Sign In</h1>
        <input ref={emailRef} placeholder={!email && "Email"} value={email && email} type="email" />
        <input ref={passwordRef} placeholder="Password" type="password" />
        <button type="submit" onClick={signin}>Sign In</button>
        <h4>
          <span className="signupScreen__gray">New to Netflix? </span>
          <span className="signupScreen__link" onClick={register}>Sign Up now.</span>
        </h4>
      </form>
    </div>
  )
}

export default SignupScreen
