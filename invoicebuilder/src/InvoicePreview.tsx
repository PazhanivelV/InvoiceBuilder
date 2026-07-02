import { useEffect, useState } from "react";
import { type InvoiceItems } from "./utils/InvoiceSlice";
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
// import html2pdf from "html2pdf.js";

import { type RootState } from "./utils/store";

const InvoicePreview = () => {
  const navigate = useNavigate()
  //const invoice = useSelector(state => state?.invoice)

  const invoice = useSelector(
  (state: RootState) => state.invoice
);

  const { id } = useParams()
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [tax, setTax] = useState(18);
  const [items, setItems] = useState<InvoiceItems[]>([
    {
      itemid: '',
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
  }

  // const downloadPDF = () => {
  //   const element = document.getElementById("invoice-preview");

  //   if (!element) return;

  //   html2pdf()
  //     .set({
  //       margin: 0.5,
  //       filename: `${invoiceNo}.pdf`,
  //       image: {
  //         type: "jpeg",
  //         quality: 1,
  //       },
  //       html2canvas: {
  //         scale: 3,
  //         useCORS: true,
  //         backgroundColor: "#ffffff",
  //       },
  //       jsPDF: {
  //         unit: "in",
  //         format: "a4",
  //         orientation: "portrait",
  //       },
  //     })
  //     .from(element)
  //     .save();
  // };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  const onClose = () => {
    navigate('/InvoiceList')
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const taxAmount = subtotal * tax / 100;
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 print:bg-white">
      <div className="mx-auto my-10 w-11/12 max-w-5xl rounded-xl bg-white shadow-2xl print:shadow-none">
        {/* Toolbar */}

        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5 print:hidden">
          <h2 className="text-2xl font-bold">
            Invoice Pro Preview
          </h2>
          <div className="space-x-3">
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
            >
              🖨 Print
            </button>
            {/* <button
              onClick={downloadPDF}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              📄 Download PDF
            </button> */}
            <button
              onClick={onClose}
              className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-10" id="invoice-preview">
          <div className="flex justify-between border-b pb-6">
            <div>
              <h1
                className="text-4xl font-bold"
                style={{ color: "#2563EB" }}
              >                Invoice Pro
              </h1>
              <p>Chennai, Tamil Nadu, India</p>
              <p>Email : pazhanimathesh@gmail.com</p>
            </div>

            <div className="text-right">
              <h2 className="text-3xl font-bold">
                TAX INVOICE
              </h2>
              <p>{invoiceNo}</p>
              <p>{invoiceDate}</p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="font-bold">
              Bill To
            </h3>
            <p>{clientName}</p>
            <p>{address}</p>
          </div>
          <table className="mt-8 w-full border">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">
                  Description
                </th>
                <th>
                  Qty
                </th>
                <th>
                  Rate
                </th>
                <th>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.itemid} className="border-b">
                  <td className="p-3">
                    {item.description}
                  </td>
                  <td className="text-center">
                    {item.quantity}
                  </td>
                  <td className="text-center">
                    ₹ {item.rate.toFixed(2)}
                  </td>
                  <td className="text-center font-semibold">
                    ₹ {(item.quantity * item.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-10 flex justify-end">
            <div className="w-80 rounded-lg border p-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="mt-2 flex justify-between">
                <span>GST ({tax}%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>

              <hr className="my-4" />
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default InvoicePreview;