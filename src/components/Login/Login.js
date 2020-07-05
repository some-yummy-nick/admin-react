import React, {useState} from 'react'

export const Login = ({login, lengthErr, logErr}) => {
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    login(password)
  }

  let renderLogErr, renderLengthErr

  logErr ? renderLogErr = <span className="login-error">Введен неправильный пароль!</span> : null

  lengthErr ? renderLengthErr = <span className="login-error">Пароль должен быть длиннее 5 символов</span> : null

  return <div className="login-container">
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h2 className="uk-modal-title uk-text-center">Авторизация</h2>
        <div className="uk-margin-top uk-text-lead">Пароль:</div>
        <input
          type="password"
          className="uk-input uk-margin-top"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}/>
        {renderLogErr}
        {renderLengthErr}
        <button
          className="uk-button uk-button-primary uk-margin-top"
          type="submit">Вход
        </button>
      </form>
    </div>
  </div>
}


export default Login
