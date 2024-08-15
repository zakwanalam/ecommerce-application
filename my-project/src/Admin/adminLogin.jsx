import React from 'react'
import { LoginForm } from '@/login/Login'
function Admin(props) {
  props.setAppMode('admin')
  return (
    
    <LoginForm title={'Hi Admin!'} adminStatus={true}/>
  )
}

export default Admin