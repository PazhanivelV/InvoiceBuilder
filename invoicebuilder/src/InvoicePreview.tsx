import { useEffect, useState, useRef } from "react";
import { type InvoiceItems } from "./utils/InvoiceSlice";
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { type RootState } from "./utils/store";
import './App.css'


const InvoicePreview = () => {
  const navigate = useNavigate()
  const invoiceRef = useRef<HTMLDivElement>(null);

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


  const DownloadPDF = () => {
    if (!invoiceRef.current) return;
    html2pdf()
      .from(invoiceRef.current)
      .set({
        margin: 0,
        filename: `${invoiceNo}.pdf`,
        image: {
          type: "jpeg",
          quality: 1
        },
        html2canvas: {
          scale: 3,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait"
        }
      })
      .save();
  };



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
  // className="pdf-export"
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
              onClick={DownloadPDF}
              className="pdf-export rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
            >
              🖨 Print
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>

        <div
          id="invoice-preview"
          ref={invoiceRef}
          className="invoice"
        >

          <div className="invoice-header">
            <div className="company-section">
              <h1 className="company-name">
                Invoice Pro
              </h1>
              <p>Chennai, Tamil Nadu, India</p>
              <p>Email : pazhanimathesh@gmail.com</p>
            </div>

            <div className="invoice-info">
              <h2 className="invoice-title">
                TAX INVOICE
              </h2>
              <p>{invoiceNo}</p>
              <p>{invoiceDate}</p>
            </div>
          </div>
          <div className="customer-section">
            <h3 className="section-title">
              Bill To
            </h3>
            <p>{clientName}</p>
            <p>{address}</p>
          </div>
          <table className="invoice-table">
            <thead>
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
                  <td className="amount">
                    ₹ {(item.quantity * item.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="summary-wrapper">
            <div className="summary-card">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>GST ({tax}%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="summary-total">
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