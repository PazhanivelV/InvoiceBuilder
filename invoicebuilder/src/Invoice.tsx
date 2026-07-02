import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { addInvoice, updateInvoice, incrementSequnce } from './utils/InvoiceSlice'
import { type InvoiceItems, type Invoice } from "./utils/InvoiceSlice";
import { GuidGenerator } from "./utils/GuidGenerator";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const Invoice = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const invoice = useSelector(state => state?.invoice)
  const navigate = useNavigate()
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("INV-0001." + invoice.InvoiceNoSeq.toString(),);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [tax, setTax] = useState(18);
  const [items, setItems] = useState<InvoiceItems[]>([
    {
      id: GuidGenerator.standard(),
      description: "",
      quantity: 1,
      rate: 0,
    },
  ]);

  useEffect(() => {
    if (id != "0") {
      BindInvoice();
    }
  }, []);


  const BindInvoice = () => {
    const objInvoice = invoice.Invoices.find((x) => x.id === id);
    if (!objInvoice) return;
    setClientName(objInvoice.CustomerName)
    setAddress(objInvoice.Address)
    setInvoiceNo(objInvoice.InvoiceNo)
    setInvoiceDate(objInvoice.InoviceDate)
    setTax(objInvoice.Tax)
    setItems(objInvoice.InvoiceItems)
  //  console.log(items)
  }

  const updateItem = (
    id: string,
    field: keyof InvoiceItems,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: GuidGenerator.standard(),
        description: "",
        quantity: 1,
        rate: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(() => {
    // debugger;

    return items?.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
  }, [items]);

  const taxAmount = useMemo(() => {
    return subtotal * (tax / 100);
  }, [subtotal, tax]);

  const grandTotal = subtotal + taxAmount;

  const SaveInvoice = () => {
    const invoiceData: Invoice = {
      id: id === "0" ? GuidGenerator.standard() : id,
      CustomerName: clientName,
      InvoiceNo: invoiceNo,
      Address: address,
      InoviceDate: invoiceDate,
      InvoiceItems: items,
      Tax: tax,
      TotalAmount: Number(grandTotal.toFixed(2))
    };
    if (id == "0") {
      dispatch(addInvoice(invoiceData))
      dispatch(incrementSequnce())
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
            <p>Invoice has been created successfully...</p>
          </div>
        </div>
      ))
    }
    else {
      dispatch(updateInvoice(invoiceData))
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
            <p>Invoice has been updated successfully...</p>
          </div>
        </div>
      ))

    }
    navigate('/InvoiceList')
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-8 text-center text-3xl font-bold">
          Invoice Pro
        </h1>
       
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-2/3">
            <div className="grid gap-6 md:grid-cols-1">

              <div>

                <label className="mb-2 block font-semibold">
                  Client Name
                </label>

                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-1/2 rounded border p-2 required"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Invoice Number
                </label>
                <input readOnly
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-1/2 rounded border p-2 required"
                />
              </div>

              <div>

                <label className="mb-2 block font-semibold">
                  Address
                </label>

                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-2/3 rounded border p-2 required"
                />
              </div>
              <div>
                <label className="mb-2 block font-semibold">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)} onKeyDown={(e) => e.preventDefault()}
                  className="w-auto rounded border p-2 required"
                />              
              </div>

            </div>
          </div>
          <div className="lg:w-1/3">
            <div className="ml-auto w-full max-w-sm rounded-xl border bg-slate-50 p-6 shadow">

              <div className="mb-3 flex justify-between">

                <span>Subtotal</span>

                <span>₹ {subtotal.toFixed(2)}</span>

              </div>

              <div className="mb-3 flex justify-between items-center">

                <span>Tax (%)</span>

                <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="w-20 rounded border p-2 required"
                />

              </div>

              <div className="mb-3 flex justify-between">

                <span>Tax Amount</span>

                <span>₹ {taxAmount.toFixed(2)}</span>

              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-xl font-bold">

                <span>Grand Total</span>

                <span>₹ {grandTotal.toFixed(2)}</span>

              </div>

            </div>
          </div>
        </div>


        {/* Items */}

        <div className="mt-10 overflow-x-auto">

          <table className="w-full border">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-3">Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
                <th><button
                  onClick={addItem}
                  className="rounded bg-green-600 px-5 py-2 text-white"
                >
                  + Add Item
                </button></th>
              </tr>
            </thead>
            <tbody>

              {items?.map((item) => (
                <tr key={item.id}>
                  <td className="p-2">
                    <input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full rounded border p-2 required"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      className="w-20 rounded border p-2 required"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "rate",
                          Number(e.target.value)
                        )
                      }
                      className="w-24 rounded border p-2 required"
                    />
                  </td>

                  <td className="font-semibold text-center">
                    ₹ {(item.quantity * item.rate).toFixed(2)}
                  </td>
                  <td>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded bg-red-500 px-3 py-2 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* Summary */}
        <button
          onClick={SaveInvoice}
          className="mt-5 rounded bg-green-600 px-5 py-2 text-white"
        >
          Save
        </button>
        <button
          onClick={() => { navigate('/InvoiceList') }}
          className="mt-5 rounded bg-green-600 px-5 py-2 text-white ml-2"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Invoice;