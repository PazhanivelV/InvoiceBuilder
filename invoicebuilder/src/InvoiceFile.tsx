import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { User, Calendar, Hash, MapPin, Receipt, IndianRupee, Plus, Trash2, Save, ArrowLeft, } from "lucide-react";

import {
  addInvoice,
  incrementSequnce,
  updateInvoice,
  type Invoice,
  type InvoiceItems,
} from "./utils/InvoiceSlice";

import { GuidGenerator } from "./utils/GuidGenerator";
import { type RootState } from "./utils/store";

const InvoiceFile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const invoice = useSelector(
    (state: RootState) => state.invoice
  );

  /*---------------------------------------------------------
      STATE
  ----------------------------------------------------------*/

  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [invoiceNo, setInvoiceNo] = useState(
    "INV-0001." + invoice.InvoiceNoSeq.toString()
  );

  const [invoiceDate, setInvoiceDate] = useState("");
  const [tax, setTax] = useState(18);
  const [items, setItems] = useState<InvoiceItems[]>([
    {
      itemid: GuidGenerator.standard(),
      description: "",
      quantity: 1,
      rate: 0,
    },
  ]);

  const [errors, setErrors] = useState({
    clientName: "",
    address: "",
    invoiceDate: "",
  });

  /*---------------------------------------------------------
      VALIDATION
  ----------------------------------------------------------*/

  const validate = () => {
    const newErrors = {
      clientName: "",
      address: "",
      invoiceDate: "",
    };

    let isValid = true;
    if (!clientName.trim()) {
      newErrors.clientName = "Client Name is required";
      isValid = false;
    }
    if (!address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    if (!invoiceDate) {
      newErrors.invoiceDate = "Invoice Date is required";
      isValid = false;
    }
    if (items.length === 0) {
      toast.error("Please add at least one item.");
      isValid = false;
    }
    for (const item of items) {
      if (!item.description.trim()) {
        toast.error("Item description is required.");
        isValid = false;
        break;
      }

      if (item.quantity <= 0) {
        toast.error("Quantity must be greater than zero.");
        isValid = false;
        break;
      }

      if (item.rate <= 0) {
        toast.error("Rate must be greater than zero.");
        isValid = false;
        break;
      }
    }

    setErrors(newErrors);

    return isValid;
  };

  /*---------------------------------------------------------
      LOAD EDIT DATA
  ----------------------------------------------------------*/

  useEffect(() => {
    if (id !== "0") {
      BindInvoice();
    }
  }, []);

  const BindInvoice = () => {
    const objInvoice = invoice.Invoices.find(
      (x) => x.id === id
    );

    if (!objInvoice) return;

    setClientName(objInvoice.CustomerName);
    setAddress(objInvoice.Address);
    setInvoiceNo(objInvoice.InvoiceNo);
    setInvoiceDate(objInvoice.InoviceDate);
    setTax(objInvoice.Tax);
    setItems(objInvoice.InvoiceItems);
  };

  /*---------------------------------------------------------
      ITEM METHODS
  ----------------------------------------------------------*/

  const updateItem = (
    id: string,
    field: keyof InvoiceItems,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.itemid === id
          ? {
            ...item,
            [field]: value,
          }
          : item
      )
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        itemid: GuidGenerator.standard(),
        description: "",
        quantity: 1,
        rate: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((x) => x.itemid !== id));
  };

  /*---------------------------------------------------------
      TOTALS
  ----------------------------------------------------------*/

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
  }, [items]);

  const taxAmount = useMemo(() => {
    return subtotal * (tax / 100);
  }, [subtotal, tax]);

  const grandTotal = subtotal + taxAmount;

  const totalItems = useMemo(() => {
    return items.length;
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [items]);

  /*---------------------------------------------------------
      SAVE
  ----------------------------------------------------------*/

  const SaveInvoice = () => {
    if (!validate()) return;

    const invoiceData: Invoice = {
      id:
        id === undefined || id === "0"
          ? GuidGenerator.standard()
          : id,

      CustomerName: clientName,
      InvoiceNo: invoiceNo,
      Address: address,
      InoviceDate: invoiceDate,
      InvoiceItems: items,
      Tax: tax,
      TotalAmount: Number(grandTotal.toFixed(2)),
    };

    if (id === "0") {
      dispatch(addInvoice(invoiceData));
      dispatch(incrementSequnce());
      toast.success("Invoice created successfully.");
    } else {
      dispatch(updateInvoice(invoiceData));
      toast.success("Invoice updated successfully.");
    }
    navigate("/InvoiceList");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 py-10">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg">
                <Receipt size={28} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-800">
                  {id === "0"
                    ? "Create Invoice"
                    : "Update Invoice"}
                </h1>
                <p className="mt-1 text-slate-500">
                  Generate professional invoices in seconds.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 lg:mt-0">
            <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
              Invoice #{invoiceNo}
            </span>
          </div>
        </div>

        {/* Dashboard */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <p className="text-sm text-slate-500">
              Total Items
            </p>
            <h2 className="mt-2 text-4xl font-bold text-slate-800">
              {totalItems}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <p className="text-sm text-slate-500">
              Total Quantity
            </p>
            <h2 className="mt-2 text-4xl font-bold text-blue-600">
              {totalQuantity}
            </h2>

          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <p className="text-sm text-slate-500">
              Grand Total
            </p>
            <h2 className="mt-2 flex items-center gap-1 text-4xl font-black text-green-600">
              <IndianRupee size={28} />
              {grandTotal.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* Main */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Customer */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="mb-8 text-2xl font-bold text-slate-800">
              Customer Information
            </h2>
            <div className="grid gap-7">
              {/* Client */}
              <div>
                <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
                  <User size={18} />
                  Client Name
                </label>
                <input
                  value={clientName}
                  onChange={(e) =>
                    setClientName(e.target.value)
                  }
                  className={`w-full rounded-xl border bg-white px-4 py-3 shadow-sm transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100

                ${errors.clientName
                      ? "border-red-500"
                      : "border-slate-300"
                    }`}
                />

                {errors.clientName && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.clientName}
                  </p>
                )}
              </div>

              {/* Invoice */}

              <div>
                <label className="mb-2 flex items-center gap-2 font-semibold">
                  <Hash size={18} />
                  Invoice Number
                </label>
                <input
                  readOnly
                  value={invoiceNo}
                  className="w-full rounded-xl border bg-slate-100 px-4 py-3"
                />
              </div>

              {/* Address */}

              <div>
                <label className="mb-2 flex items-center gap-2 font-semibold">
                  <MapPin size={18} />
                  Address
                </label>
                <textarea
                  rows={4}
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  className={`w-full rounded-xl border px-4 py-3

                ${errors.address
                      ? "border-red-500"
                      : "border-slate-300"
                    }

                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100`}
                />

                {errors.address && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.address}
                  </p>
                )}

              </div>

              {/* Date */}

              <div>
                <label className="mb-2 flex items-center gap-2 font-semibold">
                  <Calendar size={18} />
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onKeyDown={(e) => e.preventDefault()}
                  onChange={(e) =>
                    setInvoiceDate(e.target.value)
                  }

                  className={`w-full rounded-xl border px-4 py-3

                ${errors.invoiceDate
                      ? "border-red-500"
                      : "border-slate-300"
                    }
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100`}

                />

                {errors.invoiceDate && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.invoiceDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}

          <div>
            <div className="sticky top-6 rounded-3xl bg-white p-8 shadow-2xl">
              <h2 className="mb-6 text-2xl font-bold">
                Invoice Summary
              </h2>
              <div className="space-y-5">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Subtotal
                  </span>
                  <span className="font-bold">
                    ₹ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div>
                  <label className="mb-2 block font-medium">
                    Tax %
                  </label>
                  <input
                    type="number"
                    value={tax}
                    onChange={(e) =>
                      setTax(Number(e.target.value))
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Tax Amount
                  </span>
                  <span className="font-bold">
                    ₹ {taxAmount.toFixed(2)}
                  </span>
                </div>
                <hr />
                <div>
                  <p className="text-sm text-slate-500">
                    Grand Total
                  </p>
                  <h1 className="mt-2 text-5xl font-black text-green-600">
                    ₹ {grandTotal.toFixed(2)}
                  </h1>
                </div>
                <button
                  onClick={SaveInvoice}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-700"

                >
                  <Save size={18} />
                  Save Invoice
                </button>
                <button

                  onClick={() =>
                    navigate("/InvoiceList")
                  }

                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-4 font-semibold transition hover:bg-slate-100"

                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Items Section */}

        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-800">
              Invoice Items
            </h2>
            <button
              onClick={addItem}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"

            >

              <Plus size={18} />
              Add Item
            </button>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Description
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Qty
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Rate
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (

                    <tr
                      key={item.itemid}
                      className={`transition hover:bg-slate-50 ${index !== items.length - 1
                          ? "border-b"
                          : ""
                        }`}
                    >

                      <td className="px-6 py-4">
                        <input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(
                              item.itemid,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Enter item description"
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.itemid,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="mx-auto w-24 rounded-xl border border-slate-300 px-3 py-3 text-center shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min={0}
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(
                              item.itemid,
                              "rate",
                              Number(e.target.value)
                            )
                          }
                          className="mx-auto w-32 rounded-xl border border-slate-300 px-3 py-3 text-center shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">

                          ₹ {(item.quantity * item.rate).toFixed(2)}

                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            removeItem(item.itemid)
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-white transition hover:bg-red-600 hover:shadow-lg"
                        >

                          <Trash2 size={18} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Summary */}

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">
                Total Items
              </p>
              <h3 className="mt-2 text-3xl font-bold">
                {totalItems}
              </h3>
            </div>
            <div>
              <p className="text-sm text-slate-500">
                Total Quantity
              </p>
              <h3 className="mt-2 text-3xl font-bold text-blue-600">
                {totalQuantity}
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Tax
              </p>
              <h3 className="mt-2 text-3xl font-bold text-orange-500">
                ₹ {taxAmount.toFixed(2)}
              </h3>
            </div>
            <div>
              <p className="text-sm text-slate-500">
                Grand Total
              </p>

              <h3 className="mt-2 text-4xl font-black text-green-600">
                ₹ {grandTotal.toFixed(2)}
              </h3>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="mt-10 flex flex-col justify-end gap-4 sm:flex-row">

          <button
            onClick={() =>
              navigate("/InvoiceList")
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 font-semibold shadow transition hover:bg-slate-100"
          >

            <ArrowLeft size={18} />

            Back

          </button>

          <button
            onClick={SaveInvoice}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-10 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700"
          >
            <Save size={18} />

            {id === "0"
              ? "Create Invoice"
              : "Update Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFile;