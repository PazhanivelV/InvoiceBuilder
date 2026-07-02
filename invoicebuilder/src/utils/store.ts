import { configureStore } from '@reduxjs/toolkit'
import InvoiceSlice from './InvoiceSlice'

const store = configureStore({
    reducer: {
        invoice: InvoiceSlice,
    }

})

export default store

// store  >> where u are going to put ur data
// slice
// reducer
// reducers
// Provider
// action
// dispatch - useDispatch hook
// hooks >>


// Step1: Configure Store  >> '@reduxjs/toolkit'
// Step2 : Store to your App >> Provider >> 'react-redux'
// Step3 : Create SLice
// Step 4: Provide SLice to the Store
// Step 5 : Check in DEv Tools for initial State Load