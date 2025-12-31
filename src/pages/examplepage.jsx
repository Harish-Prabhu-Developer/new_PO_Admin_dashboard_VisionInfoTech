// src/pages/examplepage.jsx
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
} from "lucide-react";
import ModelForm from "../components/ModelForm";
import { StatusBadge } from "../components/common/TableCell";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  createPOHeader,
  updatePOHeader,
  fetchPOHeaderByRef,
} from "../redux/Slice/PO/poHeaderSlice";
import {
  createPODetail1,
  updatePODetail1,
  deletePODetail1,
  fetchPODetails1ByRef,
} from "../redux/Slice/PO/poDetail1Slice";
import {
  createPODetail2,
  updatePODetail2,
  deletePODetail2,
  fetchPODetails2ByRef,
} from "../redux/Slice/PO/poDetail2Slice";
import {
  createPODetail3,
  updatePODetail3,
  deletePODetail3,
  fetchPODetails3ByRef,
} from "../redux/Slice/PO/poDetail3Slice";
import {
  createPODetail4,
  updatePODetail4,
  deletePODetail4,
  fetchPODetails4,
} from "../redux/Slice/PO/poDetail4Slice";

const ExamplePage = () => {
  const dispatch = useDispatch();

  // Redux selectors
  const poHeaderState = useSelector((state) => state.poHeader);
  const poDetail1State = useSelector((state) => state.poDetail1);
  const poDetail2State = useSelector((state) => state.poDetail2);
  const poDetail3State = useSelector((state) => state.poDetail3);
  const poDetail4State = useSelector((state) => state.poDetail4);

  // Local state
  const [activeTab, setActiveTab] = useState("Items");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingAttachment, setEditingAttachment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [poRefNo, setPoRefNo] = useState("3517");

  // Modal state
  const [modalForm, setModalForm] = useState({
    isOpen: false,
    title: "",
    fields: [],
    submitText: "Submit",
    onSubmit: null,
    onCloseCallback: null,
  });

  // Loading states
  const isLoadingItems = poDetail1State.status === "loading";
  const isLoadingLogistics = poDetail2State.status === "loading";
  const isLoadingAccounting = poDetail3State.status === "loading";
  const isLoadingAttachments = poDetail4State.status === "loading";

  // Fetch data when component mounts or poRefNo changes
  useEffect(() => {
    if (poRefNo) {
      Promise.all([
        dispatch(fetchPOHeaderByRef(poRefNo)),
        dispatch(fetchPODetails1ByRef(poRefNo)),
        dispatch(fetchPODetails2ByRef(poRefNo)),
        dispatch(fetchPODetails3ByRef(poRefNo)),
      ]).catch((error) => {
        console.error("Error fetching PO data:", error);
      });
    }
  }, [poRefNo, dispatch]);

  // Fetch attachments separately (paginated)
  useEffect(() => {
    dispatch(fetchPODetails4({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Get data from Redux state - PO Detail 1 (Items)
  const rows = useMemo(() => {
    return poDetail1State.detailsByRef?.length > 0
      ? poDetail1State.detailsByRef.map((detail) => ({
          id: detail.id || detail.sno || Math.random(),
          item_no: detail.item_no || "",
          description: detail.alternate_product_name || "",
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
          total: parseFloat(detail.final_product_amount) || 0,
        }))
      : [];
  }, [poDetail1State.detailsByRef]);

  // Get data from Redux state - PO Detail 4 (Attachments)
  const attachmentsrows = useMemo(() => {
    // Filter by current PO reference number
    const filteredFiles =
      poDetail4State.files?.filter((file) => file.po_ref_no === poRefNo) || [];

    return filteredFiles.length > 0
      ? filteredFiles.map((file) => ({
          id: file.sno || Math.random(),
          po_ref_no: file.po_ref_no,
          filename: file.file_name || "",
          description_details: file.description_details || "",
          content_type: file.content_type || "application/octet-stream",
          status_master: file.status_master || "ACTIVE",
          created_by: file.created_by || "",
          created_date: file.created_date || "",
          file_type: file.file_type || "DOCUMENT",
        }))
      : [];
  }, [poDetail4State.files, poRefNo]);

  // Get PO header data
  const poHeaderData = useMemo(() => {
    return (
      poHeaderState.header || {
        supplier_name: "JOSEPHAT ANDREA SHAYO",
        supplier_code: "LOCS100104",
        contact_person: "JOSEPHAT",
        po_ref_no: "3517",
        status: "Open; Printed",
        posting_date: "08.12.25",
        delivery_date: "30.12.25",
        document_date: "08.12.25",
      }
    );
  }, [poHeaderState.header]);

  // Helper functions
  const calculatePriceAfterDiscount = (unitPrice, discount) => {
    return unitPrice - (unitPrice * discount) / 100;
  };

  const calculateTotal = (quantity, unitPrice, discount = 0) => {
    const subtotal = quantity * unitPrice;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  // Modal management
  const openModalForm = ({
    title,
    fields,
    submitText,
    onSubmit,
    onCloseCallback,
  }) => {
    setModalForm({
      isOpen: true,
      title,
      fields,
      submitText,
      onSubmit,
      onCloseCallback,
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
      submitText: "Submit",
      onSubmit: null,
      onCloseCallback: null,
    });
    setEditingItem(null);
    setEditingAttachment(null);
    setSelectedFile(null);
  };

  // ==================== SUPPLIER HANDLERS ====================
  const handleSupplierEdit = async (data) => {
    try {
      const headerData = {
        po_ref_no: poRefNo,
        po_date: new Date().toISOString().split("T")[0],
        company_id: 1,
        supplier_id: 1,
        purchase_type: "Standard",
        remarks: data.remarks || "",
        created_by: data.created_by || "Admin",
        created_mac_address: data.created_mac_address || "",
      };

      if (poHeaderState.header) {
        await dispatch(
          updatePOHeader({
            poRefNo: poRefNo,
            headerData: headerData,
          })
        ).unwrap();
      } else {
        await dispatch(createPOHeader(headerData)).unwrap();
      }

      closeModalForm();
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating supplier:", error);
      return Promise.reject(error);
    }
  };

  // ==================== ITEM HANDLERS ====================
  const handleAddItem = async (data) => {
    try {
      const detailData = {
        po_ref_no: poRefNo,
        item_no: data.item_no,
        alternate_product_name: data.description,
        request_store_id: 1,
        total_pcs: parseFloat(data.quantity) || 0,
        rate_per_pcs: parseFloat(data.unit_price) || 0,
        discount_percentage: parseFloat(data.discount) || 0,
        vat_percentage:
          parseFloat(data.tax_code?.replace("GST", "").replace("VAT", "")) || 0,
        remarks: data.qc_remark || "OK",
        created_by: "Admin",
        created_mac_address: "",
      };

      await dispatch(createPODetail1(detailData)).unwrap();
      closeModalForm();
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding item:", error);
      return Promise.reject(error);
    }
  };

  const handleEditItem = async (data) => {
    if (!editingItem) return;

    try {
      const detailData = {
        item_no: data.item_no,
        alternate_product_name: data.description,
        total_pcs: parseFloat(data.quantity) || 0,
        rate_per_pcs: parseFloat(data.unit_price) || 0,
        discount_percentage: parseFloat(data.discount) || 0,
        vat_percentage:
          parseFloat(data.tax_code?.replace("GST", "").replace("VAT", "")) || 0,
        remarks: data.qc_remark || "OK",
      };

      await dispatch(
        updatePODetail1({
          id: editingItem.id,
          detailData: detailData,
        })
      ).unwrap();

      closeModalForm();
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating item:", error);
      return Promise.reject(error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await dispatch(deletePODetail1(itemId)).unwrap();
        console.log("Item deleted successfully");
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      }
    }
  };

  // ==================== ATTACHMENT HANDLERS ====================
  const handleAddAttachment = async (data) => {
    try {
      if (!selectedFile) {
        alert("Please select a file to upload");
        return Promise.reject("No file selected");
      }

      const formData = new FormData();
      formData.append("po_ref_no", poRefNo);
      formData.append("description_details", data.description_details || "");
      formData.append("file_name", selectedFile.name);
      formData.append(
        "content_type",
        selectedFile.type || "application/octet-stream"
      );
      formData.append("status_master", data.status_master || "ACTIVE");
      formData.append("created_by", data.created_by || "Admin");
      formData.append("created_mac_address", data.created_mac_address || "");
      formData.append("file_type", data.file_type || "DOCUMENT");
      formData.append("file", selectedFile);

      await dispatch(createPODetail4(formData)).unwrap();
      closeModalForm();
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding attachment:", error);
      return Promise.reject(error);
    }
  };

  const handleEditAttachment = async (data) => {
    if (!editingAttachment) return;

    try {
      const metadata = {
        PO_REF_NO: data.po_ref_no || poRefNo,
        DESCRIPTION_DETAILS: data.description_details || "",
        STATUS_MASTER: data.status_master || "ACTIVE",
        FILE_TYPE: data.file_type || "DOCUMENT",
        UPDATED_BY: data.created_by || "Admin",
      };

      await dispatch(
        updatePODetail4({
          id: editingAttachment.id,
          metadata: metadata,
        })
      ).unwrap();

      closeModalForm();
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating attachment:", error);
      return Promise.reject(error);
    }
  };

  const handleDeleteAttachment = async (id) => {
    if (window.confirm("Delete this attachment?")) {
      try {
        await dispatch(deletePODetail4(id)).unwrap();
        console.log("Attachment deleted successfully");
      } catch (error) {
        console.error("Error deleting attachment:", error);
        alert("Failed to delete attachment. Please try again.");
      }
    }
  };

  // ==================== ROW SELECTION HANDLERS ====================
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

  // ==================== FIELD CONFIGURATIONS ====================
  const supplierFields = [
    {
      name: "name",
      label: "Supplier Name",
      defaultValue: poHeaderData.supplier_name || "",
      required: true,
    },
    {
      name: "code",
      label: "Supplier Code",
      defaultValue: poHeaderData.supplier_code || "",
      required: true,
    },
    {
      name: "contact",
      label: "Contact Person",
      defaultValue: poHeaderData.contact_person || "",
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
      name: "quantity",
      label: "Quantity",
      type: "number",
      placeholder: "0",
      required: true,
    },
    {
      name: "unit_price",
      label: "Unit Price (₹)",
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
      name: "description_details",
      label: "Description",
      placeholder: "Enter file description",
    },
    {
      name: "file_type",
      label: "File Type",
      placeholder: "DOCUMENT",
    },
    {
      name: "status_master",
      label: "Status",
      placeholder: "ACTIVE",
    },
    {
      name: "created_by",
      label: "Created By",
      placeholder: "Admin",
    },
    {
      name: "file",
      label: "Select File",
      type: "file",
      required: true,
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

  // Calculate summary statistics
  const totalValue = rows.reduce((sum, row) => sum + row.total, 0);
  const avgDiscount =
    rows.length > 0
      ? rows.reduce((sum, row) => sum + row.discount, 0) / rows.length
      : 0;
  const qcPassRate =
    rows.length > 0
      ? (rows.filter((row) => row.qc_remark === "OK").length / rows.length) *
        100
      : 0;

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
                    {poHeaderData.supplier_name}
                  </div>
                }
                leftContent={
                  <>
                    <div className="text-xs sm:text-sm text-slate-600">
                      Code: {poHeaderData.supplier_code}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">
                      Contact: {poHeaderData.contact_person}
                    </div>
                  </>
                }
                rightContent={
                  <>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">PO Number</span>
                      <span className="font-medium text-slate-900">
                        {poHeaderData.po_ref_no}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">Status</span>
                      <span className="font-medium text-slate-900">
                        {poHeaderData.status}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">Posting Date</span>
                      <span className="font-medium text-slate-900">
                        {poHeaderData.posting_date}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">Delivery Date</span>
                      <span className="font-medium text-slate-900">
                        {poHeaderData.delivery_date}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">Document Date</span>
                      <span className="font-medium text-slate-900">
                        {poHeaderData.document_date}
                      </span>
                    </div>
                  </>
                }
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
                loading={isLoadingLogistics}
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
                  ₹ {totalValue.toFixed(2)}
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
                  {avgDiscount.toFixed(1)}%
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
                  {qcPassRate.toFixed(0)}%
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
        onSubmit={async (data) => {
          // Handle file input if present
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput?.files?.length > 0) {
            setSelectedFile(fileInput.files[0]);
          }

          // Call the modal's submit handler
          return modalForm.onSubmit
            ? modalForm.onSubmit(data)
            : Promise.resolve();
        }}
      />
    </>
  );
};

export default ExamplePage;
