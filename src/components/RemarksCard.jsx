import React from "react";

const RemarksCard = ({ remarks }) => (
  <section className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
    <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-2">Remarks</h3>
    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{remarks}</p>
  </section>
);

export default RemarksCard;
