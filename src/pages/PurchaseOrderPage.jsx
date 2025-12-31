import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../Layout/layout";
import SupplierInfo from "../components/SupplierInfo";
import ModelForm from "../components/ModelForm";
import { fetchPOHeaders, updatePOHeader, fetchPOHeaderByRef } from "../redux/Slice/PO/poHeaderSlice";
import useUser from "../hooks/useUser";
import { formatMonthDayYear } from "../utils/DateUtils";
import Tabs from "../components/Tabs";
import { Package, Truck, Calculator, Paperclip, Plus, Edit, Trash2, Eye, Hash, FileText, Scale, IndianRupee, Percent, BadgeCheck, Box, Warehouse, MoreVertical, Calendar, AlignLeft } from "lucide-react";
import { fetchPODetails1ByRef, createPODetail1, updatePODetail1, deletePODetail1 } from "../redux/Slice/PO/poDetail1Slice";
import { fetchPODetails2ByRef, createPODetail2, updatePODetail2, deletePODetail2 } from "../redux/Slice/PO/poDetail2Slice";
import { fetchPODetails3ByRef, createPODetail3, updatePODetail3, deletePODetail3 } from "../redux/Slice/PO/poDetail3Slice";
import { fetchPODetails4, createPODetail4, updatePODetail4, deletePODetail4 } from "../redux/Slice/PO/poDetail4Slice";
import toast from "react-hot-toast";
import DataTable from "../components/DataTable";
import RemarksCard from "../components/RemarksCard";
import SummaryCard from "../components/SummaryCard";

const INITIAL_FORM = {
  po_ref_no: "",
  po_date: "",
  purchase_type: "",
  company_id: "",
  supplier_id: "",
  remarks: "",
  created_by: "",
  supplier_name: "",
  supplier_code: "",
  contact_person: "",
  status: "",
  posting_date: "",
  delivery_date: "",
  document_date: ""
};

