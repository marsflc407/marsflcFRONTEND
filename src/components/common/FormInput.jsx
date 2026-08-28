function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  error,
  placeholder,
  rows = 5,
  ...props
}) {
  const inputId = name || label?.toLowerCase().replace(/\s+/g, "-");
  const isTextarea = type === "textarea";
  const inputClassName = `w-full border bg-white px-4 py-3 font-body text-base text-dark transition-colors focus:outline-none focus:ring-2 ${
    error
      ? "border-primary focus:border-primary focus:ring-primary/20"
      : "border-dark/15 focus:border-primary focus:ring-primary/20"
  }`;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-dark/70"
      >
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={inputClassName}
          placeholder={placeholder}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={inputClassName}
          placeholder={placeholder}
          {...props}
        />
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-primary">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;
