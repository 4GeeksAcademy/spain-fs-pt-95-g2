import { useState } from "react"


const ModalAddCategory = ({ show , onClose , onSave }) => {
    const [name , setName] = useState("");
    const [description , setDescription] = useState("");

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSave({ name, description });
        setName("");
        setDescription("");
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">Add Category</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <div className="mb-2">
                            <label className="form-label">Name</label>
                            <input
                             className="form-control"
                             value={name}
                             onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Description</label>
                            <textarea
                             className="form-control"
                             rows={2}
                             value={description}
                             onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalAddCategory;