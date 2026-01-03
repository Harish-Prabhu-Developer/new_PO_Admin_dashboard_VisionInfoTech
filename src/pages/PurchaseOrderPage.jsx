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

  // Helper functions
  const calculatePriceAfterDiscount = (unitPrice, discount) => {
    return unitPrice - (unitPrice * discount) / 100;
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
          // Store the actual item data for reference
          _rawData: detail,
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

  // Helper functions (using rows)
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
      
      // Validate required fields
      if (!form.po_ref_no) {
        toast.error("Please select a PO Reference number first");
        setModalForm(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      if (!data.rate_per_pcs || parseFloat(data.rate_per_pcs) <= 0) {
        toast.error("Rate per PCS is required and must be greater than 0");
        setModalForm(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const detailData = {
        po_ref_no: form.po_ref_no?.trim() || "",
        item_no: data.item_no?.trim() || `ITM-${Date.now()}`,
        alternate_product_name: data.alternate_product_name?.trim() || "",
        request_store_id: data.request_store_id ? parseInt(data.request_store_id) : 1,
        po_request_ref_no: data.po_request_ref_no?.trim() || "",
        proforma_invoice_ref_no: data.proforma_invoice_ref_no?.trim() || "",
        section_id: data.section_id ? parseInt(data.section_id) : 0,
        machine_id: data.machine_id ? parseInt(data.machine_id) : 0,
        main_category_id: data.main_category_id ? parseInt(data.main_category_id) : 0,
        sub_category_id: data.sub_category_id ? parseInt(data.sub_category_id) : 0,
        product_id: data.product_id ? parseInt(data.product_id) : 0,
        packing_type: data.packing_type?.trim() || "",
        no_pcs_per_packing: data.no_pcs_per_packing ? parseFloat(data.no_pcs_per_packing) : 0,
        total_pcs: data.total_pcs ? parseFloat(data.total_pcs) : 0,
        total_packing: data.total_packing ? parseFloat(data.total_packing) : 0,
        rate_per_pcs: parseFloat(data.rate_per_pcs) || 0,
        product_amount: data.product_amount ? parseFloat(data.product_amount) : 0,
        discount_percentage: data.discount_percentage ? parseFloat(data.discount_percentage) : 0,
        discount_amount: data.discount_amount ? parseFloat(data.discount_amount) : 0,
        total_product_amount: data.total_product_amount ? parseFloat(data.total_product_amount) : 0,
        vat_percentage: data.vat_percentage ? parseFloat(data.vat_percentage) : 0,
        vat_amount: data.vat_amount ? parseFloat(data.vat_amount) : 0,
        final_product_amount: data.final_product_amount ? parseFloat(data.final_product_amount) : 0,
        remarks: data.remarks?.trim() || "",
        created_by: username || "Admin",
        created_mac_address: data.created_mac_address?.trim() || "",
        lc_needed_status: data.lc_needed_status?.trim() || "",
        lc_apply_status: data.lc_apply_status?.trim() || "",
        lc_applied_date: data.lc_applied_date || "",
        lc_no: data.lc_no?.trim() || "",
        sup_doc_file: data.sup_doc_file?.trim() || "",
        truck_id: data.truck_id ? parseInt(data.truck_id) : 0,
        trailer_id: data.trailer_id ? parseInt(data.trailer_id) : 0,
      };

      console.log("Adding Item Payload:", detailData);
      await dispatch(createPODetail1(detailData)).unwrap();
      
      // Refetch items after successful creation
      if (poRefNo) {
        await dispatch(fetchPODetails1ByRef(poRefNo));
      }
      
      toast.success("Item added successfully");
      closeModalForm();
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error(error?.message || error?.payload || "Failed to add item");
    } finally {
      setModalForm(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleEditItem = async (data) => {
    if (!editingItem) return;

    try {
      setModalForm(prev => ({ ...prev, isLoading: true }));

      // Get the actual PO Detail 1 record ID from your rows data
      const actualItem = poDetail1State.detailsByRef?.find(
        item => (item.sno || item.id) === editingItem.id
      );

      if (!actualItem) {
        toast.error("Item not found");
        setModalForm(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const detailData = {
        item_no: data.item_no || actualItem.item_no,
        alternate_product_name: data.alternate_product_name || actualItem.alternate_product_name,
        request_store_id: data.request_store_id ? parseInt(data.request_store_id) : actualItem.request_store_id,
        po_request_ref_no: data.po_request_ref_no || actualItem.po_request_ref_no,
        proforma_invoice_ref_no: data.proforma_invoice_ref_no || actualItem.proforma_invoice_ref_no,
        section_id: data.section_id ? parseInt(data.section_id) : actualItem.section_id,
        machine_id: data.machine_id ? parseInt(data.machine_id) : actualItem.machine_id,
        main_category_id: data.main_category_id ? parseInt(data.main_category_id) : actualItem.main_category_id,
        sub_category_id: data.sub_category_id ? parseInt(data.sub_category_id) : actualItem.sub_category_id,
        product_id: data.product_id ? parseInt(data.product_id) : actualItem.product_id,
        packing_type: data.packing_type || actualItem.packing_type,
        no_pcs_per_packing: data.no_pcs_per_packing ? parseFloat(data.no_pcs_per_packing) : actualItem.no_pcs_per_packing,
        total_pcs: data.total_pcs ? parseFloat(data.total_pcs) : actualItem.total_pcs,
        total_packing: data.total_packing ? parseFloat(data.total_packing) : actualItem.total_packing,
        rate_per_pcs: data.rate_per_pcs ? parseFloat(data.rate_per_pcs) : actualItem.rate_per_pcs,
        product_amount: data.product_amount ? parseFloat(data.product_amount) : actualItem.product_amount,
        discount_percentage: data.discount_percentage ? parseFloat(data.discount_percentage) : actualItem.discount_percentage,
        discount_amount: data.discount_amount ? parseFloat(data.discount_amount) : actualItem.discount_amount,
        total_product_amount: data.total_product_amount ? parseFloat(data.total_product_amount) : actualItem.total_product_amount,
        vat_percentage: data.vat_percentage ? parseFloat(data.vat_percentage) : actualItem.vat_percentage,
        vat_amount: data.vat_amount ? parseFloat(data.vat_amount) : actualItem.vat_amount,
        final_product_amount: data.final_product_amount ? parseFloat(data.final_product_amount) : actualItem.final_product_amount,
        remarks: data.remarks || actualItem.remarks,
        modified_by: username || "Admin",
      };

      console.log("Updating Item Payload:", detailData, "ID:", actualItem.sno || actualItem.id);
      
      await dispatch(
        updatePODetail1({
          id: actualItem.sno || actualItem.id,
          detailData: detailData,
        })
      ).unwrap();

      // Refetch items after successful update
      if (poRefNo) {
        await dispatch(fetchPODetails1ByRef(poRefNo));
      }
      
      toast.success("Item updated successfully");
      closeModalForm();
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error(error?.message || error?.payload || "Failed to update item");
    } finally {
      setModalForm(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        // Find the actual item to get the correct ID
        const actualItem = poDetail1State.detailsByRef?.find(
          item => (item.sno || item.id) === itemId
        );
        
        if (!actualItem) {
          toast.error("Item not found");
          return;
        }
        
        console.log("Deleting Item ID:", actualItem.sno || actualItem.id);
        await dispatch(deletePODetail1(actualItem.sno || actualItem.id)).unwrap();
        
        // Refetch items after successful deletion
        if (poRefNo) {
          await dispatch(fetchPODetails1ByRef(poRefNo));
        }
        
        toast.success("Item deleted successfully");
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error(error?.message || error?.payload || "Failed to delete item");
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
      formData.append("created_mac_address", data.created_mac_address || "");
      formData.append("file_type", data.file_type || "DOCUMENT");
      formData.append("file", data.file);

      console.log("Uploading Attachment for PO:", form.po_ref_no);
      await dispatch(createPODetail4(formData)).unwrap();
      
      // Refetch attachments after successful upload
      await dispatch(fetchPODetails4({ page: 1, limit: 50 }));
      
      toast.success("Attachment uploaded successfully");
      closeModalForm();
    } catch (error) {
      console.error("Error adding attachment:", error);
      toast.error(error?.message || error?.payload || "Failed to upload attachment");
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

      console.log("Updating Attachment ID:", editingAttachment.id, "Metadata:", metadata);
      
      await dispatch(
        updatePODetail4({
          id: editingAttachment.id,
          metadata: metadata,
        })
      ).unwrap();

      // Refetch attachments after successful update
      await dispatch(fetchPODetails4({ page: 1, limit: 50 }));

      toast.success("Attachment updated successfully");
      closeModalForm();
    } catch (error) {
      console.error("Error updating attachment:", error);
      toast.error(error?.message || error?.payload || "Failed to update attachment");
    } finally {
      setModalForm(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteAttachment = async (id) => {
    if (window.confirm("Delete this attachment?")) {
      try {
        console.log("Deleting Attachment ID:", id);
        await dispatch(deletePODetail4(id)).unwrap();
        
        // Refetch attachments after successful deletion
        await dispatch(fetchPODetails4({ page: 1, limit: 50 }));
        
        toast.success("Attachment deleted successfully");
      } catch (error) {
        console.error("Error deleting attachment:", error);
        toast.error(error?.message || error?.payload || "Failed to delete attachment");
      }
    }
  };

  // ==================== FIELD CONFIGURATIONS ====================
  const itemFields = [
    { name: "po_ref_no", label: "PO Reference No", type: "text", placeholder: "select PO Ref No", required: true, input_type: "dropdown" },
    { name: "request_store_id", label: "Request Store ID", type: "number", placeholder: "0", min: 0 },
    { name: "po_request_ref_no", label: "PO Request Ref No", type: "text", placeholder: "Reference" },
    { name: "proforma_invoice_ref_no", label: "Proforma Invoice Ref No", type: "text", placeholder: "Ref No" },
    { name: "section_id", label: "Section ID", type: "number", placeholder: "0", min: 0 },
    { name: "machine_id", label: "Machine ID", type: "number", placeholder: "0", min: 0 },
    { name: "main_category_id", label: "Main Category ID", type: "number", placeholder: "0", min: 0 },
    { name: "sub_category_id", label: "Sub Category ID", type: "number", placeholder: "0", min: 0 },
    { name: "product_id", label: "Product ID", type: "number", placeholder: "0", min: 0 },
    { name: "packing_type", label: "Packing Type", type: "text", placeholder: "Box / Bag" },
    { name: "no_pcs_per_packing", label: "No. Pcs per Packing", type: "number", placeholder: "0", min: 0 },
    { name: "total_pcs", label: "Total Pcs", type: "number", placeholder: "0", min: 0 },
    { name: "total_packing", label: "Total Packing", type: "number", placeholder: "0", min: 0 },
    { name: "rate_per_pcs", label: "Rate per Pcs", type: "number", placeholder: "0.00", step: 0.01, min: 0 },
    { name: "product_amount", label: "Product Amount", type: "number", placeholder: "0.00", step: 0.01 },
    { name: "discount_percentage", label: "Discount Percentage", type: "number", placeholder: "0", min: 0, max: 100 },
    { name: "discount_amount", label: "Discount Amount", type: "number", placeholder: "0.00", step: 0.01 },
    { name: "total_product_amount", label: "Total Product Amount", type: "number", placeholder: "0.00", step: 0.01 },
    { name: "vat_percentage", label: "VAT Percentage", type: "number", placeholder: "0", min: 0, max: 100 },
    { name: "vat_amount", label: "VAT Amount", type: "number", placeholder: "0.00", step: 0.01 },
    { name: "final_product_amount", label: "Final Product Amount", type: "number", placeholder: "0.00", step: 0.01 },
    { name: "remarks", label: "Remarks", type: "text", placeholder: "Enter remarks" },
    { name: "created_by", label: "Created By", type: "text", placeholder: "User" },
    { name: "created_mac_address", label: "Created MAC Address", type: "text", placeholder: "00:00:00" },
    { name: "alternate_product_name", label: "Alternate Product Name", type: "text", placeholder: "Alt name" },
    { name: "lc_needed_status", label: "LC Needed Status", type: "text", placeholder: "Yes/No" },
    { name: "lc_apply_status", label: "LC Apply Status", type: "text", placeholder: "Applied/Not Applied" },
    { name: "lc_applied_date", label: "LC Applied Date", type: "date" },
    { name: "lc_no", label: "LC No", type: "text", placeholder: "LC Number" },
    { name: "sup_doc_file", label: "Supplier Doc File", type: "text", placeholder: "filename.pdf" },
    { name: "truck_id", label: "Truck ID", type: "number", placeholder: "0", min: 0 },
    { name: "trailer_id", label: "Trailer ID", type: "number", placeholder: "0", min: 0 },
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
            onClick={async (e) => {
              e.stopPropagation();
              
              // Find the actual item from detailsByRef
              const actualItem = poDetail1State.detailsByRef?.find(
                item => (item.sno || item.id) === row.id
              );
              
              if (!actualItem) {
                toast.error("Could not load item details");
                return;
              }
              
              setEditingItem(row);
              
              // Map the actual item data to form fields
              const defaultValues = {};
              itemFields.forEach(field => {
                defaultValues[field.name] = actualItem[field.name] || "";
              });
              
              openModalForm({
                title: "Edit Item",
                fields: itemFields.map((field) => ({
                  ...field,
                  defaultValue: defaultValues[field.name],
                  options:
                    field.input_type === "dropdown"
                      ? poHeaderState.headers?.map((h) => h.po_ref_no) || []
                      : field.options || undefined,
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
            <div key={index} className={`bg-linear-to-br from-${stat.color}-50 to-${stat.color}-100 border border-${stat.color}-200 rounded-xl p-4`}>
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
                      fields: itemFields.map((f) => ({
                        ...f,
                        defaultValue: f.name === "po_ref_no" ? form.po_ref_no : "",
                        options: f.input_type === "dropdown"
                          ? poHeaderState.headers?.map((h) => h.po_ref_no) || []
                          : f.options || undefined,
                      })),
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
                emptyMessage="No items found"
                emptySubMessage="Add items to this purchase order"
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
                emptyMessage="No logistics data"
                emptySubMessage="Add logistics information"
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
                emptyMessage="No accounting data"
                emptySubMessage="Add accounting information"
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
                  emptyMessage="No attachments found"
                  emptySubMessage="Upload documents related to this purchase order"
                />
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