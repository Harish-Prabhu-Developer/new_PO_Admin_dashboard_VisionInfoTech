import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../Layout/layout";
import SupplierInfo from "../components/SupplierInfo";
import ModelForm from "../components/ModelForm";
import { fetchPOHeaders,updatePOHeader } from "../redux/Slice/PO/poHeaderSlice";
import useUser from "../hooks/useUser";
import { formatMonthDayYear } from "../utils/DateUtils";
import toast from "react-hot-toast";

const INITIAL_FORM = {
  po_ref_no: "",
  po_date: "",
  purchase_type: "",
  company_id: "",
  supplier_id: "",
  remarks: "",
  created_by: "",
};

const PurchaseOrderPage = () => {
  const dispatch = useDispatch();
  const { headers } = useSelector((state) => state.poHeader);
  const { username } = useUser();

  const [form, setForm] = useState(INITIAL_FORM);
  const [editForm, setEditForm] = useState(INITIAL_FORM);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  /* ---------- Fetch PO Headers ---------- */
  useEffect(() => {
    dispatch(fetchPOHeaders({ page: 1, limit: 20 }));
  }, [dispatch]);

  /* ---------- Populate form AFTER headers load ---------- */
  useEffect(() => {
    if (!headers?.length || !username) return;

    const supplierData = headers.find(
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
    } = supplierData;

    setForm({
      ...supplierData, // ✅ mandatory
      po_ref_no,
      po_date,
      purchase_type,
      company_id,
      supplier_id,
      remarks,
      created_by,
    });
  }, [headers, username]);

  /* ---------- Edit Handlers ---------- */
  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleEditSubmit = async() => {
    const submitData = {
      po_date: editForm.po_date,
      purchase_type: editForm.purchase_type,
      company_id: editForm.company_id,
      supplier_id: editForm.supplier_id,
      remarks: editForm.remarks,
      modified_by: editForm.created_by || "ADMIN",
    };
    
    toast.promise(
      dispatch(updatePOHeader({ poRefNo: form.po_ref_no, headerData: submitData })),
      {
        loading: "Updating...",
        success: <b>PO Header updated successfully!</b>,
        error: (err) => <b>{err?.payload || 'Could not update PO Header.'}</b>,
      }
    );
    
    setForm((prev) => ({
      ...prev,
      ...editForm,
    }));
    setShowSupplierModal(false);
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
    });
    setShowSupplierModal(true);
  };

  return (
    <>
      <Layout
        header={
          <SupplierInfo
            title={
              <span className="text-sm font-semibold uppercase tracking-wide text-black">
                Supplier
              </span>
            }
            header={
              <div className="text-sm sm:text-base md:text-lg font-bold text-slate-900">
                {form.created_by || "Supplier Name"}
              </div>
            }
            leftContent={
              <>
                {/* Register Date */}
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600">Register Date</span>
                  <span className="font-medium text-slate-900">
                    {formatMonthDayYear(form.created_date) || "-"}
                  </span>
                </div>

                {/* Supplier ID */}
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600">Supplier ID</span>
                  <span className="font-medium text-slate-900">
                    {form.supplier_id || "-"}
                  </span>
                </div>

                {/* Remarks */}
                <div className="text-[14px]">
                  <span className="text-slate-600 block mb-1">Remarks</span>
                  <span
                    className="block font-medium text-slate-900 line-clamp-1"
                    title={form.remarks || "-"}
                  >
                    {form.remarks || "-"}
                  </span>
                </div>
              </>
            }
            rightContent={
              <>
                <div className="flex justify-between">
                  <span className="text-slate-600">PO Ref No</span>
                  <span className="font-medium text-slate-900">
                    {form.po_ref_no || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">PO Date</span>
                  <span className="font-medium text-slate-900">
                    {formatMonthDayYear(form.po_date) || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Purchase Type</span>
                  <span className="font-medium text-slate-900">
                    {form.purchase_type || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Company ID</span>
                  <span className="font-medium text-slate-900">
                    {form.company_id || "-"}
                  </span>
                </div>
              </>
            }
            onEdit={openEditModal}
          />
        }
      />

      {/* ---------- Edit Supplier Modal ---------- */}
      <ModelForm
        open={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        title="Edit Supplier Details"
      >
        <div className="space-y-4">
          {[
            { label: "PO Reference No", name: "po_ref_no" },
            { label: "Purchase Type", name: "purchase_type" },
            { label: "Company ID", name: "company_id" },
            { label: "Supplier ID", name: "supplier_id" },
            { label: "Created By", name: "created_by" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="text-sm text-slate-600">{label}</label>
              <input
                name={name}
                value={editForm[name]}
                onChange={handleEditChange}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          ))}

          <div>
            <label className="text-sm text-slate-600">PO Date</label>
            <input
              type="date"
              name="po_date"
              value={editForm.po_date && !isNaN(new Date(editForm.po_date)) ? new Date(editForm.po_date).toISOString().split("T")[0] : ""}
              onChange={handleEditChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Remarks</label>
            <textarea
              name="remarks"
              rows={3}
              value={editForm.remarks}
              onChange={handleEditChange}
              className="w-full border rounded-md px-3 py-2 text-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowSupplierModal(false)}
              className="px-4 py-2 text-sm border rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditSubmit}
              className="px-4 py-2 text-sm bg-slate-900 text-white rounded-md"
            >
              Update
            </button>
          </div>
        </div>
      </ModelForm>
    </>
  );
};

export default PurchaseOrderPage;
