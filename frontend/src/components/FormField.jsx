const FormField = ({ label, error, hint, ...inputProps }) => (
  <label className="form-field">
    <span className="form-field__label">{label}</span>
    <input className={`form-field__input${error ? " form-field__input--error" : ""}`} {...inputProps} />
    {error && <span className="form-field__message form-field__message--error">{error}</span>}
    {!error && hint && <span className="form-field__message">{hint}</span>}
  </label>
);

export default FormField;
