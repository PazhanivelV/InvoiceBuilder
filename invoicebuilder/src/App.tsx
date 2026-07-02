
import { Route, Routes } from 'react-router-dom'
import InvoiceList from './InvoiceList';
import Invoice from './Invoice'
import InvoicePreview from './InvoicePreview'
import toast, { Toaster } from "react-hot-toast";
function App() {


  return (
    <>
      <Toaster position="top-right">
      </Toaster>
      <div className="h-screen flex flex-col">
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">

          <div className="space-y-4">
            <Routes>
              <Route path='/' element={<InvoiceList />} />
               <Route path='/InvoiceList' element={<InvoiceList />} />
              <Route path='/Invoice/:id' element={<Invoice />} />
              <Route path='/InvoicePreview/:id' element={<InvoicePreview />} />
            </Routes>
          </div>
        </main>
      </div>
    </>
  )
}

export default App
