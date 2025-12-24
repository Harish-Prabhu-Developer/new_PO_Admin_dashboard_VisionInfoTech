// src/pages/examplepage.jsx
import React from "react";
import Layout from "../Layout/layout";
import SupplierInfo from "../components/SupplierInfo";
import RemarksCard from "../components/RemarksCard";
import SummaryCard from "../components/SummaryCard";
import Tabs from "../components/Tabs";
import DataTable from "../components/DataTable";
import { useState, useMemo, useEffect } from "react";
import {
  Package,
  Truck,
  Calculator,
  Paperclip,
  Plus,
  Eye,
  Edit,
  Trash2,
  FolderTree,
  Calendar,
  AlignLeft,
  MoreVertical,
  Hash,
  Box,
  FileText,
  Warehouse,
  Scale,
  IndianRupee,
  Percent,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import ModelForm from "../components/ModelForm";

import { StatusBadge } from "../components/common/TableCell";

const ExamplePage = () => {
  const [activeTab, setActiveTab] = useState("Items");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingAttachment, setEditingAttachment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Loading states
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);
  const [isLoadingLogistics, setIsLoadingLogistics] = useState(false);
  const [isLoadingSupplier, setIsLoadingSupplier] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Single state for the modal form
  const [modalForm, setModalForm] = useState({
    isOpen: false,
    title: "",
    fields: [],
    submitText: "Submit",
    onSubmit: null,
    onCloseCallback: null,
  });

  // Simulate loading when tab changes
  useEffect(() => {
    if (activeTab === "Items") {
      setIsLoadingItems(true);
      setTimeout(() => setIsLoadingItems(false), 500);
    } else if (activeTab === "Attachments") {
      setIsLoadingAttachments(true);
      setTimeout(() => setIsLoadingAttachments(false), 500);
    } else if (activeTab === "Logistics") {
      setIsLoadingLogistics(true);
      setTimeout(() => setIsLoadingLogistics(false), 500);
    }
  }, [activeTab]);

  // Open modal form helper
  const openModalForm = ({ title, fields, submitText, onSubmit, onCloseCallback }) => {
    setModalForm({
      isOpen: true,
      title,
      fields,
      submitText,
      onSubmit,
      onCloseCallback,
    });
  };

  // Close modal form helper
  const closeModalForm = () => {
    if (modalForm.onCloseCallback) {
      modalForm.onCloseCallback();
    }
    setModalForm({
      isOpen: false,
      title: "",
      fields: [],
      submitText: "Submit",
      onSubmit: null,
      onCloseCallback: null,
    });
    setEditingItem(null);
    setEditingAttachment(null);
    setSelectedFile(null);
  };

  const [rows, setRows] = useState([
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
  ]);
  const [attachmentsrows, setAttachmentsRows] = useState([]);

  // Handle calculate total
  const calculateTotal = (quantity, unitPrice, discount = 0) => {
    const subtotal = quantity * unitPrice;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  // Handle supplier edit
  const handleSupplierEdit = async (data) => {
    console.log("Updated Supplier:", data);
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  };

  // Handle add item
  const handleAddItem = async (data) => {
    const newItem = {
      id: Math.max(...rows.map((r) => r.id), 0) + 1,
      item_no: data.item_no,
      description: data.description,
      whse: data.whse,
      uom_code: data.uom_code,
      uom_name: data.uom_code,
      quantity: parseFloat(data.quantity) || 0,
      unit_price: parseFloat(data.unit_price) || 0,
      qty_whse: 0,
      discount: parseFloat(data.discount) || 0,
      tax_code: data.tax_code || "GST18",
      base_entry: 0,
      qc_remark: data.qc_remark || "OK",
      price_after_discount: 0,
      total: 0,
    };

    // Calculate total
    newItem.total = calculateTotal(
      newItem.quantity,
      newItem.unit_price,
      newItem.discount
    );
    newItem.price_after_discount =
      newItem.unit_price - (newItem.unit_price * newItem.discount) / 100;

    setRows([...rows, newItem]);
    console.log("Item Added:", newItem);
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  };

  // Handle edit item
  const handleEditItem = async (data) => {
    if (!editingItem) return;

    const updatedItem = {
      ...editingItem,
      item_no: data.item_no,
      description: data.description,
      whse: data.whse,
      uom_code: data.uom_code,
      quantity: parseFloat(data.quantity) || 0,
      unit_price: parseFloat(data.unit_price) || 0,
      discount: parseFloat(data.discount) || 0,
      tax_code: data.tax_code || "GST18",
      qc_remark: data.qc_remark || "OK",
    };

    // Recalculate total
    updatedItem.total = calculateTotal(
      updatedItem.quantity,
      updatedItem.unit_price,
      updatedItem.discount
    );
    updatedItem.price_after_discount =
      updatedItem.unit_price -
      (updatedItem.unit_price * updatedItem.discount) / 100;

    setRows(rows.map((row) => (row.id === editingItem.id ? updatedItem : row)));
    console.log("Item Updated:", updatedItem);
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  };

  // Handle delete item
  const handleDeleteItem = (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setRows(rows.filter((row) => row.id !== itemId));
      console.log("Item Deleted with ID:", itemId);
    }
  };

  // Handle row selection
  const handleRowSelect = (rowId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
    updateAllSelectedStatus(newSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
      setIsAllSelected(false);
    } else {
      const allRowIds = rows.map((row) => row.id);
      setSelectedRows(new Set(allRowIds));
      setIsAllSelected(true);
    }
  };

  // Update all selected status
  const updateAllSelectedStatus = (selectedSet) => {
    const allRowIds = rows.map((row) => row.id);
    setIsAllSelected(
      selectedSet.size === allRowIds.length && allRowIds.length > 0
    );
  };

  // Get selected rows data
  const selectedRowsData = useMemo(() => {
    return rows.filter((row) => selectedRows.has(row.id));
  }, [selectedRows]);

  // Field configurations
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

  const itemFields = [
    {
      name: "item_no",
      label: "Item No",
      placeholder: "ITM-0001",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter item description",
      required: true,
    },
    {
      name: "whse",
      label: "Warehouse",
      placeholder: "MAIN",
      required: true,
    },
    {
      name: "uom_code",
      label: "UOM Code",
      placeholder: "PKT",
      required: true,
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      placeholder: "0",
      required: true,
    },
    {
      name: "unit_price",
      label: "Unit Price",
      type: "number",
      placeholder: "0.00",
      required: true,
    },
    {
      name: "discount",
      label: "Discount (%)",
      type: "number",
      placeholder: "0",
    },
    {
      name: "tax_code",
      label: "Tax Code",
      placeholder: "GST18",
    },
    {
      name: "qc_remark",
      label: "QC Remark",
      placeholder: "OK",
    },
  ];

  const attachmentFields = [
    {
      name: "path",
      label: "Target Path",
      placeholder: "/documents/po",
      required: true,
    },
    {
      name: "filename",
      label: "File Name",
      placeholder: "invoice.pdf",
      required: true,
    },
    {
      name: "attachment_date",
      label: "Attachment Date",
      type: "date",
      required: true,
    },
    {
      name: "free_text",
      label: "Remarks",
      placeholder: "Optional notes",
    },
  ];

  const attachmentColumns = [
    { key: "path", label: "Target Path", icon: FolderTree },
    { key: "filename", label: "File Name", icon: FileText },
    { key: "attachment_date", label: "Attachment Date", icon: Calendar },
    { key: "free_text", label: "Free Text", icon: AlignLeft },
    {
      key: "actions",
      label: "Actions",
      icon: MoreVertical,
      render: (_, row) => (
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingAttachment(row);
              openModalForm({
                title: "Edit Attachment",
                fields: attachmentFields.map((f) => ({
                  ...f,
                  defaultValue: row[f.name] || "",
                })),
                submitText: "Update",
                onSubmit: handleEditAttachment,
                onCloseCallback: () => setEditingAttachment(null),
              });
            }}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAttachment(row.id);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleAddAttachment = async (data) => {
    const newAttachment = {
      id: Math.max(0, ...attachmentsrows.map((a) => a.id)) + 1,
      path: data.path,
      filename: data.filename,
      attachment_date: data.attachment_date,
      free_text: data.free_text || "",
    };

    setAttachmentsRows([...attachmentsrows, newAttachment]);
    console.log("Attachment Added:", newAttachment);
    return new Promise((resolve) => setTimeout(resolve, 800));
  };

  const handleEditAttachment = async (data) => {
    if (!editingAttachment) return;

    const updated = {
      ...editingAttachment,
      ...data,
    };

    setAttachmentsRows(
      attachmentsrows.map((row) =>
        row.id === editingAttachment.id ? updated : row
      )
    );

    console.log("Attachment Updated:", updated);
    return new Promise((resolve) => setTimeout(resolve, 800));
  };

  const handleDeleteAttachment = (id) => {
    if (window.confirm("Delete this attachment?")) {
      setAttachmentsRows(attachmentsrows.filter((a) => a.id !== id));
    }
  };

  const tabs = [
    { key: "Items", label: "Items", icon: Package },
    { key: "Logistics", label: "Logistics", icon: Truck },
    { key: "Accounting", label: "Accounting", icon: Calculator },
    { key: "Attachments", label: "Attachments", icon: Paperclip },
  ];

  const columns = [
    {
      key: "selection",
      label: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      ),
      align: "text-center",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedRows.has(row.id)}
          onChange={() => handleRowSelect(row.id)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
      ),
    },
    { key: "id", label: "S.No", icon: Hash },
    { key: "item_no", label: "Item No", icon: Box },
    {
      key: "description",
      label: "Description",
      icon: FileText,
    },
    {
      key: "whse",
      label: "Whse",
      align: "text-right",
      icon: Warehouse,
    },
    {
      key: "quantity",
      label: "Qty",
      align: "text-right",
      icon: Scale,
    },
    {
      key: "unit_price",
      label: "Unit Price",
      align: "text-right",
      icon: IndianRupee,
      render: (value) => (
        <span className="font-semibold text-slate-900">₹ {value.toFixed(2)}</span>
      ),
    },
    {
      key: "discount",
      label: "Discount",
      align: "text-center",
      icon: Percent,
      render: (value) => (
        <span className="text-amber-600 font-semibold">{value}%</span>
      ),
    },
    {
      key: "qc_remark",
      label: "QC Status",
      icon: BadgeCheck,
      render: (value) => (
        <StatusBadge value={value === "OK" ? "Active" : "Pending"} />
      ),
    },
    {
      key: "total",
      label: "Total",
      align: "text-center",
      icon: IndianRupee,
      render: (value) => (
        <span className="font-bold text-slate-900">₹ {value.toFixed(2)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "text-left",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("View:", row);
            }}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingItem(row);
              openModalForm({
                title: "Edit Item",
                fields: itemFields.map((field) => ({
                  ...field,
                  defaultValue: row[field.name] || "",
                })),
                submitText: "Update Item",
                onSubmit: handleEditItem,
                onCloseCallback: () => setEditingItem(null),
              });
            }}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
            title="Edit Item"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteItem(row.id);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
            title="Delete Item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Layout
        header={
          <div className="flex flex-col sm:flex-row min-w-full items-start sm:items-center justify-between gap-3">
            <div className="flex-1 w-full">
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
                onEdit={() => {
                  openModalForm({
                    title: "Edit Supplier",
                    fields: supplierFields,
                    submitText: "Update Supplier",
                    onSubmit: handleSupplierEdit,
                  });
                }}
              />
            </div>
          </div>
        }
        footer={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
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
        }
      >
        {/* Modern Card Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden my-2">
          {/* Enhanced Tabs */}
          <div className="px-6 pt-4">
            {/* Add Item Button */}
            <div className="flex items-center justify-between ">
              <h3 className="text-lg font-semibold text-slate-900">Items</h3>
              {activeTab === "Items" && (
                <button
                  onClick={() => {
                    openModalForm({
                      title: "Add New Item",
                      fields: itemFields,
                      submitText: "Add Item",
                      onSubmit: handleAddItem,
                    });
                  }}
                  className="animate-fade-right animate-once animate-ease-out flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  title="Add a new item"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Item</span>
                </button>
              )}
            </div>
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {/* Tab Content */}
          <div className="p-1">
            {activeTab === "Items" && (
              <DataTable
                columns={columns}
                data={rows}
                itemsPerPage={7}
                onRowClick={(row) => console.log("Row clicked:", row)}
                className="border-0"
              />
            )}
            {activeTab === "Logistics" && (
              <DataTable
                columns={[
                  { key: "key", label: "" },
                  { key: "value", label: "" },
                ]}
                data={[
                  { key: "Ship To", value: "10974 KISONGO" },
                  { key: "Bill To", value: "ACCOUNTS DEPT - ARUSHA" },
                  { key: "Delivery Date", value: "2025-12-30" },
                  { key: "Shipping Type", value: "Road Transport" },
                  { key: "Transport Mode", value: "Truck" },
                  { key: "Incoterms", value: "DAP" },
                  { key: "Tracking No", value: "" },
                  { key: "Vehicle No", value: "" },
                  { key: "Warehouse", value: "MAIN" },
                ]}
                itemsPerPage={7}
                className="border"
              />
            )}

            {activeTab === "Accounting" && (
              <div className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Accounting Details
                  </h3>
                  <p className="text-slate-600">
                    Manage taxes, payment terms, and financial information.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "Attachments" && (
              <>
                <div className="flex justify-end px-4 py-2">
                  <button
                    onClick={() => {
                      openModalForm({
                        title: "Add Attachment",
                        fields: attachmentFields,
                        submitText: "Add Attachment",
                        onSubmit: handleAddAttachment,
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={16} />
                    Add Attachment
                  </button>
                </div>

                <DataTable
                  columns={attachmentColumns}
                  data={attachmentsrows}
                  itemsPerPage={7}
                  className="border-0"
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <img
                      src="https://placehold.co/180x100?text=No+Attachments"
                      alt="No attachments"
                      className="rounded-md opacity-80"
                    />
                    <p className="text-sm font-semibold text-slate-700">
                      No attachments found
                    </p>
                    <p className="text-xs text-slate-500">
                      Upload documents related to this purchase order.
                    </p>
                    <button
                      onClick={() => {
                        openModalForm({
                          title: "Add Attachment",
                          fields: attachmentFields,
                          submitText: "Add Attachment",
                          onSubmit: handleAddAttachment,
                        });
                      }}
                      className="text-blue-600 text-xs font-medium"
                    >
                      Upload Attachment
                    </button>
                  </div>
                </DataTable>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Items</p>
                <p className="text-2xl font-bold text-slate-800">
                  {rows.length}
                </p>
              </div>
              <Box className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-linear-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-slate-800">
                  ₹ {rows.reduce((sum, row) => sum + row.total, 0).toFixed(2)}
                </p>
              </div>
              <IndianRupee className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-linear-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Avg Discount</p>
                <p className="text-2xl font-bold text-slate-800">
                  {(
                    rows.reduce((sum, row) => sum + row.discount, 0) /
                      rows.length || 0
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <Percent className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">QC Pass Rate</p>
                <p className="text-2xl font-bold text-slate-800">
                  {(
                    (rows.filter((row) => row.qc_remark === "OK").length /
                      rows.length) *
                    100
                  ).toFixed(0)}
                  %
                </p>
              </div>
              <BadgeCheck className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </Layout>

      {/* Single ModelForm instance */}
      <ModelForm
        isOpen={modalForm.isOpen}
        onClose={closeModalForm}
        title={modalForm.title}
        fields={modalForm.fields}
        submitText={modalForm.submitText}
        onSubmit={modalForm.onSubmit}
      />
    </>
  );
};

export default ExamplePage;