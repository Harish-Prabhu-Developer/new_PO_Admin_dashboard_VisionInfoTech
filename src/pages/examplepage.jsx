// src/pages/examplepage.jsx
import React from "react";
import Layout from "../Layout/layout";
import SupplierInfo from "../components/SupplierInfo";
import RemarksCard from "../components/RemarksCard";
import SummaryCard from "../components/SummaryCard";
import Tabs from "../components/Tabs";
import DataTable from "../components/DataTable";
import { useState } from "react";
import { Package,Truck,Calculator,Paperclip} from "lucide-react";
import ActionButtons from "../components/ActionButtons";
import ModelForm from "../components/ModelForm";


const ExamplePage = () => {
  const [activeTab, setActiveTab] = useState("Items");
const [isEditOpen, setIsEditOpen] = useState(false);
const handleSupplierEdit = async (data) => {
  console.log("Updated Supplier:", data);

  // simulate API call
  return new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
};

const supplierFields = [
  {
    name: "name",
    label: "Supplier Name",
    defaultValue: "JOSEPHAT ANDREA SHAYO",
    required: true,
  },
  {
    name: "code",
    label: "Supplier Code",
    defaultValue: "LOCS100104",
    required: true,
  },
  {
    name: "contact",
    label: "Contact Person",
    defaultValue: "JOSEPHAT",
  },
];
  const tabs = [
  { key: "Items", label: "Items", icon: Package },
  { key: "Logistics", label: "Logistics", icon: Truck },
  { key: "Accounting", label: "Accounting", icon: Calculator },
  { key: "Attachments", label: "Attachments", icon: Paperclip },
];

  const columns = [
    { key: "id", label: "S.No", align: "text-left" },
    { key: "item_no", label: "Item No", align: "text-left" },
    { key: "description", label: "Description", align: "text-left" },
    { key: "whse", label: "Whse", align: "text-right" },
    { key: "uom_code", label: "Uom Code", align: "text-right" },
    { key: "uom_name", label: "Uom Name", align: "text-right" },
    { key: "quantity", label: "Quantity", align: "text-right" },
    { key: "unit_price", label: "Unit Price", align: "text-right" },
    { key: "qty_whse", label: "Qty In Whse", align: "text-right" },
    { key: "discount", label: "Discount %", align: "text-right" },
    { key: "tax_code", label: "Tax Code", align: "text-right" },
    { key: "base_entry", label: "Base Entry", align: "text-right" },
    { key: "qc_remark", label: "Qc Remark", align: "text-right" },
    {
      key: "price_after_discount",
      label: "Price After Discount",
      align: "text-right",
    },
    { key: "total", label: "Total", align: "text-right" },
  ];

  const rows = [
    {
      id: 1,
      item_no: "ITM-0001",
      description: "A4 Copier Paper 80 GSM",
      whse: "MAIN",
      uom_code: "PKT",
      uom_name: "Packet",
      quantity: 10,
      unit_price: 250.0,
      qty_whse: 325,
      discount: 5,
      tax_code: "GST18",
      base_entry: 1001,
      qc_remark: "OK",
      price_after_discount: 237.5,
      total: 2375.0,
    },
    {
      id: 2,
      item_no: "ITM-0002",
      description: "Blue Ball Pen - 0.7mm",
      whse: "MAIN",
      uom_code: "BOX",
      uom_name: "Box",
      quantity: 5,
      unit_price: 120.0,
      qty_whse: 80,
      discount: 0,
      tax_code: "GST12",
      base_entry: 1002,
      qc_remark: "OK",
      price_after_discount: 120.0,
      total: 600.0,
    },
    {
      id: 3,
      item_no: "ITM-0003",
      description: "Stapler Machine Medium",
      whse: "ST02",
      uom_code: "NOS",
      uom_name: "Nos",
      quantity: 2,
      unit_price: 350.0,
      qty_whse: 25,
      discount: 10,
      tax_code: "GST18",
      base_entry: 1003,
      qc_remark: "Packing dented",
      price_after_discount: 315.0,
      total: 630.0,
    },
    {
      id: 4,
      item_no: "ITM-0004",
      description: "Brown Packing Tape 2 inch",
      whse: "ST02",
      uom_code: "ROL",
      uom_name: "Roll",
      quantity: 12,
      unit_price: 45.0,
      qty_whse: 140,
      discount: 0,
      tax_code: "GST18",
      base_entry: 1004,
      qc_remark: "OK",
      price_after_discount: 45.0,
      total: 540.0,
    },
    {
      id: 5,
      item_no: "ITM-0005",
      description: "Corrugated Box 12x12x12",
      whse: "MAIN",
      uom_code: "NOS",
      uom_name: "Nos",
      quantity: 20,
      unit_price: 60.0,
      qty_whse: 200,
      discount: 7.5,
      tax_code: "GST18",
      base_entry: 1005,
      qc_remark: "Size verified",
      price_after_discount: 55.5,
      total: 1110.0,
    },
    {
      id: 6,
      item_no: "ITM-0006",
      description: "Gel Pen Black - 0.5mm",
      whse: "MAIN",
      uom_code: "BOX",
      uom_name: "Box",
      quantity: 4,
      unit_price: 150.0,
      qty_whse: 60,
      discount: 5,
      tax_code: "GST12",
      base_entry: 1006,
      qc_remark: "OK",
      price_after_discount: 142.5,
      total: 570.0,
    },
    {
      id: 7,
      item_no: "ITM-0007",
      description: "Highlighter Pen Assorted",
      whse: "ST02",
      uom_code: "PKT",
      uom_name: "Packet",
      quantity: 3,
      unit_price: 220.0,
      qty_whse: 35,
      discount: 0,
      tax_code: "GST18",
      base_entry: 1007,
      qc_remark: "Color checked",
      price_after_discount: 220.0,
      total: 660.0,
    },
    {
      id: 8,
      item_no: "ITM-0008",
      description: "Spiral Notebook A5 200 Pages",
      whse: "MAIN",
      uom_code: "NOS",
      uom_name: "Nos",
      quantity: 15,
      unit_price: 85.0,
      qty_whse: 120,
      discount: 10,
      tax_code: "GST12",
      base_entry: 1008,
      qc_remark: "OK",
      price_after_discount: 76.5,
      total: 1147.5,
    },
    {
      id: 9,
      item_no: "ITM-0009",
      description: "Whiteboard Marker Red",
      whse: "ST02",
      uom_code: "BOX",
      uom_name: "Box",
      quantity: 6,
      unit_price: 180.0,
      qty_whse: 48,
      discount: 5,
      tax_code: "GST18",
      base_entry: 1009,
      qc_remark: "Ink level checked",
      price_after_discount: 171.0,
      total: 1026.0,
    },
    {
      id: 10,
      item_no: "ITM-0010",
      description: "Whiteboard Duster Magnetic",
      whse: "MAIN",
      uom_code: "NOS",
      uom_name: "Nos",
      quantity: 8,
      unit_price: 95.0,
      qty_whse: 40,
      discount: 0,
      tax_code: "GST18",
      base_entry: 1010,
      qc_remark: "OK",
      price_after_discount: 95.0,
      total: 760.0,
    },
    {
      id: 11,
      item_no: "ITM-0011",
      description: "Office Scissors 8 inch",
      whse: "ST02",
      uom_code: "NOS",
      uom_name: "Nos",
      quantity: 5,
      unit_price: 130.0,
      qty_whse: 30,
      discount: 7.5,
      tax_code: "GST18",
      base_entry: 1011,
      qc_remark: "Blade sharp",
      price_after_discount: 120.25,
      total: 601.25,
    },
    {
      id: 12,
      item_no: "ITM-0012",
      description: "Paper Clips 35mm",
      whse: "MAIN",
      uom_code: "BOX",
      uom_name: "Box",
      quantity: 12,
      unit_price: 40.0,
      qty_whse: 150,
      discount: 5,
      tax_code: "GST12",
      base_entry: 1012,
      qc_remark: "OK",
      price_after_discount: 38.0,
      total: 456.0,
    },
    {
      id: 13,
      item_no: "ITM-0013",
      description: "Binder Clips Medium",
      whse: "MAIN",
      uom_code: "BOX",
      uom_name: "Box",
      quantity: 9,
      unit_price: 75.0,
      qty_whse: 90,
      discount: 0,
      tax_code: "GST18",
      base_entry: 1013,
      qc_remark: "OK",
      price_after_discount: 75.0,
      total: 675.0,
    },
    {
      id: 14,
      item_no: "ITM-0014",
      description: "Sticky Notes 3x3 Yellow",
      whse: "ST02",
      uom_code: "PKT",
      uom_name: "Packet",
      quantity: 10,
      unit_price: 60.0,
      qty_whse: 110,
      discount: 10,
      tax_code: "GST12",
      base_entry: 1014,
      qc_remark: "Adhesive checked",
      price_after_discount: 54.0,
      total: 540.0,
    },
    {
      id: 15,
      item_no: "ITM-0015",
      description: "Desk Organizer Plastic",
      whse: "MAIN",
      uom_code: "NOS",
      uom_name: "Nos",
      quantity: 4,
      unit_price: 320.0,
      qty_whse: 22,
      discount: 5,
      tax_code: "GST18",
      base_entry: 1015,
      qc_remark: "No cracks",
      price_after_discount: 304.0,
      total: 1216.0,
    },
  ];
  return (
<>
    <Layout
      header={
        <div className="flex flex-col sm:flex-row min-w-full items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <SupplierInfo
              supplier={{
                name: "JOSEPHAT ANDREA SHAYO",
                code: "LOCS100104",
                contact: "JOSEPHAT",
              }}
              po={{
                "PO Number": "3517",
                Status: "Open; Printed",
                "Posting Date": "08.12.25",
                "Delivery Date": "30.12.25",
                "Document Date": "08.12.25",
              }}
               onEdit={() => setIsEditOpen(true)}
            />
            
          </div>
        </div>
      }
      footer={
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <RemarksCard remarks="For PFL AGRO1 stitching machine motor rewinding purpose." />
            <SummaryCard
              summary={[
                { label: "Total Before Discount", value: "TZS 360,000.00" },
                { label: "Discount", value: "0%" },
                { label: "Freight", value: "TZS 0.00" },
                { label: "Tax", value: "TZS 0.00" },
                { label: "Total Payment Due", value: "TZS 360,000.00" },
              ]}
            />
          </div>
         
        </div>
      }
    >
      <ActionButtons/>
      <div className="bg-white rounded-lg my-4 shadow-sm ">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "Items" && <DataTable columns={columns} data={rows} />}
      {activeTab === "Logistics" && (<div className="p-6 text-center text-slate-600">Logistics Content</div>)}
      {activeTab === "Accounting" && (<div className="p-6 text-center text-slate-600">Accounting Content</div>)}
      {activeTab === "Attachments" && (<div className="p-6 text-center text-slate-600">Attachments Content</div>)}

    </div>

    </Layout>
          <ModelForm
  isOpen={isEditOpen}
  onClose={() => setIsEditOpen(false)}
  title="Edit Supplier"
  fields={supplierFields}
  submitText="Update Supplier"
  onSubmit={handleSupplierEdit}
/>

</>
  );
};

export default ExamplePage;
