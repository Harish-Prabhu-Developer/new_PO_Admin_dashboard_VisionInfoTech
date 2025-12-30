import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPOHeaders,
  createPOHeader,
  updatePOHeader,
  deletePOHeader,
  clearError,
} from "../redux/Slice/PO/poHeaderSlice";
import DataTable from "../components/DataTable";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import ModelForm from "../components/ModelForm";

/* ---------- Main Page ---------- */
const UsersPage = () => {
  const dispatch = useDispatch();
  const { headers, status, error } = useSelector(
    (state) => state.poHeader
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  const [form, setForm] = useState({
    po_ref_no: "",
    po_date: "",
    purchase_type: "",
    company_id: "",
    supplier_id: "",
    remarks: "",
    created_by: "ADMIN",
  });

  /* ---------- Fetch Data ---------- */
  useEffect(() => {
    dispatch(fetchPOHeaders({ page: 1, limit: 20 }));
  }, [dispatch]);

  /* ---------- Add / Edit ---------- */
  const openAdd = () => {
    setEditing(null);
    setForm({
      po_ref_no: "",
      po_date: "",
      purchase_type: "",
      company_id: "",
      supplier_id: "",
      remarks: "",
      created_by: "ADMIN",
    });
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      po_ref_no: row.po_ref_no,
      po_date: row.po_date,
      purchase_type: row.purchase_type || "",
      company_id: row.company_id || "",
      supplier_id: row.supplier_id || "",
      remarks: row.remarks || "",
      created_by: "ADMIN",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editing) {
      dispatch(
        updatePOHeader({
          poRefNo: editing.po_ref_no,
          headerData: form,
        })
      );
    } else {
      dispatch(createPOHeader(form));
    }

    setModalOpen(false);
  };

  /* ---------- Delete ---------- */
  const openDelete = (row) => {
    setDeleteRow(row);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!deleteRow) return;

    dispatch(deletePOHeader(deleteRow.po_ref_no));

    setDeleteModalOpen(false);
    setDeleteRow(null);
  };

  /* ---------- Table Columns ---------- */
  const columns = useMemo(
    () => [
      {
        key: "po_ref_no",
        label: "PO Ref",
        icon: FileText,
        align: "text-left",
      },
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
              className="rounded-md p-1 text-blue-600 hover:bg-blue-50"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => openDelete(row)}
              className="rounded-md p-1 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4 ">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">
            Purchase Order Headers
          </h1>
          <p className="text-xs text-slate-500">
            Manage PO headers, suppliers, and purchase details
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add PO
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
          {error}
          <button
            onClick={() => dispatch(clearError())}
            className="ml-2 underline"
          >
            clear
          </button>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={headers}
        isLoading={status === "loading"}
        itemsPerPage={10}
      />

      {/* Add / Edit Modal */}
      <ModelForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit PO Header" : "Add PO Header"}
      >
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              className="input"
              placeholder="PO Ref No"
              value={form.po_ref_no}
              disabled={!!editing}
              onChange={(e) =>
                setForm({ ...form, po_ref_no: e.target.value })
              }
              required
            />
            <input
              type="date"
              className="input"
              value={form.po_date}
              onChange={(e) =>
                setForm({ ...form, po_date: e.target.value })
              }
              required
            />
            <input
              className="input"
              placeholder="Purchase Type"
              value={form.purchase_type}
              onChange={(e) =>
                setForm({ ...form, purchase_type: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Company ID"
              value={form.company_id}
              onChange={(e) =>
                setForm({ ...form, company_id: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Supplier ID"
              value={form.supplier_id}
              onChange={(e) =>
                setForm({ ...form, supplier_id: e.target.value })
              }
            />
          </div>

          <textarea
            className="input"
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) =>
              setForm({ ...form, remarks: e.target.value })
            }
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </ModelForm>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800">
              Delete PO Header
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete PO{" "}
              <span className="font-semibold text-red-600">
                {deleteRow?.po_ref_no}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteRow(null);
                }}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
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
