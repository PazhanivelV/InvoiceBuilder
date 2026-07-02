import { createSlice } from "@reduxjs/toolkit";
// import { GuidGenerator } from "./GuidGenerator";
//import { useState } from "react";

export type InvoiceItems = {
    itemid: string;
    description: string;
    quantity: number;
    rate: number;
}

type InvoiceNoSeq = number;

const invoiceNoSeq: InvoiceNoSeq = 1001;

//const [InvoiceNoSeq, setInvoiceNo] = useState<number>(1);

export type Invoice = {
    id: string,
    CustomerName: string,
    InvoiceNo: string,
    Address: string,
    InoviceDate: string
    InvoiceItems: InvoiceItems[],
    Tax: number,
    TotalAmount: number
}

type InvoiceState = {
    Invoices: Invoice[];
    InvoiceNoSeq: InvoiceNoSeq
}

const initialState: InvoiceState = {
    InvoiceNoSeq: invoiceNoSeq,
    Invoices: []  
}


const InvoiceSlice = createSlice({

    name: "invoice",
    initialState,
    reducers: {
        addInvoice: (state, action) => {           
            state.Invoices.push(action.payload)
        },
        updateInvoice: (state, action) => {
            const index = state.Invoices.findIndex(
                (invoice) => invoice.id === action.payload.id
            );

            if (index !== -1) {
                state.Invoices[index] = action.payload;
            }
        },
        removeInvoice: (state, action) => {
            if (action.payload?.length > 0)
                state.Invoices = state.Invoices.filter(
                    (invoice) => invoice.id !== action.payload[0].id
                );
        },
        resetInvoice: (state) => {
            state.Invoices = [];
        },
        incrementSequnce: (state) => {
            state.InvoiceNoSeq += 1
        },
    },

})

// actions export
export const { addInvoice, updateInvoice, removeInvoice, resetInvoice, incrementSequnce } = InvoiceSlice.actions

//reducer export
export default InvoiceSlice.reducer