const PurchaseOrderPage = () => {
  const dispatch = useDispatch();
  const { username } = useUser();

  // Redux selectors
  const poHeaderState = useSelector((state) => state.poHeader);
  const poDetail1State = useSelector((state) => state.poDetail1);
  const poDetail2State = useSelector((state) => state.poDetail2);
  const poDetail3State = useSelector((state) => state.poDetail3);
  const poDetail4State = useSelector((state) => state.poDetail4);

  const [form, setForm] = useState(INITIAL_FORM);
  const [editForm, setEditForm] = useState(INITIAL_FORM);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Items");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingAttachment, setEditingAttachment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [poRefNo, setPoRefNo] = useState("");

  const [modalForm, setModalForm] = useState({ 
    isOpen: false, 
    title: "", 
    fields: [], 
    onSubmit: null, 
    submitText: "Submit",
    onCloseCallback: null,
    isLoading: false 
  });

  // Loading states
  const isLoadingItems = poDetail1State.status === "loading";
  const isLoadingLogistics = poDetail2State.status === "loading";
  const isLoadingAccounting = poDetail3State.status === "loading";
  const isLoadingAttachments = poDetail4State.status === "loading";

  /* ---------- Fetch PO Headers and set poRefNo ---------- */
  useEffect(() => {
    dispatch(fetchPOHeaders({ page: 1, limit: 20 }));
  }, [dispatch]);

  /* ---------- Populate form AFTER headers load ---------- */
  useEffect(() => {
    if (!poHeaderState.headers?.length || !username) return;

    const supplierData = poHeaderState.headers.find(
      (header) => header.po_ref_no === username
    );

    if (!supplierData) return;

    const {
      po_ref_no,
      po_date,
      purchase_type,
      company_id,
      supplier_id,
      remarks,
      created_by,
      supplier_name = "Supplier Name",
      supplier_code = "",
      contact_person = "",
      status = "Open",
      posting_date = new Date().toISOString().split('T')[0],
      delivery_date = new Date().toISOString().split('T')[0],
      document_date = new Date().toISOString().split('T')[0]
    } = supplierData;

    setPoRefNo(po_ref_no);
    
    setForm({
      ...supplierData,
      po_ref_no,
      po_date,
      purchase_type,
      company_id,
      supplier_id,
      remarks,
      created_by,
      supplier_name,
      supplier_code,
      contact_person,
      status,
      posting_date,
      delivery_date,
      document_date
    });
  }, [poHeaderState.headers, username]);

  // Fetch data when poRefNo changes
  useEffect(() => {
    if (poRefNo) {
      Promise.all([
        dispatch(fetchPOHeaderByRef(poRefNo)),
        dispatch(fetchPODetails1ByRef(poRefNo)),
        dispatch(fetchPODetails2ByRef(poRefNo)),
        dispatch(fetchPODetails3ByRef(poRefNo)),
      ]).catch((error) => {
        console.error("Error fetching PO data:", error);
        toast.error("Failed to fetch PO data");
      });
    }
  }, [poRefNo, dispatch]);

  // Fetch attachments separately (paginated)
  useEffect(() => {
    dispatch(fetchPODetails4({ page: 1, limit: 50 }));
  }, [dispatch]);

  /* ---------- Edit Handlers ---------- */
  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleEditSubmit = async () => {
    setModalForm(prev => ({ ...prev, isLoading: true }));
    
    try {
      const submitData = {
        po_date: editForm.po_date,
        purchase_type: editForm.purchase_type,
        company_id: editForm.company_id,
        supplier_id: editForm.supplier_id,
        remarks: editForm.remarks,
        modified_by: editForm.created_by || username || "ADMIN",
      };
      
      await dispatch(updatePOHeader({ 
        poRefNo: form.po_ref_no, 
        headerData: submitData 
      })).unwrap();
      
      toast.success("PO Header updated successfully!");
      
      setForm((prev) => ({
        ...prev,
        ...editForm,
      }));
      setShowSupplierModal(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.message || 'Could not update PO Header.');
    } finally {
      setModalForm(prev => ({ ...prev, isLoading: false }));
    }
  };

  const openEditModal = () => {
    setEditForm({
      po_ref_no: form.po_ref_no,
      po_date: form.po_date,
      purchase_type: form.purchase_type,
      company_id: form.company_id,
      supplier_id: form.supplier_id,
      remarks: form.remarks,
      created_by: form.created_by,
      supplier_name: form.supplier_name,
      supplier_code: form.supplier_code,
      contact_person: form.contact_person,
    });
    setShowSupplierModal(true);
  };

  // Get data from Redux state - PO Detail 1 (Items)
  const rows = useMemo(() => {
    return poDetail1State.detailsByRef?.length > 0
      ? poDetail1State.detailsByRef.map((detail, index) => ({
          id: detail.sno || detail.id || Math.random(),
          sno: index + 1,
          item_no: detail.item_no || `ITM-${String(index + 1).padStart(4, '0')}`,
          description: detail.alternate_product_name || detail.description || "Item Description",
          whse: detail.request_store_id || "MAIN",
          uom_code: detail.uom_code || "NOS",
          quantity: parseFloat(detail.total_pcs) || 0,
          unit_price: parseFloat(detail.rate_per_pcs) || 0,
          discount: parseFloat(detail.discount_percentage) || 0,
          tax_code: detail.vat_percentage
            ? `VAT${detail.vat_percentage}`
            : "GST18",
          qc_remark: detail.remarks ? "OK" : "Pending",
          price_after_discount: calculatePriceAfterDiscount(
            parseFloat(detail.rate_per_pcs) || 0,
            parseFloat(detail.discount_percentage) || 0
          ),
          total: parseFloat(detail.final_product_amount) || 
                (parseFloat(detail.total_pcs) || 0) * (parseFloat(detail.rate_per_pcs) || 0),
        }))
      : [];
  }, [poDetail1State.detailsByRef]);

  // Get data from Redux state - PO Detail 4 (Attachments)
  const attachmentsrows = useMemo(() => {
    const filteredFiles = poDetail4State.files?.filter((file) => file.po_ref_no === poRefNo) || [];
    
    return filteredFiles.length > 0
      ? filteredFiles.map((file) => ({
          id: file.sno || Math.random(),
          po_ref_no: file.po_ref_no,
          filename: file.file_name || "",
          description_details: file.description_details || "",
          content_type: file.content_type || "application/octet-stream",
          status_master: file.status_master || "ACTIVE",
          created_by: file.created_by || "",
          created_date: file.created_date || new Date().toISOString().split('T')[0],
          file_type: file.file_type || "DOCUMENT",
        }))
      : [];
  }, [poDetail4State.files, poRefNo]);

  // Get PO Detail 2 (Logistics) data
  const logisticsData = useMemo(() => {
    const details = poDetail2State.detailsByRef || [];
    if (details.length > 0) {
      return details.map(detail => ({
        key: detail.field_name || "Field",
        value: detail.field_value || ""
      }));
    }
    return [
      { key: "Ship To", value: "10974 KISONGO" },
      { key: "Bill To", value: "ACCOUNTS DEPT - ARUSHA" },
      { key: "Delivery Date", value: form.delivery_date || "2025-12-30" },
      { key: "Shipping Type", value: "Road Transport" },
      { key: "Transport Mode", value: "Truck" },
      { key: "Incoterms", value: "DAP" },
      { key: "Tracking No", value: "" },
      { key: "Vehicle No", value: "" },
      { key: "Warehouse", value: "MAIN" },
    ];
  }, [poDetail2State.detailsByRef, form.delivery_date]);

  // Get PO Detail 3 (Accounting) data
  const accountingData = useMemo(() => {
    const details = poDetail3State.detailsByRef || [];
    if (details.length > 0) {
      return details.map(detail => ({
        key: detail.field_name || "Field",
        value: detail.field_value || ""
      }));
    }
    return [
      { key: "Tax Rate", value: "18%" },
      { key: "Payment Terms", value: "Net 30" },
      { key: "Currency", value: "INR" },
      { key: "Payment Method", value: "Bank Transfer" },
    ];
  }, [poDetail3State.detailsByRef]);

  // Helper functions
  const calculatePriceAfterDiscount = (unitPrice, discount) => {
    return unitPrice - (unitPrice * discount) / 100;
  };

  const calculateTotalValue = () => {
    return rows.reduce((sum, row) => sum + row.total, 0);
  };

  const calculateAvgDiscount = () => {
    if (rows.length === 0) return 0;
    return rows.reduce((sum, row) => sum + row.discount, 0) / rows.length;
  };

  const calculateQCPassRate = () => {
    if (rows.length === 0) return 0;
    return (rows.filter((row) => row.qc_remark === "OK").length / rows.length) * 100;
  };

  // Row selection handlers
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

  const updateAllSelectedStatus = (selectedSet) => {
    const allRowIds = rows.map((row) => row.id);
    setIsAllSelected(
      selectedSet.size === allRowIds.length && allRowIds.length > 0
    );
  };

  // Modal management
  const openModalForm = ({ title, fields, submitText, onSubmit, onCloseCallback }) => {
    setModalForm({ 
      isOpen: true, 
      title, 
      fields, 
      onSubmit, 
      submitText,
      onCloseCallback,
      isLoading: false
    });
  };

  const closeModalForm = () => {
    if (modalForm.onCloseCallback) {
      modalForm.onCloseCallback();
    }
    setModalForm({ 
      isOpen: false, 
      title: "", 
      fields: [], 
      onSubmit: null, 
      submitText: "Submit",
      onCloseCallback: null,
      isLoading: false
    });
    setEditingItem(null);
    setEditingAttachment(null);
    setSelectedFile(null);
  };

  // ==================== ITEM HANDLERS ====================
  const handleAddItem = async (data) => {
    try {
      setModalForm(prev => ({ ...prev, isLoading: true }));
      
      const detailData = {
        po_ref_no: form.po_ref_no,
        item_no: data.item_no || `ITM-${Date.now()}`,
        alternate_product_name: data.description,
        request_store_id: 1,
        total_pcs: parseFloat(data.quantity) || 0,
        rate_per_pcs: parseFloat(data.unit_price) || 0,
        discount_percentage: parseFloat(data.discount) || 0,
        vat_percentage: parseFloat(data.tax_code?.replace("GST", "").replace("VAT", "")) || 0,
        remarks: data.qc_remark || "OK",
        created_by: username || "Admin",
        created_mac_address: "",
      };

      await dispatch(createPODetail1(detailData)).unwrap();
      toast.success("Item added successfully");
      closeModalForm();
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error(error?.message || "Failed to add item");
    } finally {
      setModalForm(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleEditItem = async (data) => {
    if (!editingItem) return;

    try {
      setModalForm(prev => ({ ...prev, isLoading: true }));

      const detailData = {
        item_no: data.item_no,
        alternate_product_name: data.description,
        total_pcs: parseFloat(data.quantity) || 0,
        rate_per_pcs: parseFloat(data.unit_price) || 0,
        discount_percentage: parseFloat(data.discount) || 0,
        vat_percentage: parseFloat(data.tax_code?.replace("GST", "").replace("VAT", "")) || 0,
        remarks: data.qc_remark || "OK",
        modified_by: username || "Admin",
      };

      await dispatch(
        updatePODetail1({
          id: editingItem.id,
          detailData: detailData,
        })
      ).unwrap();

      toast.success("Item updated successfully");
      closeModalForm();
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error(error?.message || "Failed to update item");
    } finally {
      setModalForm(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await dispatch(deletePODetail1(itemId)).unwrap();
        toast.success("Item deleted successfully");
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error(error?.message || "Failed to delete item");
      }
    }
  };

  // ==================== ATTACHMENT HANDLERS ====================
  const handleAddAttachment = async (data) => {
    try {
      setModalForm(prev => ({ ...prev, isLoading: true }));

      if (!data.file) {
        toast.error("Please select a file to upload");
        setModalForm(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const formData = new FormData();
      formData.append("po_ref_no", form.po_ref_no);
      formData.append("description_details", data.description_details || "");
      formData.append("file_name", data.file.name);
      formData.append("content_type", data.file.type || "application/octet-stream");
      formData.append("status_master", data.status_master || "ACTIVE");
      formData.append("created_by", username || "Admin");
      formData.append("created_mac_address", "");
      formData.append("file_type", data.file_type || "DOCUMENT");
      formData.append("file", data.file);

      await dispatch(createPODetail4(formData)).unwrap();
      toast.success("Attachment uploaded successfully");
      closeModalForm();
    } catch (error) {
      console.error("Error adding attachment:", error);
      toast.error(error?.message || "Failed to upload attachment");
    } finally {
      setModalForm(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleEditAttachment = async (data) => {
    if (!editingAttachment) return;

    try {
      setModalForm(prev => ({ ...prev, isLoading: true }));

      const metadata = {
        PO_REF_NO: data.po_ref_no || form.po_ref_no,
        DESCRIPTION_DETAILS: data.description_details || "",
        STATUS_MASTER: data.status_master || "ACTIVE",
        FILE_TYPE: data.file_type || "DOCUMENT",
        UPDATED_BY: username || "Admin",
      };

      await dispatch(
        updatePODetail4({
          id: editingAttachment.id,
          metadata: metadata,
        })
      ).unwrap();

      toast.success("Attachment updated successfully");
      closeModalForm();
    } catch (error) {
      console.error("Error updating attachment:", error);
      toast.error(error?.message || "Failed to update attachment");
    } finally {
      setModalForm(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteAttachment = async (id) => {
    if (window.confirm("Delete this attachment?")) {
      try {
        await dispatch(deletePODetail4(id)).unwrap();
        toast.success("Attachment deleted successfully");
      } catch (error) {
        console.error("Error deleting attachment:", error);
        toast.error(error?.message || "Failed to delete attachment");
      }
    }
  };

  // ==================== FIELD CONFIGURATIONS ====================
  const itemFields = [
    {
      name: "item_no",
      label: "Item No",
      placeholder: "ITM-0001",
      required: true,
      type: "text"
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter item description",
      required: true,
      type: "text"
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      placeholder: "0",
      required: true,
      min: 0
    },
    {
      name: "unit_price",
      label: "Unit Price",
      type: "number",
      placeholder: "0.00",
      required: true,
      min: 0,
      step: 0.01
    },
    {
      name: "discount",
      label: "Discount (%)",
      type: "number",
      placeholder: "0",
      min: 0,
      max: 100
    },
    {
      name: "tax_code",
      label: "Tax Code",
      placeholder: "GST18",
      type: "text"
    },
    {
      name: "qc_remark",
      label: "QC Remark",
      placeholder: "OK",
      type: "text"
    },
  ];

  const attachmentFields = [
    {
      name: "description_details",
      label: "Description",
      placeholder: "Enter file description",
      type: "text"
    },
    {
      name: "file_type",
      label: "File Type",
      placeholder: "DOCUMENT",
      type: "text"
    },
    {
      name: "status_master",
      label: "Status",
      placeholder: "ACTIVE",
      type: "text"
    },
    {
      name: "file",
      label: "Select File",
      type: "file",
      required: true,
      accept: "*/*"
    },
  ];

  const attachmentColumns = [
    { key: "filename", label: "File Name", icon: FileText },
    { key: "file_type", label: "Type", icon: FileText },
    { key: "description_details", label: "Description", icon: AlignLeft },
    { key: "status_master", label: "Status", icon: BadgeCheck },
    { key: "created_date", label: "Date", icon: Calendar },
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
                fields: attachmentFields
                  .filter((f) => f.name !== "file")
                  .map((f) => ({
                    ...f,
                    defaultValue: row[f.name] || "",
                  })),
                submitText: "Update",
                onSubmit: handleEditAttachment,
                onCloseCallback: () => setEditingAttachment(null),
              });
            }}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
            disabled={isLoadingAttachments}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAttachment(row.id);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
            disabled={isLoadingAttachments}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

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
            disabled={isLoadingItems}
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
          disabled={isLoadingItems}
        />
      ),
    },
    { key: "sno", label: "S.No", icon: Hash },
    { key: "item_no", label: "Item No", icon: Box },
    {
      key: "description",
      label: "Description",
      icon: FileText,
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
        <span className="font-semibold text-slate-900">
          ₹ {value.toFixed(2)}
        </span>
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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "OK" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {value}
        </span>
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
            disabled={isLoadingItems}
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
            disabled={isLoadingItems}
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
            disabled={isLoadingItems}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Calculate summary statistics
  const totalValue = calculateTotalValue();
  const avgDiscount = calculateAvgDiscount();
  const qcPassRate = calculateQCPassRate();

  const summaryData = [
    {
      label: "Total Before Discount",
      value: `₹ ${totalValue.toFixed(2)}`,
    },
    { label: "Discount", value: `${avgDiscount.toFixed(1)}%` },
    { label: "Freight", value: "₹ 0.00" },
    { label: "Tax", value: "₹ 0.00" },
    {
      label: "Total Payment Due",
      value: `₹ ${totalValue.toFixed(2)}`,
    },
  ];

  const statsCards = [
    {
      title: "Total Items",
      value: rows.length,
      icon: Box,
      color: "blue",
    },
    {
      title: "Total Value",
      value: `₹ ${totalValue.toFixed(2)}`,
      icon: IndianRupee,
      color: "emerald",
    },
    {
      title: "Avg Discount",
      value: `${avgDiscount.toFixed(1)}%`,
      icon: Percent,
      color: "amber",
    },
    {
      title: "QC Pass Rate",
      value: `${qcPassRate.toFixed(0)}%`,
      icon: BadgeCheck,
      color: "purple",
    },
  ];

  return (
    <>
      <Layout
        header={
          <div className="flex flex-col sm:flex-row min-w-full items-start sm:items-center justify-between gap-3">
            <div className="flex-1 w-full">
              <SupplierInfo
                title={
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Supplier
                  </span>
                }
                header={
                  <div className="text-sm sm:text-base md:text-lg font-bold text-slate-900">
                    {form.supplier_name || form.created_by || "Supplier Name"}
                  </div>
                }
                leftContent={
                  <>
                    <div className="text-xs sm:text-sm text-slate-600">
                      Code: {form.supplier_code || form.supplier_id || "-"}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">
                      Contact: {form.contact_person || "-"}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">
                      Remarks: {form.remarks ? form.remarks.substring(0, 50) + (form.remarks.length > 50 ? "..." : "") : "-"}
                    </div>
                  </>
                }
                rightContent={
                  <>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">PO Number</span>
                      <span className="font-medium text-slate-900">
                        {form.po_ref_no || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">Status</span>
                      <span className="font-medium text-slate-900">
                        {form.status || "Open"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">PO Date</span>
                      <span className="font-medium text-slate-900">
                        {formatMonthDayYear(form.po_date) || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">Delivery Date</span>
                      <span className="font-medium text-slate-900">
                        {formatMonthDayYear(form.delivery_date) || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">Document Date</span>
                      <span className="font-medium text-slate-900">
                        {formatMonthDayYear(form.document_date) || "-"}
                      </span>
                    </div>
                  </>
                }
                onEdit={openEditModal}
              />
            </div>
          </div>
        }
        footer={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <RemarksCard remarks={form.remarks || "No remarks provided."} />
            <SummaryCard summary={summaryData} />
          </div>
        }
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <div key={index} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border border-${stat.color}-200 rounded-xl p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
              </div>
            </div>
          ))}
        </div>

        {/* Modern Card Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden my-2">
          {/* Enhanced Tabs */}
          <div className="px-6 pt-4">
            {/* Add Item Button */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {activeTab}
              </h3>
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Add a new item"
                  disabled={isLoadingItems}
                >
                  {isLoadingItems ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </span>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Add Item</span>
                    </>
                  )}
                </button>
              )}
              {activeTab === "Attachments" && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    openModalForm({
                      title: "Add Attachment",
                      fields: attachmentFields,
                      submitText: "Upload Attachment",
                      onSubmit: handleAddAttachment,
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  disabled={isLoadingAttachments}
                >
                  {isLoadingAttachments ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add Attachment
                    </>
                  )}
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
                loading={isLoadingItems}
              />
            )}
            {activeTab === "Logistics" && (
              <DataTable
                columns={[
                  { key: "key", label: "Field" },
                  { key: "value", label: "Value" },
                ]}
                data={logisticsData}
                itemsPerPage={7}
                className="border"
                loading={isLoadingLogistics}
              />
            )}

            {activeTab === "Accounting" && (
              <DataTable
                columns={[
                  { key: "key", label: "Field" },
                  { key: "value", label: "Value" },
                ]}
                data={accountingData}
                itemsPerPage={7}
                className="border"
                loading={isLoadingAccounting}
              />
            )}

            {activeTab === "Attachments" && (
              <>
                <DataTable
                  columns={attachmentColumns}
                  data={attachmentsrows}
                  itemsPerPage={7}
                  className="border-0"
                  loading={isLoadingAttachments}
                >
                  {attachmentsrows.length === 0 && !isLoadingAttachments && (
                    <div className="flex flex-col items-center gap-3 text-center py-12">
                      <Paperclip className="w-16 h-16 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-700">
                        No attachments found
                      </p>
                      <p className="text-xs text-slate-500">
                        Upload documents related to this purchase order.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          openModalForm({
                            title: "Add Attachment",
                            fields: attachmentFields,
                            submitText: "Upload Attachment",
                            onSubmit: handleAddAttachment,
                          });
                        }}
                        className="text-blue-600 text-xs font-medium hover:text-blue-700"
                      >
                        Upload Your First Attachment
                      </button>
                    </div>
                  )}
                </DataTable>
              </>
            )}
          </div>
        </div>
      </Layout>

      {/* Single ModelForm instance for all modals */}
      <ModelForm
        isOpen={modalForm.isOpen}
        onClose={closeModalForm}
        title={modalForm.title}
        fields={modalForm.fields}
        submitText={modalForm.submitText}
        onSubmit={async (data) => {
          // Call the modal's submit handler
          return modalForm.onSubmit
            ? modalForm.onSubmit(data)
            : Promise.resolve();
        }}
        isLoading={modalForm.isLoading}
      />

      {/* Edit Supplier Modal */}
      <ModelForm
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        title="Edit Supplier Details"
        fields={[
          { label: "PO Reference No", name: "po_ref_no", disabled: true, defaultValue: editForm.po_ref_no },
          { label: "Supplier Name", name: "supplier_name", defaultValue: editForm.supplier_name },
          { label: "Supplier Code", name: "supplier_code", defaultValue: editForm.supplier_code },
          { label: "Contact Person", name: "contact_person", defaultValue: editForm.contact_person },
          { label: "Purchase Type", name: "purchase_type", defaultValue: editForm.purchase_type },
          { label: "Company ID", name: "company_id", type: "number", defaultValue: editForm.company_id },
          { label: "Supplier ID", name: "supplier_id", type: "number", defaultValue: editForm.supplier_id },
          { label: "Created By", name: "created_by", disabled: true, defaultValue: editForm.created_by },
          { label: "PO Date", name: "po_date", type: "date", defaultValue: editForm.po_date && !isNaN(new Date(editForm.po_date)) ? new Date(editForm.po_date).toISOString().split("T")[0] : "" },
          { label: "Remarks", name: "remarks", type: "textarea", defaultValue: editForm.remarks, rows: 3 },
        ]}
        submitText="Update"
        onSubmit={handleEditSubmit}
        isLoading={modalForm.isLoading}
      />
    </>
  );
};

export default PurchaseOrderPage;