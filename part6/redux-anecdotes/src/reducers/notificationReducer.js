import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action) => {
        return action.payload
    },
    removeNotification: () => {
      return ''
    }
  }
})

const { showNotification, removeNotification } = notificationSlice.actions

export const setNotification = (text, time) => {
  return async (dispatch) => {
    dispatch(showNotification(text))
    setTimeout(() => dispatch(removeNotification()), time*1000)
  }
}


export default notificationSlice.reducer