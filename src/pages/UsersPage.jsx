import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPOHeaders,
  createPOHeader,
  updatePOHeader,
  deletePOHeader,
} from "../redux/Slice/PO/poHeaderSlice";
import DataTable from "../components/DataTable";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import ModelForm from "../components/ModelForm";
import toast from "react-hot-toast";

/* ---------- Main Page ---------- */
const UsersPage = () => {
  const dispatch = useDispatch();
  const { headers, status } = useSelector((state) => state.poHeader);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  /* ---------- Fetch Data ---------- */
  useEffect(() => {
    dispatch(fetchPOHeaders({ page: 1, limit: 20 }));
  }, [dispatch]);

  /* ---------- Add / Edit ---------- */
  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setModalOpen(true);
  };

/* ---------- Submit ---------- */
const handleHeaderFormSubmit = async (data) => {
  console.log("Form Data →", data);
  
  // Prepare payload according to Swagger spec
  const payload = {
    po_ref_no: data.po_ref_no?.trim(),
    po_date: data.po_date,
    purchase_type: data.purchase_type?.trim() || null,
    company_id: data.company_id ? Number(data.company_id) : null,
    supplier_id: data.supplier_id ? Number(data.supplier_id) : null,
    po_store_id: data.po_store_id ? Number(data.po_store_id) : null,
    remarks: data.remarks?.trim() || null,
    created_by: data.created_by || "ADMIN",
    created_mac_address: data.created_mac_address || ""
  };

  console.log("FINAL PAYLOAD →", payload);

  if (editing) {
    // For update, remove created_by and created_mac_address
    delete payload.created_by;
    delete payload.created_mac_address;
    
    await toast.promise(
      dispatch(
        updatePOHeader({
          poRefNo: editing.po_ref_no,
          headerData: payload,
        })
      ).unwrap(),
      {
        loading: "Updating...",
        success: "PO Header updated successfully!",
        error: (err) => {
          console.error("Update error:", err);
          return err?.message || err?.payload?.error || "Could not update PO Header";
        },
      }
    );
  } else {
    // For create, ensure required fields are present
    if (!payload.po_ref_no || !payload.po_date || !payload.company_id || !payload.supplier_id) {
      toast.error("Please fill all required fields (PO Ref No, Date, Company ID, Supplier ID)");
      return;
    }
    
    await toast.promise(
      dispatch(createPOHeader(payload)).unwrap(),
      {
        loading: "Creating...",
        success: "PO Header created successfully!",
        error: (err) => {
          console.error("Create error:", err);
          return err?.message || err?.payload?.error || "Could not create PO Header";
        },
      }
    );
  }

  setModalOpen(false);
  // Refresh data
  dispatch(fetchPOHeaders({ page: 1, limit: 20 }));
};
  /* ---------- Delete ---------- */
  const openDelete = (row) => {
    setDeleteRow(row);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!deleteRow) return;

    toast.promise(dispatch(deletePOHeader(deleteRow.po_ref_no)), {
      loading: "Deleting...",
      success: "PO Header deleted successfully!",
      error: "Could not delete PO Header",
    });

    setDeleteModalOpen(false);
    setDeleteRow(null);
  };

  /* ---------- Table Columns ---------- */
  const columns = useMemo(
    () => [
      { key: "po_ref_no", label: "PO Ref", icon: FileText },
      { key: "po_date", label: "Date" },
      { key: "purchase_type", label: "Type" },
      { key: "company_id", label: "Company" },
      { key: "supplier_id", label: "Supplier" },
      {
        key: "actions",
        label: "Actions",
        render: (_, row) => (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => openEdit(row)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => openDelete(row)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Purchase Order Headers</h1>
          <p className="text-sm text-gray-500">
            Manage PO headers and suppliers
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Plus size={16} />
          Add PO
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={headers}
        isLoading={status === "loading"}
      />

      {/* Add / Edit Modal */}
      <ModelForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit PO Header" : "Add PO Header"}
        fields={[
  {
    label: "PO Ref No",
    name: "po_ref_no",
    type: "text",
    required: true,
    defaultValue: editing?.po_ref_no ?? "",
  },
  {
    label: "PO Date",
    name: "po_date",
    type: "date",
    required: true,
    defaultValue: editing?.po_date
      ? new Date(editing.po_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  },
  {
    label: "Purchase Type",
    name: "purchase_type",
    type: "text",
    defaultValue: editing?.purchase_type ?? "",
  },
  {
    label: "Company ID",
    name: "company_id",
    type: "number",
    required: true,
    defaultValue: editing?.company_id ?? "",
  },
  {
    label: "Supplier ID",
    name: "supplier_id",
    type: "number",
    required: true,
    defaultValue: editing?.supplier_id ?? "",
  },
  {
    label: "PO Store ID",
    name: "po_store_id",
    type: "number",
    defaultValue: editing?.po_store_id ?? "",
  },
  {
    label: "Remarks",
    name: "remarks",
    type: "textarea",
    rows: 3,
    defaultValue: editing?.remarks ?? "",
  },
  // Add created_by field for new entries
  ...(editing ? [] : [{
    label: "Created By",
    name: "created_by",
    type: "text",
    required: true,
    defaultValue: "ADMIN",
  }])
]}
        submitText={editing ? "Update" : "Create"}
        onSubmit={handleHeaderFormSubmit}
        isLoading={status === "loading"}
      />

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-semibold text-lg">Delete PO Header</h3>
            <p className="mt-2">
              Delete PO <b>{deleteRow?.po_ref_no}</b>?
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
