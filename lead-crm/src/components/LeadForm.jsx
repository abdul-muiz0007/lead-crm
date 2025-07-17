import { useState, useEffect } from "react";

const LeadForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    status: "New",
    contactDate: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: "", company: "", status: "New", contactDate: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="row mb-2">
        <div className="col">
          <input
            type="text"
            name="name"
            placeholder="Lead Name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col">
          <input
            type="text"
            name="company"
            placeholder="Company"
            className="form-control"
            value={form.company}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mb-2">
        <div className="col">
          <select
            name="status"
            className="form-select"
            value={form.status}
            onChange={handleChange}
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Won</option>
            <option>Lost</option>
          </select>
        </div>
        <div className="col">
          <input
            type="date"
            name="contactDate"
            className="form-control"
            value={form.contactDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="btn btn-success w-100" type="submit">
        {initialData ? "Update Lead" : "Add Lead"}
      </button>
    </form>
  );
};

export default LeadForm;