
import { useSelector, useDispatch } from 'react-redux'
import Invoice from './Invoice'
import { useNavigate } from "react-router-dom";
import { removeInvoice } from './utils/InvoiceSlice';
import { format } from "date-fns";
import InvoicePreview from './InvoicePreview';
import toast from "react-hot-toast";

const InvoiceList = () => {
    const navigate = useNavigate()
    const Invoices = useSelector(state => state.invoice.Invoices)
    const dispatch = useDispatch()
    // console.log(Invoices)
    const handleEdit = (id: string) => {
        navigate(`/Invoice/${id}`);
    }
    const handleDelete = (id: string) => {
        const inv = Invoices.filter(
            (x) => x.id === id
        );
        dispatch(removeInvoice(inv))

        toast.custom(() => (
            <div
                className="shadow-sm bg-white text-sm p-4 rounded-md border border-slate-200 w-max min-w-xs max-w-sm dark:bg-neutral-800 dark:border-neutral-700"
                role="alert">
                <div className="flex items-center gap-2.5 text-slate-900 font-medium dark:text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-[18px] fill-green-700 overflow-visible dark:fill-green-400"
                        viewBox="0 0 330 330" aria-hidden="true">
                        <path
                            d="M165 0C74.019 0 0 74.019 0 165s74.019 165 165 165 165-74.019 165-165S255.981 0 165 0m0 300c-74.44 0-135-60.561-135-135S90.56 30 165 30s135 60.561 135 135-60.561 135-135 135"
                            data-original="#000000" />
                        <path
                            d="m226.872 106.664-84.854 84.853-38.89-38.891c-5.857-5.857-15.355-5.858-21.213-.001-5.858 5.858-5.858 15.355 0 21.213l49.496 49.498a15 15 0 0 0 10.606 4.394h.001c3.978 0 7.793-1.581 10.606-4.393l95.461-95.459c5.858-5.858 5.858-15.355 0-21.213s-15.355-5.859-21.213-.001"
                            data-original="#000000" />
                    </svg>
                    <p>Invoice has been deleted successfully...</p>
                </div>
            </div>
        ))
    }

    return (
        <>
            <div className='flex w-full' style={{
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                height: "50px",
                alignItems: "center",
                width: "100%"
            }}>
                <div className=' flex flex-nowrap' style={{ width: "100%" }}>
                    <div style={{ width: "85%" }}>
                        <h1 className='text-3xl font-bold text-heading rounded-md h-8'>Invoice Pro Details</h1>
                    </div>

                    <div style={{ width: "15%" }} onClick={() => {
                        navigate('/Invoice/0')
                    }
                    } >
                        <button className="flex items-center gap-2 border-2 border-solid rounded-lg px-4 py-2 text-white underline">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5z" />
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
                            </svg>

                            New Invoice
                        </button>
                    </div>

                </div>

            </div>

            <div id="container" className="bg-neutral-secondary-soft">
                <table className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="bg-neutral-secondary-soft border-b border-default">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Customer Name
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Invoice No
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Inovice Date
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Total Amount (₹)
                            </th>
                            <th>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                            Invoices.map((element, row) => (
                                <tr key={row} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                    <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">

                                        {element.CustomerName}

                                    </th>
                                    <td className="px-6 py-4">
                                        {element.InvoiceNo}
                                    </td>
                                    <td className="px-6 py-4">
                                        {element.InoviceDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        {element.TotalAmount}
                                        <input type='hidden' value={element.id}></input>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className='flex'>

                                            <div className='p-2' onClick={() => { handleEdit(element.id) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 fill-current inline" viewBox="0 0 64 64" aria-hidden="true">
                                                    <path d="M9.642 44.408a2.14 2.14 0 0 1-1.513-3.653L41.571 7.313a2.14 2.14 0 1 1 3.026 3.026L11.155 43.78a2.13 2.13 0 0 1-1.513.627" />
                                                    <path d="M6.338 59.819a2.14 2.14 0 0 1-2.094-2.59l3.307-15.41a2.14 2.14 0 1 1 4.184.897L8.43 58.127a2.14 2.14 0 0 1-2.09 1.692m15.41-3.306a2.14 2.14 0 0 1-1.514-3.653l33.442-33.441a2.14 2.14 0 1 1 3.026 3.026l-33.44 33.44a2.13 2.13 0 0 1-1.515.628" />
                                                    <path d="M6.334 59.819a2.141 2.141 0 0 1-.447-4.233l15.41-3.306a2.14 2.14 0 0 1 .899 4.184L6.784 59.771a2 2 0 0 1-.45.048m42.802-30.695a2.13 2.13 0 0 1-1.513-.627L35.518 16.392a2.14 2.14 0 1 1 3.026-3.026L50.65 25.47a2.14 2.14 0 0 1-1.513 3.653m6.053-6.052a2.14 2.14 0 0 1-1.514-3.654c1.191-1.191 1.847-2.804 1.847-4.54s-.656-3.347-1.847-4.538c-1.192-1.192-2.804-1.848-4.54-1.848s-3.348.656-4.539 1.848a2.14 2.14 0 1 1-3.027-3.027c1.999-2 4.686-3.1 7.566-3.1s5.567 1.1 7.566 3.1c2 1.999 3.1 4.685 3.1 7.566s-1.1 5.567-3.1 7.566a2.13 2.13 0 0 1-1.512.627" />
                                                </svg>
                                            </div>

                                            <div className='p-2' onClick={() => { handleDelete(element.id) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 fill-current inline" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                                                    <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
                                                </svg>
                                            </div>
                                            <div className='p-2' onClick={() => { navigate(`/InvoicePreview/${element.id}`); }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                                                    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                                                    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default InvoiceList